# Codebase Structure

**Analysis Date:** 2026-04-10

## Directory Layout

```text
meteor/
├── packages/                   # Publishable workspace packages
│   ├── admin-sdk/             # Shopware Administration bridge SDK
│   ├── component-library/     # Vue 3 component library and Storybook
│   ├── create-meteor-extension/ # CLI scaffolder and template source
│   ├── icon-kit/              # Icon sync tooling plus static icon outputs
│   ├── prettier-config/       # Shared Prettier package
│   ├── shared/                # Present but currently empty
│   ├── stylelint-plugin-meteor/ # Stylelint rule bundle for Meteor tokens
│   └── tokens/                # Design token dictionaries and generators
├── examples/                  # Consumer/reference applications
│   ├── admin-sdk-app/         # Shopware app example with Express + Vite
│   ├── admin-sdk-plugin/      # Shopware plugin example with acceptance tests
│   └── nuxt-app/              # Nuxt consumer of the component library
├── docs/
│   └── admin-sdk/             # Hand-written Markdown docs for the SDK
├── scripts/                   # Root maintenance scripts
├── .planning/codebase/        # Generated codebase mapping docs
├── pnpm-workspace.yaml        # Workspace membership
├── turbo.json                 # Task graph and cache outputs
└── package.json               # Root metadata and top-level scripts
```

## Directory Purposes

**`packages/admin-sdk`:**
- Purpose: Extension-side SDK for Shopware Administration integrations.
- Contains: public API modules in `packages/admin-sdk/src/*`, transport internals in `packages/admin-sdk/src/_internals/*`, tests in `packages/admin-sdk/src/*.spec.ts` and `packages/admin-sdk/e2e/*`, generated outputs in `es/`, `umd/`, and `cdn/`
- Key files: `packages/admin-sdk/src/index.ts`, `packages/admin-sdk/src/channel.ts`, `packages/admin-sdk/src/message-types.ts`, `packages/admin-sdk/AGENTS.md`

**`packages/component-library`:**
- Purpose: Vue component system with library build and Storybook documentation.
- Contains: source components in `packages/component-library/src/components/*`, composables/directives/services, Vite build helpers in `packages/component-library/build/*`, Storybook config in `packages/component-library/.storybook/*`
- Key files: `packages/component-library/src/index.ts`, `packages/component-library/vite.config.ts`, `packages/component-library/build/helper.ts`, `packages/component-library/.storybook/main.ts`

**`packages/tokens`:**
- Purpose: Generate and store Meteor design-token artifacts.
- Contains: domain/infrastructure code in `packages/tokens/src/*`, generated CSS in `packages/tokens/deliverables/*`, generated token JSON in `packages/tokens/dictionaries/*`, tests under `packages/tokens/tests` and colocated `*.test.ts`
- Key files: `packages/tokens/src/scripts/index.ts`, `packages/tokens/src/GenerateArtifacts.ts`, `packages/tokens/src/env.ts`

**`packages/icon-kit`:**
- Purpose: Sync icons from Figma and publish generated SVG/CSS assets.
- Contains: sync pipeline code in `packages/icon-kit/src/*`, generated assets in `packages/icon-kit/icons/*`, docs in `packages/icon-kit/docs/*`
- Key files: `packages/icon-kit/src/index.ts`, `packages/icon-kit/src/figma/index.ts`, `packages/icon-kit/src/filesystem/node-filesystem.ts`

**`packages/stylelint-plugin-meteor`:**
- Purpose: Package Meteor-specific stylelint rules.
- Contains: one folder per rule under `packages/stylelint-plugin-meteor/src/rules/*`, plus the package entry in `packages/stylelint-plugin-meteor/src/index.ts`
- Key files: `packages/stylelint-plugin-meteor/src/index.ts`, `packages/stylelint-plugin-meteor/src/rules/no-primitive-token/index.ts`

**`packages/create-meteor-extension`:**
- Purpose: CLI scaffold generator for extension projects.
- Contains: Gluegun CLI source in `packages/create-meteor-extension/src/*`, executable wrapper in `packages/create-meteor-extension/bin/*`, template source in `packages/create-meteor-extension/src/templates/*`
- Key files: `packages/create-meteor-extension/bin/create-meteor-extension`, `packages/create-meteor-extension/src/cli.ts`, `packages/create-meteor-extension/src/commands/create-meteor-extension.ts`

**`packages/prettier-config`:**
- Purpose: Shared Prettier configuration package.
- Contains: the exportable config surface only
- Key files: `packages/prettier-config/package.json`, `packages/prettier-config/index.js`

**`packages/shared`:**
- Purpose: Reserved workspace directory with no active implementation.
- Contains: no files at the time of analysis
- Key files: Not applicable

**`examples/admin-sdk-app`:**
- Purpose: Reference Shopware app showing Admin SDK integration from an app server context.
- Contains: Express/Vite backend in `examples/admin-sdk-app/src/server.ts`, frontend entrypoints under `examples/admin-sdk-app/src/frontend/*`, manifest in `examples/admin-sdk-app/MeteorAdminSDKApp/manifest.xml`
- Key files: `examples/admin-sdk-app/src/server.ts`, `examples/admin-sdk-app/src/frontend/main.ts`, `examples/admin-sdk-app/src/frontend/init/init-app.ts`

**`examples/admin-sdk-plugin`:**
- Purpose: Reference Shopware plugin exercising the SDK in plugin iframe mode.
- Contains: administration frontend under `examples/admin-sdk-plugin/src/Resources/app/administration/*`, plugin PHP wrapper in `examples/admin-sdk-plugin/src/TestPlugin.php`, Playwright acceptance suite in `examples/admin-sdk-plugin/tests/acceptance/*`
- Key files: `examples/admin-sdk-plugin/src/Resources/app/administration/src/main.ts`, `examples/admin-sdk-plugin/src/Resources/app/administration/src/viewRenderer.ts`, `examples/admin-sdk-plugin/tests/acceptance/tests/*.spec.ts`

**`examples/nuxt-app`:**
- Purpose: Lightweight consumer example for the component library in a Nuxt app.
- Contains: app shell in `examples/nuxt-app/app.vue`, Nuxt config, Playwright smoke test, plugin setup
- Key files: `examples/nuxt-app/app.vue`, `examples/nuxt-app/nuxt.config.ts`, `examples/nuxt-app/tests/smoke.spec.ts`

**`docs/admin-sdk`:**
- Purpose: Human-maintained documentation aligned to Admin SDK modules and concepts.
- Contains: Markdown sections grouped into `api-reference/`, `concepts/`, `internals/`, `getting-started/`, `tooling/`, and `faq/`; generated static output in `docs/admin-sdk/build/`
- Key files: `docs/admin-sdk/index.md`, `docs/admin-sdk/api-reference/index.md`, `docs/admin-sdk/internals/how-it-works.md`

**`scripts`:**
- Purpose: Root-level repo maintenance tasks.
- Contains: standalone Node scripts only
- Key files: `scripts/validate-changesets.js`

## Key File Locations

**Entry Points:**
- `package.json`: workspace root entry for package manager and root scripts
- `packages/admin-sdk/src/index.ts`: public SDK export surface
- `packages/component-library/src/index.ts`: public component-library export surface
- `packages/tokens/src/scripts/index.ts`: token generation runtime entry
- `packages/icon-kit/src/index.ts`: icon sync runtime entry
- `packages/create-meteor-extension/bin/create-meteor-extension`: CLI executable entry
- `examples/admin-sdk-app/src/server.ts`: example app server entry
- `examples/admin-sdk-app/src/frontend/main.ts`: example app frontend bootstrapping entry
- `examples/admin-sdk-plugin/src/Resources/app/administration/src/main.ts`: example plugin frontend entry
- `examples/nuxt-app/app.vue`: Nuxt example root component

**Configuration:**
- `pnpm-workspace.yaml`: workspace package membership
- `turbo.json`: task graph, cache outputs, and environment passthrough
- `packages/admin-sdk/tsconfig.json`, `packages/admin-sdk/vite.config.ts`, `packages/admin-sdk/jest.config.js`, `packages/admin-sdk/playwright.config.ts`: SDK build and test config
- `packages/component-library/vite.config.ts`, `packages/component-library/.storybook/main.ts`: component-library packaging and docs config
- `examples/nuxt-app/nuxt.config.ts`, `examples/nuxt-app/playwright.config.ts`: Nuxt example runtime and smoke-test config

**Core Logic:**
- `packages/admin-sdk/src/channel.ts`: shared message transport
- `packages/admin-sdk/src/message-types.ts`: transport contract
- `packages/component-library/build/helper.ts`: component discovery and build helpers
- `packages/tokens/src/GenerateArtifacts.ts`: design-token generation use case
- `packages/icon-kit/src/figma/index.ts`: icon source integration
- `packages/stylelint-plugin-meteor/src/rules/*`: rule implementations

**Testing:**
- `packages/admin-sdk/src/*.spec.ts`: unit tests near the SDK source
- `packages/admin-sdk/e2e/*.spec.ts`: SDK end-to-end browser tests
- `packages/component-library/src/components/**/**/*.spec.ts`: component unit tests colocated with source
- `packages/stylelint-plugin-meteor/src/rules/**/*.test.ts`: rule tests next to rule code
- `packages/tokens/src/**/*.test.ts`: unit tests colocated with generator code
- `examples/admin-sdk-plugin/tests/acceptance/tests/*.spec.ts`: plugin acceptance tests
- `examples/nuxt-app/tests/smoke.spec.ts`: consumer smoke test

## Naming Conventions

**Files:**
- Use `index.ts` as the default public barrel for a module directory, for example `packages/admin-sdk/src/window/index.ts` and `packages/admin-sdk/src/ui/modal/index.ts`.
- In `packages/component-library`, use kebab-case component folders and filenames, for example `packages/component-library/src/components/form/mt-button/mt-button.vue`.
- Keep test and story companions next to the implementation, using suffixes like `.spec.ts`, `.stories.ts`, `.interactive.stories.ts`, and `.mdx`.
- Use descriptive domain filenames for scripts and services, for example `packages/tokens/src/GenerateArtifacts.ts` and `packages/component-library/src/services/validation.service.ts`.

**Directories:**
- Put publishable code in `packages/<package-name>/`.
- Group `packages/component-library` components by functional domain first, then by component name: `src/components/<domain>/<component>/`.
- Group `packages/admin-sdk` APIs by runtime domain under `src/window`, `src/context`, `src/data`, `src/ui/*`, `src/app`, `src/iap`, and `src/telemetry`.
- Place example code in `examples/<consumer-name>/`, even when it contains nested package roots such as `examples/admin-sdk-plugin/src/Resources/app/administration/`.

## Where to Add New Code

**New Admin SDK Feature:**
- Primary code: add or update a public module under `packages/admin-sdk/src/<domain>/index.ts`
- Contract: add the message type in `packages/admin-sdk/src/message-types.ts`
- Shared transport or serialization work: use `packages/admin-sdk/src/channel.ts` or `packages/admin-sdk/src/_internals/*`
- Tests: add source-adjacent `*.spec.ts` and, if behavior is runtime-visible, extend `packages/admin-sdk/e2e/*` or `examples/admin-sdk-plugin/tests/acceptance/tests/*`
- Docs: update the matching page under `docs/admin-sdk/`

**New Component/Module:**
- Implementation: create `packages/component-library/src/components/<domain>/<component>/`
- Public export: add the component to `packages/component-library/src/index.ts`
- Styles/assets: place shared SCSS in `packages/component-library/src/components/assets/scss/*` only if it is reused across components
- Docs and tests: colocate `*.stories.ts`, optional `.mdx`, and `*.spec.ts` in the same component folder

**New Token or Artifact Generator Logic:**
- Domain logic: add classes under `packages/tokens/src/dictionary/domain/*` or `packages/tokens/src/deliverable/domain/*`
- IO adapters: add infrastructure code under `packages/tokens/src/common/infrastructure/*`
- Entrypoint wiring: keep script orchestration in `packages/tokens/src/scripts/index.ts`

**New Stylelint Rule:**
- Implementation: create `packages/stylelint-plugin-meteor/src/rules/<rule-name>/index.ts`
- Documentation: add `packages/stylelint-plugin-meteor/src/rules/<rule-name>/README.md`
- Tests: add `packages/stylelint-plugin-meteor/src/rules/<rule-name>/<rule-name>.test.ts`
- Registration: export the rule from `packages/stylelint-plugin-meteor/src/index.ts`

**New Example or Consumer Flow:**
- App-style Admin SDK example code: use `examples/admin-sdk-app/src/frontend/*`
- Plugin-style Admin SDK example code: use `examples/admin-sdk-plugin/src/Resources/app/administration/src/*`
- Generic component-library usage example: use `examples/nuxt-app/*`

**Utilities:**
- Package-local helpers belong in that package, for example `packages/component-library/src/helper/*` or `packages/admin-sdk/src/_internals/utils.ts`
- Do not default to `packages/shared/` because it has no established ownership or patterns in the current repo state

## Special Directories

**`packages/admin-sdk/es`:**
- Purpose: generated ESM build output
- Generated: Yes
- Committed: Yes

**`packages/admin-sdk/umd`:**
- Purpose: generated UMD build output
- Generated: Yes
- Committed: Yes

**`packages/admin-sdk/cdn`:**
- Purpose: generated CDN bundle output
- Generated: Yes
- Committed: Yes

**`packages/admin-sdk/testpageDist`:**
- Purpose: built test page served by local SDK dev workflows
- Generated: Yes
- Committed: Yes

**`packages/admin-sdk/coverage`:**
- Purpose: unit-test coverage artifacts
- Generated: Yes
- Committed: Yes in the current repo state

**`packages/component-library/dist`:**
- Purpose: published library output
- Generated: Yes
- Committed: Yes

**`packages/component-library/storybook-static`:**
- Purpose: built Storybook site
- Generated: Yes
- Committed: Yes in the current repo state

**`packages/component-library/build`:**
- Purpose: build helper source, not generated output
- Generated: No
- Committed: Yes

**`packages/tokens/deliverables`:**
- Purpose: generated CSS and Tailwind artifacts
- Generated: Yes
- Committed: Yes

**`packages/tokens/dictionaries`:**
- Purpose: generated token JSON dictionaries
- Generated: Yes
- Committed: Yes

**`docs/admin-sdk/build`:**
- Purpose: generated static documentation site output
- Generated: Yes
- Committed: Yes

**`examples/nuxt-app/.nuxt` and `examples/nuxt-app/.output`:**
- Purpose: Nuxt dev/build artifacts
- Generated: Yes
- Committed: Present in the working tree but not source targets for new code

---

*Structure analysis: 2026-04-10*
