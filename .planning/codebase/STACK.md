# Technology Stack

**Analysis Date:** 2026-04-10

## Languages

**Primary:**
- TypeScript 4.9-5.9 - Main implementation language across `packages/admin-sdk/src`, `packages/component-library/src`, `packages/tokens/src`, `packages/icon-kit/src`, `packages/create-meteor-extension/src`, and example apps in `examples/**`.
- Vue Single File Components on Vue 3.5 - UI implementation in `packages/component-library/src/**/*.vue`, `examples/nuxt-app/app.vue`, and `examples/admin-sdk-app/src/frontend/**/*.vue`.

**Secondary:**
- JavaScript (ESM and CommonJS) - Repo tooling and config in `package.json`, `scripts/validate-changesets.js`, `packages/admin-sdk/jest.config.js`, and `examples/admin-sdk-plugin/src/Resources/app/administration/build/webpack.config.js`.
- PHP - Shopware plugin example code in `examples/admin-sdk-plugin/src/TestPlugin.php` with package metadata in `examples/admin-sdk-plugin/composer.json`.
- CSS/SCSS and generated asset formats - Styling and design outputs in `packages/component-library/src/components/assets/scss/**`, `packages/tokens/deliverables/**`, `packages/tokens/dictionaries/**`, and `packages/icon-kit/icons/**`.

## Runtime

**Environment:**
- Node.js 22.13.0 for local development via Volta in `package.json`.
- Node.js 24 in CI workflows under `.github/workflows/release.yml`, `.github/workflows/tests.yml`, `.github/workflows/visual-tests.yml`, and related workflow files.

**Package Manager:**
- `pnpm` 10.12.3 in `package.json`.
- Lockfile: present in `pnpm-lock.yaml`.
- Workspace layout: `pnpm-workspace.yaml`.

## Frameworks

**Core:**
- Turborepo 2.5.4 - Monorepo task graph and caching in `turbo.json`.
- Vite 2/4/5/6 - Bundling and local dev in `packages/admin-sdk/vite.config.ts`, `packages/component-library/vite.config.ts`, `packages/create-meteor-extension/src/templates/blank_project/vite.config.ts`, and `examples/admin-sdk-app/src/server.ts`.
- Vue 3.5 and Nuxt 3.10 - Consumer UI stack in `packages/component-library/package.json`, `examples/nuxt-app/package.json`, and `examples/nuxt-app/nuxt.config.ts`.
- Shopware-specific packages - Core repo outputs are `@shopware-ag/meteor-admin-sdk`, `@shopware-ag/meteor-component-library`, `@shopware-ag/meteor-tokens`, `@shopware-ag/meteor-icon-kit`, and `@shopware-ag/create-meteor-extension` defined in the package manifests under `packages/**/package.json`.
- Webpack - Only detected in the Shopware plugin example admin build config at `examples/admin-sdk-plugin/src/Resources/app/administration/build/webpack.config.js`.

**Testing:**
- Vitest 3.x - Used by `packages/component-library/vitest.config.ts`, `packages/tokens/vitest.config.ts`, and `packages/icon-kit/vitest.config.ts`.
- Jest 27 and 29 with `ts-jest` - Used by `packages/admin-sdk/jest.config.js` and the inline Jest config in `packages/create-meteor-extension/package.json`.
- Playwright 1.45-1.47 - Used by `packages/admin-sdk/playwright.config.ts`, `packages/component-library/playwright.config.ts`, `examples/nuxt-app/playwright.config.ts`, `examples/admin-sdk-plugin/tests/acceptance/playwright.config.ts`, and `packages/create-meteor-extension/tests/integration/playwright.config.ts`.
- Storybook 8.6 with Storybook test runner - Used by `packages/component-library/package.json` and exercised by `.github/workflows/visual-tests.yml`.

**Build/Dev:**
- TypeScript compiler - Build and typecheck entry point for `packages/admin-sdk/package.json`, `packages/component-library/package.json`, and `packages/create-meteor-extension/package.json`.
- Changesets - Versioning and publishing in root `package.json`, `scripts/validate-changesets.js`, and `.github/workflows/release.yml`.
- Gluegun - CLI scaffolding framework in `packages/create-meteor-extension/package.json`.
- Madge - Circular dependency checks in `packages/admin-sdk/package.json` and `.github/workflows/tests.yml`.
- Size Limit - Bundle budget checks for the component library in `packages/component-library/package.json` and `.github/workflows/size-limit.yml`.

## Key Dependencies

**Critical:**
- `@shopware-ag/meteor-admin-sdk` 6.7.1 - The Shopware Administration bridge package defined in `packages/admin-sdk/package.json` and consumed from `packages/component-library/package.json`, `examples/admin-sdk-app/package.json`, and `examples/admin-sdk-plugin/src/Resources/app/administration/package.json`.
- `@shopware-ag/meteor-component-library` 4.28.1 - Shared Vue component system defined in `packages/component-library/package.json` and consumed by the example apps in `examples/admin-sdk-app/package.json` and `examples/nuxt-app/package.json`.
- `@shopware-ag/meteor-tokens` 1.4.0 - Design token distribution package defined in `packages/tokens/package.json`.
- `@shopware-ag/meteor-icon-kit` 5.6.0 - Icon asset package and sync tooling defined in `packages/icon-kit/package.json`.
- `@shopware-ag/create-meteor-extension` 0.0.1 - Scaffolding CLI defined in `packages/create-meteor-extension/package.json`.

**Infrastructure:**
- `localforage` 1.10.0 - Browser persistence for shared SDK state in `packages/admin-sdk/src/data/composables/useSharedState.ts`.
- `jwt-decode` 4.0.0 - Payment/config token decoding in `packages/admin-sdk/src/_private/payment/index.ts`.
- `zod` 3.x and `@t3-oss/env-core` 0.12.0 - Runtime env and API response validation in `packages/tokens/src/env.ts`, `packages/tokens/src/figma/infrastructure/FigmaApi.ts`, and `packages/icon-kit/src/env.ts`.
- `axios` 0.26.1 plus native `fetch` - External HTTP access for icon and token sync in `packages/icon-kit/src/figma/index.ts` and `packages/tokens/src/common/infrastructure/http-client/HttpClientUsingFetch.ts`.
- `shopware-app-server-sdk` 0.0.15 - Example Shopware app registration server in `examples/admin-sdk-app/src/server.ts`.
- `storybook`, `stylelint`, `eslint`, `prettier`, and `sass` - Authoring and quality toolchain centered in `packages/component-library/package.json`, `packages/stylelint-plugin-meteor/package.json`, and `packages/prettier-config/package.json`.

## Configuration

**Environment:**
- Local runtime and package-manager versions are pinned in `package.json`; workspace membership is declared in `pnpm-workspace.yaml`.
- Environment variables are validated or consumed in `packages/tokens/src/env.ts`, `packages/icon-kit/src/env.ts`, `packages/create-meteor-extension/tests/integration/playwright.config.ts`, `examples/admin-sdk-plugin/tests/acceptance/playwright.config.ts`, and `examples/admin-sdk-app/src/server.ts`.
- Key configs required by active code paths are `FIGMA_TOKEN`, `FIGMA_FILE`, `ADMIN_TOKENS_FILE_KEY`, `PRIMITIVE_TOKENS_FILE_KEY`, `APP_URL`, `ADMIN_URL`, `SHOPWARE_ADMIN_USERNAME`, `SHOPWARE_ADMIN_PASSWORD`, `PORT`, and `URL`.
- CI adds `TURBO_TOKEN`, `TURBO_TEAM`, `CI`, and `API_KEY` through `.github/workflows/*.yml` and `turbo.json`.

**Build:**
- Root task orchestration lives in `turbo.json`.
- Package-level build and test configs live in `packages/admin-sdk/vite.config.ts`, `packages/admin-sdk/jest.config.js`, `packages/admin-sdk/playwright.config.ts`, `packages/component-library/vite.config.ts`, `packages/component-library/vitest.config.ts`, `packages/component-library/playwright.config.ts`, `examples/nuxt-app/nuxt.config.ts`, `examples/nuxt-app/playwright.config.ts`, `examples/admin-sdk-plugin/src/Resources/app/administration/build/webpack.config.js`, and `packages/create-meteor-extension/tests/integration/playwright.config.ts`.
- Shared formatting is packaged in `packages/prettier-config/package.json`.

## Platform Requirements

**Development:**
- Node.js 22.13.0 with `pnpm` 10.12.3 is the local baseline from `package.json`.
- Browser binaries are required for Playwright-based suites in `packages/admin-sdk/package.json`, `packages/component-library/package.json`, `examples/nuxt-app/package.json`, and `packages/create-meteor-extension/tests/integration/package.json`.
- A working Shopware 6 instance is required for `examples/admin-sdk-plugin`, `examples/admin-sdk-app`, and `packages/create-meteor-extension/tests/integration`.
- A sibling checkout of `developer-portal` is required when previewing or linking Admin SDK docs through the scripts in `packages/admin-sdk/package.json` and the workflow documented in `docs/admin-sdk/README.md`.

**Production:**
- The deployable outputs are versioned npm packages from `packages/*`, a CDN UMD bundle from `packages/admin-sdk/cdn`, generated token artifacts in `packages/tokens/deliverables/**`, generated icon assets in `packages/icon-kit/icons/**`, and docs linked into the external developer portal as described in `docs/admin-sdk/README.md`.

---

*Stack analysis: 2026-04-10*
