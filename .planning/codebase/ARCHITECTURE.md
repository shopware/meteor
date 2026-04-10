# Architecture

**Analysis Date:** 2026-04-10

## Pattern Overview

**Overall:** `pnpm`/Turborepo monorepo with package-centric modules, reference consumers, and package-local build/test pipelines.

**Key Characteristics:**
- Each publishable unit owns its own source, config, and release surface under `packages/<name>/`.
- Consumer apps live under `examples/` and depend on workspace packages through `workspace:*` links in files like `examples/admin-sdk-app/package.json` and `examples/admin-sdk-plugin/src/Resources/app/administration/package.json`.
- `packages/admin-sdk` is the most layered package: thin public API wrappers in `packages/admin-sdk/src/*` sit on top of a shared message transport in `packages/admin-sdk/src/channel.ts` and type contract definitions in `packages/admin-sdk/src/message-types.ts`.

## Layers

**Workspace Orchestration:**
- Purpose: Define workspace membership, task graph, and root-level release helpers.
- Location: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `scripts/validate-changesets.js`
- Contains: workspace package globs, Turbo task definitions, root metadata, changeset validation
- Depends on: `pnpm`, Turbo, package-level scripts
- Used by: every package and example in the repository

**Publishable Library Packages:**
- Purpose: Ship reusable SDK, UI, design-token, icon, lint, config, and scaffolding artifacts.
- Location: `packages/admin-sdk`, `packages/component-library`, `packages/tokens`, `packages/icon-kit`, `packages/stylelint-plugin-meteor`, `packages/prettier-config`, `packages/create-meteor-extension`
- Contains: source code, package-local configs, tests, and build output directories
- Depends on: workspace orchestration plus package-specific toolchains
- Used by: `examples/*`, downstream consumers, and in some cases other workspace packages

**Admin SDK Transport Core:**
- Purpose: Provide the extension-side bridge to Shopware Administration.
- Location: `packages/admin-sdk/src/channel.ts`, `packages/admin-sdk/src/message-types.ts`, `packages/admin-sdk/src/_internals/*`
- Contains: request/response transport, callback registration, serializer chain, privilege validation, dataset subscription registries
- Depends on: browser `postMessage`, typed message contracts, serializer helpers, privilege checks
- Used by: public SDK modules such as `packages/admin-sdk/src/window/index.ts`, `packages/admin-sdk/src/data/index.ts`, `packages/admin-sdk/src/ui/*`, and example consumers in `examples/admin-sdk-app` and `examples/admin-sdk-plugin`

**Public SDK Facades:**
- Purpose: Expose stable, domain-oriented APIs without repeating transport logic.
- Location: `packages/admin-sdk/src/index.ts`, `packages/admin-sdk/src/window/index.ts`, `packages/admin-sdk/src/context/index.ts`, `packages/admin-sdk/src/data/index.ts`, `packages/admin-sdk/src/ui/*`
- Contains: `createSender(...)` and `createHandler(...)` wrappers, domain types, grouped exports
- Depends on: `packages/admin-sdk/src/channel.ts`
- Used by: extension code in `examples/admin-sdk-app/src/frontend/*` and `examples/admin-sdk-plugin/src/Resources/app/administration/src/*`

**Component Library Surface:**
- Purpose: Publish Vue components, styles, directives, and composables as a reusable UI system.
- Location: `packages/component-library/src/index.ts`, `packages/component-library/src/components/*`, `packages/component-library/vite.config.ts`
- Contains: SFCs, colocated stories/specs/docs, global SCSS entrypoints, build helpers, Storybook config
- Depends on: Vue 3, Vite, Storybook, tokens and icon-kit packages, and the Admin SDK for entity-oriented components
- Used by: `examples/nuxt-app`, `examples/admin-sdk-app`, `examples/admin-sdk-plugin`, and external consumers

**Code Generation Packages:**
- Purpose: Convert external design sources into versioned artifacts or tools.
- Location: `packages/tokens/src/*`, `packages/icon-kit/src/*`, `packages/create-meteor-extension/src/*`
- Contains: Figma adapters, file-system abstractions, artifact generators, CLI scaffolding templates
- Depends on: environment variables, external APIs, and package-local filesystem adapters
- Used by: package build/dev scripts, template consumers, and packages that import generated outputs such as `packages/component-library` and `packages/stylelint-plugin-meteor`

**Reference Consumers and Docs:**
- Purpose: Demonstrate runtime integration and document the SDK surface.
- Location: `examples/admin-sdk-app`, `examples/admin-sdk-plugin`, `examples/nuxt-app`, `docs/admin-sdk`
- Contains: example frontends, acceptance tests, Nuxt smoke tests, Markdown documentation aligned to SDK modules
- Depends on: workspace packages, package-specific tooling, and in the app example an Express server in `examples/admin-sdk-app/src/server.ts`
- Used by: maintainers validating package behavior and future contributors looking for implementation patterns

## Data Flow

**Admin SDK Request Flow:**

1. A public wrapper such as `packages/admin-sdk/src/window/index.ts` or `packages/admin-sdk/src/data/index.ts` calls `createSender(...)` or `send(...)`.
2. `packages/admin-sdk/src/channel.ts` builds a typed payload using `ShopwareMessageTypes` from `packages/admin-sdk/src/message-types.ts`, serializes transportable objects, and validates privileges.
3. The channel posts a message to the parent window, waits for a matching callback ID, deserializes the response, and resolves or rejects the request.

**Admin SDK Dataset Subscription Flow:**

1. Extension code calls `subscribe(...)` from `packages/admin-sdk/src/data/index.ts`.
2. The helper registers the subscription through `datasetSubscribeRegistration` and keeps local selector-aware callbacks.
3. Incoming dataset updates are filtered by dataset id and selectors before user callbacks execute.

**Component Library Build Flow:**

1. Source components live under `packages/component-library/src/components/<domain>/<component>/`.
2. `packages/component-library/build/helper.ts` recursively discovers `.vue` files and turns them into multi-entry Vite build inputs.
3. `packages/component-library/vite.config.ts` emits flattened JS and declaration files into `dist/esm` and `dist/common`, then injects CSS imports so component styles load with each entry.

**Design Token Flow:**

1. `packages/tokens/src/scripts/index.ts` wires environment config, a disk-backed file system, and the Figma client.
2. `packages/tokens/src/GenerateArtifacts.ts` fetches primitive and administration token files, builds dictionaries, and writes CSS and Tailwind deliverables into `packages/tokens/deliverables` and `packages/tokens/dictionaries`.
3. `packages/component-library/package.json` and `packages/stylelint-plugin-meteor/package.json` consume those generated outputs through workspace dependencies.

**Icon Sync Flow:**

1. `packages/icon-kit/src/index.ts` fetches icon metadata and SVG payloads from Figma.
2. The script optimizes and crops SVGs, writes files into `packages/icon-kit/icons`, and generates CSS/SCSS metadata alongside them.
3. Consumers import the package as a static asset library via `packages/icon-kit/package.json`.

**Documentation Feedback Flow:**

1. SDK behavior is implemented in `packages/admin-sdk/src/*`.
2. Example consumers in `examples/admin-sdk-app` and `examples/admin-sdk-plugin` exercise those APIs in real extension contexts.
3. Hand-written docs under `docs/admin-sdk/api-reference`, `docs/admin-sdk/concepts`, and `docs/admin-sdk/internals` mirror the same module boundaries and should stay aligned with source changes.

**State Management:**
- There is no monorepo-wide runtime state layer.
- `packages/admin-sdk` manages runtime transport state inside registries in `packages/admin-sdk/src/channel.ts`.
- `packages/component-library` keeps state local to Vue components and composables under `packages/component-library/src/components/*` and `packages/component-library/src/composables/*`.
- Code-generation packages keep state inside explicit service objects such as `GenerateArtifacts` in `packages/tokens/src/GenerateArtifacts.ts`.

## Key Abstractions

**Typed Message Contract:**
- Purpose: Define every request/response payload that may cross the SDK bridge.
- Examples: `packages/admin-sdk/src/message-types.ts`, `packages/admin-sdk/src/window/index.ts`, `packages/admin-sdk/src/data/index.ts`
- Pattern: add a message type first, then expose a thin sender/handler wrapper

**Transportable Domain Objects:**
- Purpose: Preserve complex SDK types across `postMessage`.
- Examples: `packages/admin-sdk/src/_internals/serializer/index.ts`, `packages/admin-sdk/src/_internals/serializer/criteria-serializer.ts`, `packages/admin-sdk/src/_internals/data/Entity.ts`, `packages/admin-sdk/src/_internals/data/EntityCollection.ts`
- Pattern: serializer/deserializer chain keyed by object type

**Colocated Component Module:**
- Purpose: Keep implementation, tests, and Storybook docs together per component.
- Examples: `packages/component-library/src/components/form/mt-button/mt-button.vue`, `packages/component-library/src/components/form/mt-button/mt-button.spec.ts`, `packages/component-library/src/components/form/mt-button/mt-button.stories.ts`
- Pattern: one folder per component with `.vue`, `.spec.ts`, `.stories.ts`, and optional `.mdx` or `interactive.stories.ts`

**Artifact Generator + Infrastructure Adapters:**
- Purpose: Isolate generation logic from environment-specific IO.
- Examples: `packages/tokens/src/GenerateArtifacts.ts`, `packages/tokens/src/common/domain/file-system/FileSystem.ts`, `packages/tokens/src/common/infrastructure/file-system/HardDiskFileSystem.ts`
- Pattern: domain/application object consumes interface-based adapters

**Rule Bundle Export:**
- Purpose: Assemble multiple stylelint rules into one package entry.
- Examples: `packages/stylelint-plugin-meteor/src/index.ts`, `packages/stylelint-plugin-meteor/src/rules/no-primitive-token/index.ts`
- Pattern: package root exports an array of rule plugins, each rule owns its own folder and README

## Entry Points

**Workspace Root:**
- Location: `package.json`
- Triggers: root `pnpm` or Turbo commands
- Responsibilities: declare root metadata and shared scripts

**Admin SDK Package Entry:**
- Location: `packages/admin-sdk/src/index.ts`
- Triggers: imports of `@shopware-ag/meteor-admin-sdk`
- Responsibilities: group domain APIs into `window`, `context`, `ui`, `data`, `iap`, `telemetry`, and private namespaces

**Admin SDK Transport Runtime:**
- Location: `packages/admin-sdk/src/channel.ts`
- Triggers: every sender/handler built by public SDK modules
- Responsibilities: route messages, manage callbacks, register sources/subscribers, serialize values, enforce privilege validation

**Component Library Package Entry:**
- Location: `packages/component-library/src/index.ts`
- Triggers: imports of `@shopware-ag/meteor-component-library`
- Responsibilities: export components, directives, styles, compatibility aliases, and public types

**Token Generation Script:**
- Location: `packages/tokens/src/scripts/index.ts`
- Triggers: `pnpm --dir packages/tokens start`
- Responsibilities: fetch Figma token data and write generated deliverables

**Icon Sync Script:**
- Location: `packages/icon-kit/src/index.ts`
- Triggers: `pnpm --dir packages/icon-kit start`
- Responsibilities: sync icons from Figma into static package assets

**Scaffolding CLI:**
- Location: `packages/create-meteor-extension/bin/create-meteor-extension`, `packages/create-meteor-extension/src/cli.ts`
- Triggers: the `create-meteor-extension` executable
- Responsibilities: bootstrap the Gluegun CLI and run the template-generation command

**Reference App Server:**
- Location: `examples/admin-sdk-app/src/server.ts`
- Triggers: `npm run dev` in `examples/admin-sdk-app`
- Responsibilities: host a Shopware app example, perform auth callbacks, and mount a Vite frontend in middleware mode

**Reference Plugin Frontend:**
- Location: `examples/admin-sdk-plugin/src/Resources/app/administration/src/main.ts`
- Triggers: Shopware Administration loading the plugin iframe/frontend
- Responsibilities: branch between hidden-frame command registration and view rendering

## Error Handling

**Strategy:** Handle failures inside each package, close to the integration boundary that can fail.

**Patterns:**
- `packages/admin-sdk/src/channel.ts` rejects timed-out requests, deserializes remote errors, and short-circuits invalid privilege access.
- `packages/create-meteor-extension/src/commands/create-meteor-extension.ts` validates inputs up front and rolls back partially generated output if templating fails.
- `packages/tokens/src/scripts/index.ts` and `packages/icon-kit/src/index.ts` let generation/sync failures surface from the external API or filesystem layer after logging progress.

## Cross-Cutting Concerns

**Logging:** `packages/icon-kit/src/logger/*` provides a real logger implementation, while many other packages still log directly with `console` in their local runtime scripts.
**Validation:** `packages/admin-sdk/src/_internals/validator/index.ts` validates serialized entity payloads before transport; the CLI package validates scaffold names in `packages/create-meteor-extension/src/commands/create-meteor-extension.ts`.
**Authentication:** Runtime authentication appears only in example app code through `shopware-app-server-sdk` setup in `examples/admin-sdk-app/src/server.ts`; publishable packages themselves stay auth-agnostic.

---

*Architecture analysis: 2026-04-10*
