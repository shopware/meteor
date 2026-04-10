# Project Research Summary

**Project:** Meteor Admin SDK Interactive Tutorial
**Domain:** Interactive in-browser SDK tutorial package
**Researched:** 2026-04-10
**Confidence:** HIGH

## Executive Summary

This project should be built as a new Vue 3 + Vite package inside `packages/` that teaches the real Meteor Admin SDK through a constrained browser-local tutorial runtime. The strongest recommendation across the research is to keep the learner-facing API real, keep the admin side fake but behaviorally correct, and keep the runtime intentionally narrow: one editable lesson entry, a sandboxed iframe preview, an `esbuild-wasm` worker, and a minimal fake admin shell that makes locations, positions, and notifications visible.

The v1 goal is not a generic playground and not a Shopware Administration clone. It is a guided split-pane tutorial with ordered lessons, starter code, run/reset/reveal controls, lightweight success checks, and a domain-specific fake shell that makes invisible SDK concepts concrete. The first proof should center on notifications, hidden runtime behavior, menu or component-section registration, and labeled location/position rendering.

The main risks are semantic drift from the real SDK contract, weak browser isolation, and scope expansion into a mini IDE or a fake-admin simulator that is too broad to teach clearly. The mitigation is consistent across the research: reuse real SDK message contracts and callback serialization behavior, enforce iframe isolation with `postMessage`, rebuild runtime sessions on every run/reset, and keep the supported lesson/runtime surface deliberately small.

## Key Findings

### Recommended Stack

Build on the repo's existing Vue ecosystem instead of introducing a second UI stack. The recommended core is Vue 3.5, Vite 5, TypeScript 5.7, the workspace `@shopware-ag/meteor-admin-sdk`, and the Meteor component library for shell chrome. For authoring and execution, use CodeMirror 6 with `vue-codemirror6`, compile in-browser with `esbuild-wasm` in a worker, isolate execution in sandboxed iframes, and persist lesson drafts/progress with `localforage`.

**Core technologies:**
- `vue` 3.5.x: tutorial shell and fake admin UI, aligned with the monorepo.
- `vite` 5.x: package dev/build pipeline with good repo fit.
- `typescript` 5.7.x: typed lesson manifests and package code on the repo's current line.
- `@shopware-ag/meteor-admin-sdk` via `workspace:*`: real learner-facing SDK semantics.
- `@shopware-ag/meteor-component-library` via `workspace:*`: shell UI primitives without recreating them.
- `codemirror` 6 + `vue-codemirror6`: lightweight editor already present in the repo.
- `esbuild-wasm`: browser-local bundling in a worker for explicit run cycles.
- `localforage`: local draft/progress persistence consistent with existing browser persistence patterns.
- `vitest` + `playwright`: unit coverage plus browser-level edit/run/reset verification.

### Expected Features

The table-stakes experience is a split-pane lesson workspace with ordered lessons, starter code, in-browser execution, a fake admin shell, clear runtime feedback, reset/solution actions, and visible representations of notifications plus location/position concepts. The v1 prototype should stay linear and focused: one editable entry file, local completion state, lesson-specific success checks, an inline call log, and the smallest fake admin shell that makes SDK behavior visible.

**Must have (v1):**
- Split-pane lesson UI with lesson content, editor, and preview.
- Linear lesson progression with local completion state.
- Starter code, explicit `Run`, `Reset`, and `Reveal solution`.
- Single editable lesson file with deterministic browser-local execution.
- Minimal fake admin shell with notification output and labeled extension surfaces.
- Runtime diagnostics plus lightweight lesson success checks.
- Visualization for `locationId` and `positionId`, including hidden-runtime context.

**Should have (strong differentiators):**
- Visual map of locations and positions.
- Event timeline or call log of SDK messages.
- Concept overlays that explain hidden vs rendered contexts.
- Lesson assertions tied to fake-shell state.
- Direct mapping from each lesson to existing docs and examples.

**Defer (v2+):**
- Multi-file editing.
- Package-manager or terminal simulation.
- Branching lesson paths.
- App/plugin mode switching.
- Broad API coverage such as datasets, subscriptions, or full devtools recreation.

### Architecture Approach

Keep v1 in a single new package, tentatively `packages/admin-sdk-tutorial`, with a strict three-layer runtime: tutorial host app, preview session manager, and sandboxed runtime iframes behind a fake admin shell. The host owns lessons, editor state, compilation, and session lifecycle. The fake admin shell owns only the subset of admin-side handlers needed for the first lessons. User code runs the real SDK client inside child iframes, and all communication flows through a typed `postMessage` bridge that mirrors real message names and callback transport.

**Major components:**
1. Lesson catalog and manifests: ordered lessons, markdown, starter files, solutions, scenario config.
2. Tutorial app shell: split-pane UI, progression, and controls.
3. Editor store/adapter: virtual file system, selected file, diagnostics, snapshots.
4. Compiler worker: bundle lesson files with `esbuild-wasm` on explicit runs.
5. Preview session manager: create and destroy isolated preview sessions.
6. Fake admin shell and SDK host bridge: minimal shell surfaces plus behaviorally correct message handling.
7. Reset controller: restore immutable starter snapshots and fully recreate preview state.

### Critical Pitfalls

1. **Fake admin semantics drift from the real SDK**: keep the real SDK on the learner side, drive the host from real message contracts, and add compatibility tests against canonical examples.
2. **Browser execution is not truly isolated**: run learner code only in disposable sandboxed iframes, validate message sender/source, and avoid `allow-same-origin`.
3. **The runtime expands into a generic IDE**: freeze the supported file/import model early and reject package-install or terminal scope in v1.
4. **Lesson authoring becomes too expensive**: define a typed lesson manifest and reusable shell presets before scaling lesson count.
5. **Reset and cleanup leak state across runs**: treat reset as full session teardown and recreation, not in-place cleanup.

## Implications for Roadmap

### Phase 1: Lesson Shell and Static Flow
**Rationale:** This proves the teaching model before runtime complexity.
**Delivers:** New package scaffold, lesson catalog, split-pane layout, linear progression, starter/solution snapshots, placeholder preview.
**Addresses:** Split-pane workspace, lesson navigation, starter code, reset/reveal affordances.
**Avoids:** Overbuilding the runtime before the lesson model is stable.

### Phase 2: Fake Admin Shell and Runtime Containment
**Rationale:** The fake host and isolation model are the hardest architectural decisions and must be proven early.
**Delivers:** Preview iframe, minimal fake admin shell, typed host bridge, hard-coded surfaces, strict sandboxing, session-per-run lifecycle.
**Addresses:** Visible extension surfaces, hidden-runtime explanation, runtime containment, pedagogical shell boundaries.
**Avoids:** Same-window mocks, weak isolation, and an over-realistic Shopware clone.

### Phase 3: Browser Execution and First Vertical Slice
**Rationale:** The first real user value is edit, run, and observe a real SDK effect.
**Delivers:** `esbuild-wasm` worker, one editable entry file, explicit `Run`, notification lesson, runtime diagnostics, inline SDK call log.
**Addresses:** In-browser execution, notification demo flow, clear failure feedback, deterministic run loop.
**Avoids:** Auto-run side effects and generic browser IDE scope.

### Phase 4: Location/Position Lessons and Callback Fidelity
**Rationale:** This is where the tutorial becomes genuinely Admin SDK-specific instead of a generic code playground.
**Delivers:** Hidden runtime + visible location mounting, component sections/menu or tab lessons, labeled positions, callback transport for action buttons, lightweight success checks.
**Addresses:** `locationId`/`positionId` visualization, menu/component rendering, callback realism, lesson completion checks.
**Avoids:** Conceptual drift and invisible runtime state.

### Phase 5: Reset Hardening, Compatibility Validation, and Test Matrix
**Rationale:** Once the core loop works, the project needs confidence against drift and lifecycle leaks.
**Delivers:** Full reset/session recreation, integration coverage in Playwright, contract checks against examples/docs, lesson regression fixtures.
**Addresses:** Reset stability, semantic compatibility, end-to-end user-flow validation.
**Avoids:** Silent drift from SDK behavior and regressions hidden by unit-only coverage.

### Phase Ordering Rationale

- Static lesson flow comes first because lesson structure, content loading, and split-pane UX are prerequisites for all runtime work.
- Fake host containment comes before full execution because the boundary choices determine whether the tutorial teaches the right mental model.
- Notifications are the best first vertical slice because they are highly visible and require the smallest supported handler set.
- Location, position, and callback flows come after the runtime is stable because they add the most domain-specific value and the most bridge complexity.
- Hardening and cross-validation should follow the first believable end-to-end slice so tests lock down real behavior rather than a moving target.

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 2:** iframe bridge hardening, callback transport reuse, and CSP details need precise implementation planning.
- **Phase 4:** location mounting, visible/hidden runtime coordination, and lesson assertions need targeted validation against examples.
- **Phase 5:** compatibility strategy between tutorial fixtures, examples, and docs should be defined before broad lesson expansion.

**Phases with standard patterns:**
- **Phase 1:** standard Vue/Vite package setup, lesson data loading, and split-pane UI patterns are well understood.
- **Phase 3:** CodeMirror integration, worker-based compile flow, and explicit run controls follow established browser-app patterns.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Strong repo fit and mostly official/primary-source validation. |
| Features | HIGH | Grounded in the project brief, docs, and clear tutorial-domain expectations. |
| Architecture | HIGH | Package boundaries and runtime model are coherent; compiler implementation details are the main medium-risk area. |
| Pitfalls | HIGH | Risks are concrete, repeated across sources, and tied to existing SDK/example behavior. |

**Overall confidence:** HIGH

### Gaps to Address

- Exact host-side reuse boundary for serializer/callback transport should be validated before implementation to avoid duplicating fragile SDK internals.
- The smallest canonical lesson set should be fixed during roadmap creation so fake-admin scope stays narrow.
- Cross-validation rules between tutorial behavior, docs, and example apps need to be made explicit before the tutorial covers more APIs.

## Sources

### Primary
- `.planning/PROJECT.md`
- `.planning/research/STACK.md`
- `.planning/research/FEATURES.md`
- `.planning/research/ARCHITECTURE.md`
- `.planning/research/PITFALLS.md`

### Key repository anchors cited by the research
- `packages/admin-sdk/src/message-types.ts`
- `packages/admin-sdk/src/channel.ts`
- `packages/admin-sdk/src/_internals/serializer/`
- `docs/admin-sdk/`
- `examples/admin-sdk-app/`
- `examples/admin-sdk-plugin/`

---
*Research completed: 2026-04-10*
*Ready for roadmap: yes*
