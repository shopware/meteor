# Codebase Concerns

**Analysis Date:** 2026-04-10

## Tech Debt

**Admin SDK bridge core is a high-blast-radius change surface:**
- Issue: `packages/admin-sdk/src/channel.ts` (644 lines) and `packages/admin-sdk/src/message-types.ts` (192 lines) centralize request/response transport, serialization hooks, callback correlation, dataset privilege validation, and the public message contract. Most public modules in `packages/admin-sdk/src/**` are thin wrappers over this path, so small changes in the bridge ripple across the package.
- Files: `packages/admin-sdk/src/channel.ts`, `packages/admin-sdk/src/message-types.ts`, `packages/admin-sdk/src/index.ts`, `packages/admin-sdk/src/_internals/serializer/index.ts`
- Impact: Runtime regressions are likely to appear as cross-window messaging failures, broken serialization, or subtle contract drift that TypeScript alone does not catch.
- Fix approach: Split transport, pending-callback tracking, registry management, and privilege enforcement into smaller internal modules; keep `packages/admin-sdk/src/message-types.ts` additive-only and add focused tests for each extracted responsibility.

**`mt-data-table` has grown into a monolith with coupling to many behaviors:**
- Issue: `packages/component-library/src/components/table-and-list/mt-data-table/mt-data-table.vue` is 2,838 lines and owns filtering, sorting, drag/drop, sticky columns, bulk actions, search, settings, pagination, and multiple render modes inside one SFC. The companion spec at `packages/component-library/src/components/table-and-list/mt-data-table/mt-data-table.spec.ts` is also 1,282 lines, which is a signal that the unit boundary is too large.
- Files: `packages/component-library/src/components/table-and-list/mt-data-table/mt-data-table.vue`, `packages/component-library/src/components/table-and-list/mt-data-table/mt-data-table.spec.ts`, `packages/component-library/src/directives/dragdrop.directive.ts`, `packages/component-library/src/directives/stickyColumn.directive.ts`
- Impact: Any feature work in the table risks unrelated regressions, and test maintenance cost rises with every new branch in the component.
- Fix approach: Carve out head cells, selection state, column settings, and drag/drop orchestration into composables or subcomponents with their own specs; keep the top-level SFC focused on composition.

**Entity wrappers trade type safety for convenience:**
- Issue: the admin-SDK-backed wrappers rely on `any`, `console.error`, and `@ts-expect-error` in core data paths instead of converging on typed repository contracts.
- Files: `packages/component-library/src/components/entity/mt-entity-data-table/mt-entity-data-table.vue`, `packages/component-library/src/components/entity/mt-entity-select/mt-entity-select.vue`
- Impact: The most integration-heavy components are also the loosest typed ones, so regressions at the seam between `@shopware-ag/meteor-component-library` and `@shopware-ag/meteor-admin-sdk` are easier to ship and harder to refactor confidently.
- Fix approach: Introduce explicit repository adapter types for these wrappers, remove `any`-based props and collections incrementally, and test them against realistic repository stubs.

**Icon sync is still held together by unchecked assumptions from Figma responses:**
- Issue: the Figma import path suppresses typing errors around Axios clients and response shapes, then builds metadata from string parsing and inferred node structure.
- Files: `packages/icon-kit/src/index.ts`, `packages/icon-kit/src/figma/index.ts`, `packages/icon-kit/src/figma/util/index.ts`
- Impact: API shape changes or malformed design data can fail at runtime during sync jobs instead of at compile time, which is especially risky because the workflow is used to open automated update PRs.
- Fix approach: Replace `@ts-expect-error` sites with explicit response types and runtime validation, especially around `getFile`, `getImages`, `getNodeInfo`, and description/tag parsing.

## Known Bugs

**Formatting CI mutates code instead of proving formatting is clean:**
- Symptoms: the "Check formatting" step runs `pnpm turbo run format`, but multiple package `format` scripts write changes instead of checking them. That means CI can succeed after rewriting files instead of failing on a dirty tree.
- Files: `.github/workflows/tests.yml`, `packages/component-library/package.json`, `packages/icon-kit/package.json`, `packages/tokens/package.json`, `packages/create-meteor-extension/package.json`
- Trigger: run the `static-analysis` job in `.github/workflows/tests.yml`.
- Workaround: change the workflow to use `format:check` everywhere or run `format` followed by `git diff --exit-code`.

## Security Considerations

**Admin SDK response handling trusts callback IDs more than sender identity:**
- Risk: the response listener in `packages/admin-sdk/src/channel.ts` accepts any `message` event whose payload contains the matching `_callbackId`, then parses and resolves it without verifying `event.origin` or `event.source` against the original target.
- Files: `packages/admin-sdk/src/channel.ts`
- Current mitigation: callbacks use generated IDs, and dataset payloads go through privilege validation in `packages/admin-sdk/src/channel.ts`.
- Recommendations: bind pending callbacks to the expected `Window` and origin, reject mismatched responders, and keep the response path as strict as the request validation path.

## Performance Bottlenecks

**Location URL syncing polls continuously:**
- Problem: `startAutoUrlUpdater()` watches URL changes with `setInterval(..., 50)` and keeps running until manually stopped.
- Files: `packages/admin-sdk/src/location/index.ts`
- Cause: URL updates are implemented as polling instead of an event-driven mechanism.
- Improvement path: wrap `history.pushState` and `history.replaceState`, listen to `popstate`, and scope the updater lifecycle so iframe views do not keep idle timers running.

**Table rendering complexity scales poorly with new features:**
- Problem: `mt-data-table` mixes large templates, many reactive branches, multiple directives, and nested popovers in a single render tree.
- Files: `packages/component-library/src/components/table-and-list/mt-data-table/mt-data-table.vue`, `packages/component-library/src/components/table-and-list/mt-data-table/sub-components/mt-data-table-settings/mt-data-table-settings.vue`
- Cause: the component keeps accumulating product behaviors instead of delegating them to smaller units.
- Improvement path: move feature-specific state into composables and isolate expensive DOM sections behind smaller components with narrower props.

## Fragile Areas

**`create-meteor-extension` command couples prompts, filesystem mutation, and process termination:**
- Files: `packages/create-meteor-extension/src/commands/create-meteor-extension.ts`, `packages/create-meteor-extension/__tests__/cli-integration.test.ts`
- Why fragile: the command mixes `prompt.ask`, `process.exit(1)`, template copying, EJS rendering, and rollback logic in one function. The tests explicitly note that interactive prompt behavior is not properly mocked and currently fall back to regex-only validation for extension names.
- Safe modification: extract validation, destination planning, template rendering, and rollback into pure helpers before changing CLI behavior.
- Test coverage: failure paths around prompt validation, rollback after partial writes, and template processing errors are not covered.

**Admin SDK code and docs drift independently:**
- Files: `packages/admin-sdk/src/location/index.ts`, `packages/admin-sdk/src/telemetry/index.ts`, `docs/admin-sdk/api-reference/location.md`, `docs/admin-sdk/api-reference/index.md`
- Why fragile: the package requires manual docs sync, but there is already a docs TODO in `packages/admin-sdk/src/location/index.ts` and there is no telemetry page under `docs/admin-sdk/api-reference/` even though `packages/admin-sdk/src/index.ts` exports `telemetry`.
- Safe modification: treat doc updates as part of every public API change, and add a release checklist that compares `packages/admin-sdk/src/index.ts` exports with `docs/admin-sdk/api-reference/**`.
- Test coverage: no automated check verifies that public API exports are documented.

**Real Shopware acceptance coverage exists but is not part of main CI:**
- Files: `.github/workflows/tests.yml`, `examples/admin-sdk-plugin/tests/acceptance/package.json`, `examples/admin-sdk-plugin/tests/acceptance/tests/location.spec.ts`, `examples/admin-sdk-plugin/tests/acceptance/tests/dataset.spec.ts`
- Why fragile: the acceptance suite is present, but the `ats` job in `.github/workflows/tests.yml` is fully commented out, including the multi-version Shopware matrix.
- Safe modification: restore the acceptance job in a reduced matrix if needed, but keep at least one real Shopware run on pull requests for the example plugin.
- Test coverage: current CI relies on unit tests and the SDK iframe e2e suite, but not the example plugin’s acceptance path.

## Scaling Limits

**Table feature growth is approaching the practical limit of a single SFC:**
- Current capacity: one 2,838-line file in `packages/component-library/src/components/table-and-list/mt-data-table/mt-data-table.vue` with a 1,282-line spec in `packages/component-library/src/components/table-and-list/mt-data-table/mt-data-table.spec.ts`.
- Limit: adding more table features will keep increasing render, event, and accessibility complexity in the same component, which makes localized changes harder.
- Scaling path: define hard boundaries for subcomponents and composables, then move one concern at a time behind stable interfaces.

**Compatibility validation does not scale across Shopware versions yet:**
- Current capacity: `.github/workflows/tests.yml` runs unit tests, static analysis, and the SDK Playwright suite, while the version-matrix ATS job remains commented out.
- Limit: regressions against real Shopware integrations can survive until manual testing because the widest compatibility path is not enforced continuously.
- Scaling path: re-enable the ATS job with the smallest stable matrix first, then widen coverage as Vue-version constraints are addressed.

## Dependencies at Risk

**`@shopware-ag/meteor-admin-sdk` runs on a legacy toolchain relative to the rest of the repo:**
- Risk: `packages/admin-sdk/package.json` still depends on `jest` 27, `typescript` 4.9, `vite` 2.8, and `vue` 2.7, while `packages/component-library/package.json` is on Vue 3 and newer Vite/Vitest, and the repo root plus GitHub workflows target newer Node versions in `package.json` and `.github/workflows/*.yml`.
- Impact: maintenance cost rises whenever shared tooling, Node versions, or workspace-wide scripts change, because `packages/admin-sdk` is effectively on its own compatibility island.
- Migration plan: isolate framework-independent bridge logic first, then modernize the package build/test stack in controlled steps instead of trying to jump the whole surface at once.

## Missing Critical Features

**The component-library notification mixin is still a stub:**
- Problem: `createNotification()` is not implemented, yet all helper methods build notification payloads and forward to it.
- Files: `packages/component-library/src/mixins/notification.mixin.ts`
- Blocks: a shared notification path inside the component library itself; consumers either get a no-op or have to replace the behavior elsewhere.

**Telemetry is public API but not discoverable in docs:**
- Problem: `packages/admin-sdk/src/index.ts` exports `telemetry`, `packages/admin-sdk/src/telemetry/index.ts` defines the API, but there is no matching telemetry page under `docs/admin-sdk/api-reference/`.
- Blocks: adoption of the newer telemetry helper, consistent instrumentation by consumers, and reliable docs-driven release validation.

## Test Coverage Gaps

**Entity wrappers are integration-heavy and untested:**
- What's not tested: repository-backed behavior for `mt-entity-data-table` and `mt-entity-select`, including loading, pagination, selected-entity hydration, delete flows, and admin-SDK interaction.
- Files: `packages/component-library/src/components/entity/mt-entity-data-table/mt-entity-data-table.vue`, `packages/component-library/src/components/entity/mt-entity-select/mt-entity-select.vue`
- Risk: component-library changes can break SDK-backed entity screens without a local test catching it.
- Priority: High

**Location helpers are only partially validated despite being public runtime API:**
- What's not tested: `ResizeObserver` lifecycle, URL polling lifecycle, and teardown behavior in `packages/admin-sdk/src/location/index.ts`.
- Files: `packages/admin-sdk/src/location/index.ts`, `examples/admin-sdk-plugin/tests/acceptance/tests/location.spec.ts`, `.github/workflows/tests.yml`
- Risk: iframe resizing or URL propagation regressions can survive because there is no direct unit spec for the module and the real acceptance suite is not active in CI.
- Priority: High

**Icon synchronization lacks tests on the real Figma integration path:**
- What's not tested: network client behavior, Figma response parsing, metadata extraction, and the top-level sync orchestration.
- Files: `packages/icon-kit/src/index.ts`, `packages/icon-kit/src/figma/index.ts`, `packages/icon-kit/src/figma/util/index.ts`
- Risk: icon update jobs can fail or generate bad metadata when the upstream API or document structure changes, with only a workflow run exposing it.
- Priority: Medium

**CLI interactive and rollback paths are under-tested:**
- What's not tested: prompt-driven name entry, invalid interactive input handling, and rollback after mid-generation failures.
- Files: `packages/create-meteor-extension/src/commands/create-meteor-extension.ts`, `packages/create-meteor-extension/__tests__/cli-integration.test.ts`
- Risk: a broken scaffolding release can still look healthy in tests because current coverage focuses on happy-path non-interactive generation and regex validation.
- Priority: High

---

*Concerns audit: 2026-04-10*
