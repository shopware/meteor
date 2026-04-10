# Meteor

High-level repo guide for orientation. Stay at this level first; read package-local docs only when working in that area.

## Repo layout

- `packages/` — reusable Meteor packages
- `examples/` — reference consumers for the packages
- `docs/admin-sdk/` — hand-written Admin SDK docs
- `scripts/` — repo maintenance

## Main packages

- `packages/admin-sdk` — Shopware Administration SDK
- `packages/component-library` — Vue 3 component library
- `packages/tokens` — design tokens pipeline and outputs
- `packages/icon-kit` — icon assets and sync/build tooling
- `packages/stylelint-plugin-meteor` — stylelint rules for Meteor token usage
- `packages/create-meteor-extension` — scaffolding CLI and templates
- `packages/prettier-config` — shared Prettier config

## Notes

- This is a `pnpm` workspace with Turborepo (`pnpm-workspace.yaml`, `turbo.json`).
- Prefer source files over generated output.
- Usually ignore: `dist/`, `build/`, `es/`, `umd/`, `coverage/`, `.nuxt/`, `.output/`, `storybook-static/`, `node_modules/`, `.turbo/`.
- When SDK behavior changes, update `docs/admin-sdk/` too.

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Meteor Admin SDK Interactive Tutorial**

This project adds an interactive tutorial experience for the Meteor Admin SDK inside the Meteor monorepo. The tutorial is meant for developers who want to learn the SDK by editing code in the browser and seeing the result immediately in a minimal simulated Administration instead of needing a real Shopware 6 Administration instance.

The first goal is a prototype that proves the interaction model, the browser-based execution model, and the fake admin shell for core SDK concepts such as notifications, UI extension points, and location and position IDs.

**Core Value:** Let developers understand and try the Meteor Admin SDK in the browser without needing a real Shopware Administration environment.

### Constraints

- **Tech stack**: Must fit the existing `pnpm` workspace and Turborepo structure — this should be implemented as a new package inside `packages/`
- **Execution model**: User code editing and execution must happen in the browser — that is core to the tutorial value
- **Dependency**: Do not depend on TutorialKit or StackBlitz — the runtime should be owned in-repo
- **Scope**: Start with a prototype, not a full educational platform — prove the interaction and fake-admin architecture first
- **Compatibility**: The tutorial should teach the actual Admin SDK semantics from `packages/admin-sdk` — otherwise it becomes misleading
- **Documentation fit**: The tutorial should complement `docs/admin-sdk` and the existing examples rather than replace them wholesale
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 4.9-5.9 - Main implementation language across `packages/admin-sdk/src`, `packages/component-library/src`, `packages/tokens/src`, `packages/icon-kit/src`, `packages/create-meteor-extension/src`, and example apps in `examples/**`.
- Vue Single File Components on Vue 3.5 - UI implementation in `packages/component-library/src/**/*.vue`, `examples/nuxt-app/app.vue`, and `examples/admin-sdk-app/src/frontend/**/*.vue`.
- JavaScript (ESM and CommonJS) - Repo tooling and config in `package.json`, `scripts/validate-changesets.js`, `packages/admin-sdk/jest.config.js`, and `examples/admin-sdk-plugin/src/Resources/app/administration/build/webpack.config.js`.
- PHP - Shopware plugin example code in `examples/admin-sdk-plugin/src/TestPlugin.php` with package metadata in `examples/admin-sdk-plugin/composer.json`.
- CSS/SCSS and generated asset formats - Styling and design outputs in `packages/component-library/src/components/assets/scss/**`, `packages/tokens/deliverables/**`, `packages/tokens/dictionaries/**`, and `packages/icon-kit/icons/**`.
## Runtime
- Node.js 22.13.0 for local development via Volta in `package.json`.
- Node.js 24 in CI workflows under `.github/workflows/release.yml`, `.github/workflows/tests.yml`, `.github/workflows/visual-tests.yml`, and related workflow files.
- `pnpm` 10.12.3 in `package.json`.
- Lockfile: present in `pnpm-lock.yaml`.
- Workspace layout: `pnpm-workspace.yaml`.
## Frameworks
- Turborepo 2.5.4 - Monorepo task graph and caching in `turbo.json`.
- Vite 2/4/5/6 - Bundling and local dev in `packages/admin-sdk/vite.config.ts`, `packages/component-library/vite.config.ts`, `packages/create-meteor-extension/src/templates/blank_project/vite.config.ts`, and `examples/admin-sdk-app/src/server.ts`.
- Vue 3.5 and Nuxt 3.10 - Consumer UI stack in `packages/component-library/package.json`, `examples/nuxt-app/package.json`, and `examples/nuxt-app/nuxt.config.ts`.
- Shopware-specific packages - Core repo outputs are `@shopware-ag/meteor-admin-sdk`, `@shopware-ag/meteor-component-library`, `@shopware-ag/meteor-tokens`, `@shopware-ag/meteor-icon-kit`, and `@shopware-ag/create-meteor-extension` defined in the package manifests under `packages/**/package.json`.
- Webpack - Only detected in the Shopware plugin example admin build config at `examples/admin-sdk-plugin/src/Resources/app/administration/build/webpack.config.js`.
- Vitest 3.x - Used by `packages/component-library/vitest.config.ts`, `packages/tokens/vitest.config.ts`, and `packages/icon-kit/vitest.config.ts`.
- Jest 27 and 29 with `ts-jest` - Used by `packages/admin-sdk/jest.config.js` and the inline Jest config in `packages/create-meteor-extension/package.json`.
- Playwright 1.45-1.47 - Used by `packages/admin-sdk/playwright.config.ts`, `packages/component-library/playwright.config.ts`, `examples/nuxt-app/playwright.config.ts`, `examples/admin-sdk-plugin/tests/acceptance/playwright.config.ts`, and `packages/create-meteor-extension/tests/integration/playwright.config.ts`.
- Storybook 8.6 with Storybook test runner - Used by `packages/component-library/package.json` and exercised by `.github/workflows/visual-tests.yml`.
- TypeScript compiler - Build and typecheck entry point for `packages/admin-sdk/package.json`, `packages/component-library/package.json`, and `packages/create-meteor-extension/package.json`.
- Changesets - Versioning and publishing in root `package.json`, `scripts/validate-changesets.js`, and `.github/workflows/release.yml`.
- Gluegun - CLI scaffolding framework in `packages/create-meteor-extension/package.json`.
- Madge - Circular dependency checks in `packages/admin-sdk/package.json` and `.github/workflows/tests.yml`.
- Size Limit - Bundle budget checks for the component library in `packages/component-library/package.json` and `.github/workflows/size-limit.yml`.
## Key Dependencies
- `@shopware-ag/meteor-admin-sdk` 6.7.1 - The Shopware Administration bridge package defined in `packages/admin-sdk/package.json` and consumed from `packages/component-library/package.json`, `examples/admin-sdk-app/package.json`, and `examples/admin-sdk-plugin/src/Resources/app/administration/package.json`.
- `@shopware-ag/meteor-component-library` 4.28.1 - Shared Vue component system defined in `packages/component-library/package.json` and consumed by the example apps in `examples/admin-sdk-app/package.json` and `examples/nuxt-app/package.json`.
- `@shopware-ag/meteor-tokens` 1.4.0 - Design token distribution package defined in `packages/tokens/package.json`.
- `@shopware-ag/meteor-icon-kit` 5.6.0 - Icon asset package and sync tooling defined in `packages/icon-kit/package.json`.
- `@shopware-ag/create-meteor-extension` 0.0.1 - Scaffolding CLI defined in `packages/create-meteor-extension/package.json`.
- `localforage` 1.10.0 - Browser persistence for shared SDK state in `packages/admin-sdk/src/data/composables/useSharedState.ts`.
- `jwt-decode` 4.0.0 - Payment/config token decoding in `packages/admin-sdk/src/_private/payment/index.ts`.
- `zod` 3.x and `@t3-oss/env-core` 0.12.0 - Runtime env and API response validation in `packages/tokens/src/env.ts`, `packages/tokens/src/figma/infrastructure/FigmaApi.ts`, and `packages/icon-kit/src/env.ts`.
- `axios` 0.26.1 plus native `fetch` - External HTTP access for icon and token sync in `packages/icon-kit/src/figma/index.ts` and `packages/tokens/src/common/infrastructure/http-client/HttpClientUsingFetch.ts`.
- `shopware-app-server-sdk` 0.0.15 - Example Shopware app registration server in `examples/admin-sdk-app/src/server.ts`.
- `storybook`, `stylelint`, `eslint`, `prettier`, and `sass` - Authoring and quality toolchain centered in `packages/component-library/package.json`, `packages/stylelint-plugin-meteor/package.json`, and `packages/prettier-config/package.json`.
## Configuration
- Local runtime and package-manager versions are pinned in `package.json`; workspace membership is declared in `pnpm-workspace.yaml`.
- Environment variables are validated or consumed in `packages/tokens/src/env.ts`, `packages/icon-kit/src/env.ts`, `packages/create-meteor-extension/tests/integration/playwright.config.ts`, `examples/admin-sdk-plugin/tests/acceptance/playwright.config.ts`, and `examples/admin-sdk-app/src/server.ts`.
- Key configs required by active code paths are `FIGMA_TOKEN`, `FIGMA_FILE`, `ADMIN_TOKENS_FILE_KEY`, `PRIMITIVE_TOKENS_FILE_KEY`, `APP_URL`, `ADMIN_URL`, `SHOPWARE_ADMIN_USERNAME`, `SHOPWARE_ADMIN_PASSWORD`, `PORT`, and `URL`.
- CI adds `TURBO_TOKEN`, `TURBO_TEAM`, `CI`, and `API_KEY` through `.github/workflows/*.yml` and `turbo.json`.
- Root task orchestration lives in `turbo.json`.
- Package-level build and test configs live in `packages/admin-sdk/vite.config.ts`, `packages/admin-sdk/jest.config.js`, `packages/admin-sdk/playwright.config.ts`, `packages/component-library/vite.config.ts`, `packages/component-library/vitest.config.ts`, `packages/component-library/playwright.config.ts`, `examples/nuxt-app/nuxt.config.ts`, `examples/nuxt-app/playwright.config.ts`, `examples/admin-sdk-plugin/src/Resources/app/administration/build/webpack.config.js`, and `packages/create-meteor-extension/tests/integration/playwright.config.ts`.
- Shared formatting is packaged in `packages/prettier-config/package.json`.
## Platform Requirements
- Node.js 22.13.0 with `pnpm` 10.12.3 is the local baseline from `package.json`.
- Browser binaries are required for Playwright-based suites in `packages/admin-sdk/package.json`, `packages/component-library/package.json`, `examples/nuxt-app/package.json`, and `packages/create-meteor-extension/tests/integration/package.json`.
- A working Shopware 6 instance is required for `examples/admin-sdk-plugin`, `examples/admin-sdk-app`, and `packages/create-meteor-extension/tests/integration`.
- A sibling checkout of `developer-portal` is required when previewing or linking Admin SDK docs through the scripts in `packages/admin-sdk/package.json` and the workflow documented in `docs/admin-sdk/README.md`.
- The deployable outputs are versioned npm packages from `packages/*`, a CDN UMD bundle from `packages/admin-sdk/cdn`, generated token artifacts in `packages/tokens/deliverables/**`, generated icon assets in `packages/icon-kit/icons/**`, and docs linked into the external developer portal as described in `docs/admin-sdk/README.md`.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Use package-local naming, not one repo-wide rule.
- In `packages/component-library/src/components/form/mt-text-field/mt-text-field.vue` and its siblings, component directories and files are kebab-case and usually carry the `mt-` prefix.
- In `packages/admin-sdk/src/data/composables/useDataset.ts`, `packages/admin-sdk/src/channel.ts`, and `packages/admin-sdk/src/data/data-table-filter.helper.ts`, runtime modules are mostly camelCase or kebab-case.
- In `packages/admin-sdk/src/data/Criteria.ts`, `packages/admin-sdk/src/_internals/data/Entity.ts`, `packages/tokens/src/common/domain/file-system/InMemoryFileSystem.ts`, and `packages/icon-kit/src/domain/css-file.ts`, class-heavy modules use PascalCase or lowercase-kebab names depending on package history.
- Test files stay next to the code they cover with `.spec.ts` or `.test.ts`, for example `packages/component-library/src/utils/debounce.spec.ts` and `packages/tokens/src/GenerateArtifacts.test.ts`.
- Use lower camelCase for functions and variables, for example `useDataset` in `packages/admin-sdk/src/data/composables/useDataset.ts`, `kebabCase` in `packages/tokens/src/common/domain/utils/string.ts`, and `getSDKiFrame` in `examples/admin-sdk-plugin/tests/acceptance/fixtures/Helper.ts`.
- Vue composables use the `use*` prefix in `packages/admin-sdk/src/data/composables/`.
- Test-local factories also use lower camelCase, for example `createWrapper` in `packages/component-library/src/components/form/mt-select/mt-select.spec.ts`.
- Use lower camelCase for locals and object fields.
- Use screaming snake case only for test constants or warning messages, for example `PAGE_TITLE` in `packages/admin-sdk/src/channel.spec.ts` and `STACKING_WARNING` in `packages/component-library/src/components/overlay/mt-modal/mt-modal.spec.ts`.
- Prefix intentionally ignored parameters with `_`; flat ESLint configs in `packages/component-library/eslint.config.mjs`, `packages/tokens/eslint.config.mjs`, `packages/create-meteor-extension/eslint.config.mjs`, and `examples/admin-sdk-plugin/tests/acceptance/eslint.config.mjs` all exempt `^_`.
- Use PascalCase for classes, type aliases, and interfaces, for example `CSSFile` in `packages/icon-kit/src/domain/css-file.ts` and `FixtureTypes` in `examples/admin-sdk-plugin/tests/acceptance/fixtures/AcceptanceTest.ts`.
- Use descriptive `T*` generics for reusable typed APIs, for example `useDataset<TData>` in `packages/admin-sdk/src/data/composables/useDataset.ts`.
- Prefer `import type` for type-only imports where ESLint or ESM style encourages it, as seen in `packages/admin-sdk/src/data/composables/useDataset.ts` and `packages/tokens/src/GenerateArtifacts.ts`.
## Code Style
- There is no single root formatter config. Follow the package you are editing.
- Shared Prettier defaults live in `packages/prettier-config/index.js`: `singleQuote: false` and `trailingComma: "es5"`.
- `packages/stylelint-plugin-meteor/.prettierrc.js` inherits that shared config directly.
- `packages/tokens/.prettierrc.json` overrides to single quotes.
- `packages/create-meteor-extension/package.json` embeds Prettier with `semi: false` and `singleQuote: true`; generated template code in `packages/create-meteor-extension/src/templates/blank_project/.prettierrc.json` switches back to `semi: true`, `singleQuote: true`, and `tabWidth: 4`.
- `packages/component-library/.editorconfig` is the clearest spacing baseline in the repo: 2 spaces, LF, trimmed trailing whitespace, final newline, max line length 100.
- `packages/admin-sdk/.eslintrc.js` is the strictest package-level rule set. It enforces explicit function return types, semicolons, single quotes, 2-space indentation, `camelcase`, `consistent-return`, `eqeqeq`, `curly`, `capitalized-comments`, and file naming rules via `eslint-plugin-check-file`.
- `packages/component-library/eslint.config.mjs`, `packages/tokens/eslint.config.mjs`, `packages/icon-kit/eslint.config.mjs`, and `packages/create-meteor-extension/eslint.config.mjs` use ESLint flat config with `typescript-eslint`. These packages currently relax some migration-heavy rules such as `@typescript-eslint/no-explicit-any`.
- `packages/component-library/stylelint.config.mjs` adds Meteor token usage warnings for Vue SFC styling via `@shopware-ag/stylelint-plugin-meteor`.
## Import Organization
- `packages/component-library/tsconfig.app.json` defines `@/* -> ./src/*`.
- `packages/component-library/vite.config.ts` mirrors that alias, so runtime code and tests both import `@/...`.
- Other packages rely on relative imports. ESM-oriented packages such as `packages/tokens`, `packages/icon-kit`, and `packages/stylelint-plugin-meteor` include explicit `.js` file extensions in source imports.
## Error Handling
- Throw explicit `Error` instances for hard domain failures in `packages/tokens/src/GenerateArtifacts.ts`, `packages/tokens/src/dictionary/domain/Dictionary.ts`, `packages/icon-kit/src/index.ts`, and `packages/create-meteor-extension/src/commands/create-meteor-extension.ts`.
- In `packages/admin-sdk/src/data/composables/useDataset.ts`, expected bootstrap failures are swallowed intentionally with an empty `.catch()` so readiness can still resolve.
- In `packages/component-library/src/components/form/mt-url-field/mt-url-field.vue` and `packages/component-library/src/components/form/mt-radio-group/mt-radio-group-item.vue`, components throw only for broken invariants; softer misuse usually emits `console.warn`.
- Do not normalize errors into a shared wrapper; current code prefers direct throws with package-specific messages.
## Logging
- `packages/icon-kit/src/index.ts` uses `WinstonLogger` plus `ora` for long-running CLI feedback.
- `packages/tokens/src/scripts/index.ts`, `packages/admin-sdk/src/channel.ts`, and parts of `packages/component-library/src/**` use `console.error` or `console.warn` directly.
- Avoid new generic logging abstractions unless the package already has one. `packages/icon-kit` is the main exception.
## Comments
- Keep comments for intent, invariants, or framework quirks rather than line-by-line narration.
- `packages/component-library/src/components/form/mt-text-field/mt-text-field.vue` uses JSDoc-style prop descriptions because those props are part of the public component API.
- `packages/admin-sdk/.eslintrc.js` enforces capitalized comments, so new comments in that package should start with a capital letter.
- Tests frequently use `ARRANGE` / `ACT` / `ASSERT` or `GIVEN` / `WHEN` / `THEN` section comments, for example `packages/component-library/src/components/form/mt-text-field/mt-text-field.spec.ts` and `packages/icon-kit/src/domain/css-file.test.ts`.
- Use JSDoc heavily in public Vue props and template-facing APIs in `packages/component-library/src/components/**`.
- Utility and domain modules in `packages/tokens`, `packages/icon-kit`, and `packages/admin-sdk` often skip JSDoc when names are already explicit.
## Function Design
- UI components in `packages/component-library/src/components/**` can be large because template, props, watchers, and emits live together in one SFC.
- Domain and infrastructure functions in `packages/tokens/src/**` and `packages/icon-kit/src/**` are usually smaller and single-purpose.
- Prefer typed options objects for expandable APIs, for example the `options` object in `packages/admin-sdk/src/data/composables/useDataset.ts`.
- Constructor injection is the default for domain services, for example `GenerateArtifacts` in `packages/tokens/src/GenerateArtifacts.ts`.
- Vue composables return explicit state objects, for example `{ data, isReady, ready }` from `packages/admin-sdk/src/data/composables/useDataset.ts`.
- Utility modules usually return plain values and keep side effects at the boundary.
## Module Design
- Vue SFCs default-export `defineComponent(...)`, for example `packages/component-library/src/components/form/mt-text-field/mt-text-field.vue`.
- Utility and domain modules usually prefer named exports, for example `required`, `regex`, and `email` in `packages/component-library/src/services/validation.service.ts`, plus `GenerateArtifacts` in `packages/tokens/src/GenerateArtifacts.ts`.
- Some packages still expose a default aggregate object or array when that is the public API shape, for example `packages/stylelint-plugin-meteor/src/index.ts` and the default object in `packages/component-library/src/services/validation.service.ts`.
- Public surfaces are aggregated through index modules such as `packages/admin-sdk/src/index.ts`, `packages/admin-sdk/src/data/composables/index.ts`, and `packages/stylelint-plugin-meteor/src/index.ts`.
- Add new public exports to the relevant barrel instead of deep-importing internals unless the package already documents an internal path.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Each publishable unit owns its own source, config, and release surface under `packages/<name>/`.
- Consumer apps live under `examples/` and depend on workspace packages through `workspace:*` links in files like `examples/admin-sdk-app/package.json` and `examples/admin-sdk-plugin/src/Resources/app/administration/package.json`.
- `packages/admin-sdk` is the most layered package: thin public API wrappers in `packages/admin-sdk/src/*` sit on top of a shared message transport in `packages/admin-sdk/src/channel.ts` and type contract definitions in `packages/admin-sdk/src/message-types.ts`.
## Layers
- Purpose: Define workspace membership, task graph, and root-level release helpers.
- Location: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `scripts/validate-changesets.js`
- Contains: workspace package globs, Turbo task definitions, root metadata, changeset validation
- Depends on: `pnpm`, Turbo, package-level scripts
- Used by: every package and example in the repository
- Purpose: Ship reusable SDK, UI, design-token, icon, lint, config, and scaffolding artifacts.
- Location: `packages/admin-sdk`, `packages/component-library`, `packages/tokens`, `packages/icon-kit`, `packages/stylelint-plugin-meteor`, `packages/prettier-config`, `packages/create-meteor-extension`
- Contains: source code, package-local configs, tests, and build output directories
- Depends on: workspace orchestration plus package-specific toolchains
- Used by: `examples/*`, downstream consumers, and in some cases other workspace packages
- Purpose: Provide the extension-side bridge to Shopware Administration.
- Location: `packages/admin-sdk/src/channel.ts`, `packages/admin-sdk/src/message-types.ts`, `packages/admin-sdk/src/_internals/*`
- Contains: request/response transport, callback registration, serializer chain, privilege validation, dataset subscription registries
- Depends on: browser `postMessage`, typed message contracts, serializer helpers, privilege checks
- Used by: public SDK modules such as `packages/admin-sdk/src/window/index.ts`, `packages/admin-sdk/src/data/index.ts`, `packages/admin-sdk/src/ui/*`, and example consumers in `examples/admin-sdk-app` and `examples/admin-sdk-plugin`
- Purpose: Expose stable, domain-oriented APIs without repeating transport logic.
- Location: `packages/admin-sdk/src/index.ts`, `packages/admin-sdk/src/window/index.ts`, `packages/admin-sdk/src/context/index.ts`, `packages/admin-sdk/src/data/index.ts`, `packages/admin-sdk/src/ui/*`
- Contains: `createSender(...)` and `createHandler(...)` wrappers, domain types, grouped exports
- Depends on: `packages/admin-sdk/src/channel.ts`
- Used by: extension code in `examples/admin-sdk-app/src/frontend/*` and `examples/admin-sdk-plugin/src/Resources/app/administration/src/*`
- Purpose: Publish Vue components, styles, directives, and composables as a reusable UI system.
- Location: `packages/component-library/src/index.ts`, `packages/component-library/src/components/*`, `packages/component-library/vite.config.ts`
- Contains: SFCs, colocated stories/specs/docs, global SCSS entrypoints, build helpers, Storybook config
- Depends on: Vue 3, Vite, Storybook, tokens and icon-kit packages, and the Admin SDK for entity-oriented components
- Used by: `examples/nuxt-app`, `examples/admin-sdk-app`, `examples/admin-sdk-plugin`, and external consumers
- Purpose: Convert external design sources into versioned artifacts or tools.
- Location: `packages/tokens/src/*`, `packages/icon-kit/src/*`, `packages/create-meteor-extension/src/*`
- Contains: Figma adapters, file-system abstractions, artifact generators, CLI scaffolding templates
- Depends on: environment variables, external APIs, and package-local filesystem adapters
- Used by: package build/dev scripts, template consumers, and packages that import generated outputs such as `packages/component-library` and `packages/stylelint-plugin-meteor`
- Purpose: Demonstrate runtime integration and document the SDK surface.
- Location: `examples/admin-sdk-app`, `examples/admin-sdk-plugin`, `examples/nuxt-app`, `docs/admin-sdk`
- Contains: example frontends, acceptance tests, Nuxt smoke tests, Markdown documentation aligned to SDK modules
- Depends on: workspace packages, package-specific tooling, and in the app example an Express server in `examples/admin-sdk-app/src/server.ts`
- Used by: maintainers validating package behavior and future contributors looking for implementation patterns
## Data Flow
- There is no monorepo-wide runtime state layer.
- `packages/admin-sdk` manages runtime transport state inside registries in `packages/admin-sdk/src/channel.ts`.
- `packages/component-library` keeps state local to Vue components and composables under `packages/component-library/src/components/*` and `packages/component-library/src/composables/*`.
- Code-generation packages keep state inside explicit service objects such as `GenerateArtifacts` in `packages/tokens/src/GenerateArtifacts.ts`.
## Key Abstractions
- Purpose: Define every request/response payload that may cross the SDK bridge.
- Examples: `packages/admin-sdk/src/message-types.ts`, `packages/admin-sdk/src/window/index.ts`, `packages/admin-sdk/src/data/index.ts`
- Pattern: add a message type first, then expose a thin sender/handler wrapper
- Purpose: Preserve complex SDK types across `postMessage`.
- Examples: `packages/admin-sdk/src/_internals/serializer/index.ts`, `packages/admin-sdk/src/_internals/serializer/criteria-serializer.ts`, `packages/admin-sdk/src/_internals/data/Entity.ts`, `packages/admin-sdk/src/_internals/data/EntityCollection.ts`
- Pattern: serializer/deserializer chain keyed by object type
- Purpose: Keep implementation, tests, and Storybook docs together per component.
- Examples: `packages/component-library/src/components/form/mt-button/mt-button.vue`, `packages/component-library/src/components/form/mt-button/mt-button.spec.ts`, `packages/component-library/src/components/form/mt-button/mt-button.stories.ts`
- Pattern: one folder per component with `.vue`, `.spec.ts`, `.stories.ts`, and optional `.mdx` or `interactive.stories.ts`
- Purpose: Isolate generation logic from environment-specific IO.
- Examples: `packages/tokens/src/GenerateArtifacts.ts`, `packages/tokens/src/common/domain/file-system/FileSystem.ts`, `packages/tokens/src/common/infrastructure/file-system/HardDiskFileSystem.ts`
- Pattern: domain/application object consumes interface-based adapters
- Purpose: Assemble multiple stylelint rules into one package entry.
- Examples: `packages/stylelint-plugin-meteor/src/index.ts`, `packages/stylelint-plugin-meteor/src/rules/no-primitive-token/index.ts`
- Pattern: package root exports an array of rule plugins, each rule owns its own folder and README
## Entry Points
- Location: `package.json`
- Triggers: root `pnpm` or Turbo commands
- Responsibilities: declare root metadata and shared scripts
- Location: `packages/admin-sdk/src/index.ts`
- Triggers: imports of `@shopware-ag/meteor-admin-sdk`
- Responsibilities: group domain APIs into `window`, `context`, `ui`, `data`, `iap`, `telemetry`, and private namespaces
- Location: `packages/admin-sdk/src/channel.ts`
- Triggers: every sender/handler built by public SDK modules
- Responsibilities: route messages, manage callbacks, register sources/subscribers, serialize values, enforce privilege validation
- Location: `packages/component-library/src/index.ts`
- Triggers: imports of `@shopware-ag/meteor-component-library`
- Responsibilities: export components, directives, styles, compatibility aliases, and public types
- Location: `packages/tokens/src/scripts/index.ts`
- Triggers: `pnpm --dir packages/tokens start`
- Responsibilities: fetch Figma token data and write generated deliverables
- Location: `packages/icon-kit/src/index.ts`
- Triggers: `pnpm --dir packages/icon-kit start`
- Responsibilities: sync icons from Figma into static package assets
- Location: `packages/create-meteor-extension/bin/create-meteor-extension`, `packages/create-meteor-extension/src/cli.ts`
- Triggers: the `create-meteor-extension` executable
- Responsibilities: bootstrap the Gluegun CLI and run the template-generation command
- Location: `examples/admin-sdk-app/src/server.ts`
- Triggers: `npm run dev` in `examples/admin-sdk-app`
- Responsibilities: host a Shopware app example, perform auth callbacks, and mount a Vite frontend in middleware mode
- Location: `examples/admin-sdk-plugin/src/Resources/app/administration/src/main.ts`
- Triggers: Shopware Administration loading the plugin iframe/frontend
- Responsibilities: branch between hidden-frame command registration and view rendering
## Error Handling
- `packages/admin-sdk/src/channel.ts` rejects timed-out requests, deserializes remote errors, and short-circuits invalid privilege access.
- `packages/create-meteor-extension/src/commands/create-meteor-extension.ts` validates inputs up front and rolls back partially generated output if templating fails.
- `packages/tokens/src/scripts/index.ts` and `packages/icon-kit/src/index.ts` let generation/sync failures surface from the external API or filesystem layer after logging progress.
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
