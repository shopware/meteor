# Coding Conventions

**Analysis Date:** 2026-04-10

## Naming Patterns

**Files:**
- Use package-local naming, not one repo-wide rule.
- In `packages/component-library/src/components/form/mt-text-field/mt-text-field.vue` and its siblings, component directories and files are kebab-case and usually carry the `mt-` prefix.
- In `packages/admin-sdk/src/data/composables/useDataset.ts`, `packages/admin-sdk/src/channel.ts`, and `packages/admin-sdk/src/data/data-table-filter.helper.ts`, runtime modules are mostly camelCase or kebab-case.
- In `packages/admin-sdk/src/data/Criteria.ts`, `packages/admin-sdk/src/_internals/data/Entity.ts`, `packages/tokens/src/common/domain/file-system/InMemoryFileSystem.ts`, and `packages/icon-kit/src/domain/css-file.ts`, class-heavy modules use PascalCase or lowercase-kebab names depending on package history.
- Test files stay next to the code they cover with `.spec.ts` or `.test.ts`, for example `packages/component-library/src/utils/debounce.spec.ts` and `packages/tokens/src/GenerateArtifacts.test.ts`.

**Functions:**
- Use lower camelCase for functions and variables, for example `useDataset` in `packages/admin-sdk/src/data/composables/useDataset.ts`, `kebabCase` in `packages/tokens/src/common/domain/utils/string.ts`, and `getSDKiFrame` in `examples/admin-sdk-plugin/tests/acceptance/fixtures/Helper.ts`.
- Vue composables use the `use*` prefix in `packages/admin-sdk/src/data/composables/`.
- Test-local factories also use lower camelCase, for example `createWrapper` in `packages/component-library/src/components/form/mt-select/mt-select.spec.ts`.

**Variables:**
- Use lower camelCase for locals and object fields.
- Use screaming snake case only for test constants or warning messages, for example `PAGE_TITLE` in `packages/admin-sdk/src/channel.spec.ts` and `STACKING_WARNING` in `packages/component-library/src/components/overlay/mt-modal/mt-modal.spec.ts`.
- Prefix intentionally ignored parameters with `_`; flat ESLint configs in `packages/component-library/eslint.config.mjs`, `packages/tokens/eslint.config.mjs`, `packages/create-meteor-extension/eslint.config.mjs`, and `examples/admin-sdk-plugin/tests/acceptance/eslint.config.mjs` all exempt `^_`.

**Types:**
- Use PascalCase for classes, type aliases, and interfaces, for example `CSSFile` in `packages/icon-kit/src/domain/css-file.ts` and `FixtureTypes` in `examples/admin-sdk-plugin/tests/acceptance/fixtures/AcceptanceTest.ts`.
- Use descriptive `T*` generics for reusable typed APIs, for example `useDataset<TData>` in `packages/admin-sdk/src/data/composables/useDataset.ts`.
- Prefer `import type` for type-only imports where ESLint or ESM style encourages it, as seen in `packages/admin-sdk/src/data/composables/useDataset.ts` and `packages/tokens/src/GenerateArtifacts.ts`.

## Code Style

**Formatting:**
- There is no single root formatter config. Follow the package you are editing.
- Shared Prettier defaults live in `packages/prettier-config/index.js`: `singleQuote: false` and `trailingComma: "es5"`.
- `packages/stylelint-plugin-meteor/.prettierrc.js` inherits that shared config directly.
- `packages/tokens/.prettierrc.json` overrides to single quotes.
- `packages/create-meteor-extension/package.json` embeds Prettier with `semi: false` and `singleQuote: true`; generated template code in `packages/create-meteor-extension/src/templates/blank_project/.prettierrc.json` switches back to `semi: true`, `singleQuote: true`, and `tabWidth: 4`.
- `packages/component-library/.editorconfig` is the clearest spacing baseline in the repo: 2 spaces, LF, trimmed trailing whitespace, final newline, max line length 100.

**Linting:**
- `packages/admin-sdk/.eslintrc.js` is the strictest package-level rule set. It enforces explicit function return types, semicolons, single quotes, 2-space indentation, `camelcase`, `consistent-return`, `eqeqeq`, `curly`, `capitalized-comments`, and file naming rules via `eslint-plugin-check-file`.
- `packages/component-library/eslint.config.mjs`, `packages/tokens/eslint.config.mjs`, `packages/icon-kit/eslint.config.mjs`, and `packages/create-meteor-extension/eslint.config.mjs` use ESLint flat config with `typescript-eslint`. These packages currently relax some migration-heavy rules such as `@typescript-eslint/no-explicit-any`.
- `packages/component-library/stylelint.config.mjs` adds Meteor token usage warnings for Vue SFC styling via `@shopware-ag/stylelint-plugin-meteor`.

## Import Organization

**Order:**
1. Framework and third-party imports first, for example `vue`, `@testing-library/vue`, `@playwright/test`, `gluegun`, `svgo`, or `msw`.
2. Internal imports second, usually relative imports in `packages/admin-sdk/src/**`, `packages/tokens/src/**`, `packages/icon-kit/src/**`, and `packages/create-meteor-extension/src/**`.
3. Type-only imports stay separate when used, for example `import type { Ref, UnwrapRef } from 'vue';` in `packages/admin-sdk/src/data/composables/useDataset.ts`.

**Path Aliases:**
- `packages/component-library/tsconfig.app.json` defines `@/* -> ./src/*`.
- `packages/component-library/vite.config.ts` mirrors that alias, so runtime code and tests both import `@/...`.
- Other packages rely on relative imports. ESM-oriented packages such as `packages/tokens`, `packages/icon-kit`, and `packages/stylelint-plugin-meteor` include explicit `.js` file extensions in source imports.

## Error Handling

**Patterns:**
- Throw explicit `Error` instances for hard domain failures in `packages/tokens/src/GenerateArtifacts.ts`, `packages/tokens/src/dictionary/domain/Dictionary.ts`, `packages/icon-kit/src/index.ts`, and `packages/create-meteor-extension/src/commands/create-meteor-extension.ts`.
- In `packages/admin-sdk/src/data/composables/useDataset.ts`, expected bootstrap failures are swallowed intentionally with an empty `.catch()` so readiness can still resolve.
- In `packages/component-library/src/components/form/mt-url-field/mt-url-field.vue` and `packages/component-library/src/components/form/mt-radio-group/mt-radio-group-item.vue`, components throw only for broken invariants; softer misuse usually emits `console.warn`.
- Do not normalize errors into a shared wrapper; current code prefers direct throws with package-specific messages.

## Logging

**Framework:** package-specific

**Patterns:**
- `packages/icon-kit/src/index.ts` uses `WinstonLogger` plus `ora` for long-running CLI feedback.
- `packages/tokens/src/scripts/index.ts`, `packages/admin-sdk/src/channel.ts`, and parts of `packages/component-library/src/**` use `console.error` or `console.warn` directly.
- Avoid new generic logging abstractions unless the package already has one. `packages/icon-kit` is the main exception.

## Comments

**When to Comment:**
- Keep comments for intent, invariants, or framework quirks rather than line-by-line narration.
- `packages/component-library/src/components/form/mt-text-field/mt-text-field.vue` uses JSDoc-style prop descriptions because those props are part of the public component API.
- `packages/admin-sdk/.eslintrc.js` enforces capitalized comments, so new comments in that package should start with a capital letter.
- Tests frequently use `ARRANGE` / `ACT` / `ASSERT` or `GIVEN` / `WHEN` / `THEN` section comments, for example `packages/component-library/src/components/form/mt-text-field/mt-text-field.spec.ts` and `packages/icon-kit/src/domain/css-file.test.ts`.

**JSDoc/TSDoc:**
- Use JSDoc heavily in public Vue props and template-facing APIs in `packages/component-library/src/components/**`.
- Utility and domain modules in `packages/tokens`, `packages/icon-kit`, and `packages/admin-sdk` often skip JSDoc when names are already explicit.

## Function Design

**Size:** package dependent
- UI components in `packages/component-library/src/components/**` can be large because template, props, watchers, and emits live together in one SFC.
- Domain and infrastructure functions in `packages/tokens/src/**` and `packages/icon-kit/src/**` are usually smaller and single-purpose.

**Parameters:**
- Prefer typed options objects for expandable APIs, for example the `options` object in `packages/admin-sdk/src/data/composables/useDataset.ts`.
- Constructor injection is the default for domain services, for example `GenerateArtifacts` in `packages/tokens/src/GenerateArtifacts.ts`.

**Return Values:**
- Vue composables return explicit state objects, for example `{ data, isReady, ready }` from `packages/admin-sdk/src/data/composables/useDataset.ts`.
- Utility modules usually return plain values and keep side effects at the boundary.

## Module Design

**Exports:** package dependent
- Vue SFCs default-export `defineComponent(...)`, for example `packages/component-library/src/components/form/mt-text-field/mt-text-field.vue`.
- Utility and domain modules usually prefer named exports, for example `required`, `regex`, and `email` in `packages/component-library/src/services/validation.service.ts`, plus `GenerateArtifacts` in `packages/tokens/src/GenerateArtifacts.ts`.
- Some packages still expose a default aggregate object or array when that is the public API shape, for example `packages/stylelint-plugin-meteor/src/index.ts` and the default object in `packages/component-library/src/services/validation.service.ts`.

**Barrel Files:** moderate use
- Public surfaces are aggregated through index modules such as `packages/admin-sdk/src/index.ts`, `packages/admin-sdk/src/data/composables/index.ts`, and `packages/stylelint-plugin-meteor/src/index.ts`.
- Add new public exports to the relevant barrel instead of deep-importing internals unless the package already documents an internal path.

---

*Convention analysis: 2026-04-10*
