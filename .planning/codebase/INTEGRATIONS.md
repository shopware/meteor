# External Integrations

**Analysis Date:** 2026-04-10

## APIs & External Services

**Shopware Platform:**
- Shopware Administration host bridge - The core SDK integration uses browser messaging between an extension and the Shopware Administration.
  - SDK/Client: `@shopware-ag/meteor-admin-sdk` implemented in `packages/admin-sdk/src/channel.ts`, `packages/admin-sdk/src/message-types.ts`, and `packages/admin-sdk/src/location/index.ts`
  - Auth: Origin-based message routing and privilege checks in `packages/admin-sdk/src/channel.ts`; no standalone API key is required by this bridge
- Shopware telemetry forwarding - Extension events are sent back to the Shopware Administration for analytics handling.
  - SDK/Client: `packages/admin-sdk/src/telemetry/index.ts`
  - Auth: Source extension name is resolved from the message origin in `packages/admin-sdk/src/telemetry/index.ts`
- Shopware App registration flow - The example app exposes a real authorize and callback handshake against Shopware.
  - SDK/Client: `shopware-app-server-sdk` in `examples/admin-sdk-app/src/server.ts`
  - Auth: Example HMAC signing and app registration use `NodeHmacSigner`, `InMemoryShopRepository`, and the configured callback URL in `examples/admin-sdk-app/src/server.ts`
- Shopware plugin packaging - The example plugin is packaged as a Shopware platform plugin with a separate admin frontend bundle.
  - SDK/Client: Composer metadata in `examples/admin-sdk-plugin/composer.json` and admin bundle config in `examples/admin-sdk-plugin/src/Resources/app/administration/package.json`
  - Auth: Runs inside a Shopware admin instance; acceptance tests use `APP_URL`, `ADMIN_URL`, `SHOPWARE_ADMIN_USERNAME`, and `SHOPWARE_ADMIN_PASSWORD` in `examples/admin-sdk-plugin/tests/acceptance/playwright.config.ts`

**Design Source Sync:**
- Figma Variables API - Token generation pulls local variables from a Figma file and converts them into CSS and JSON deliverables.
  - SDK/Client: `packages/tokens/src/figma/infrastructure/FigmaApi.ts` via `packages/tokens/src/scripts/index.ts`
  - Auth: `FIGMA_TOKEN`, `ADMIN_TOKENS_FILE_KEY`, and `PRIMITIVE_TOKENS_FILE_KEY` validated in `packages/tokens/src/env.ts`
- Figma File and Images API - Icon generation pulls file metadata, node metadata, and SVG image exports from Figma.
  - SDK/Client: Axios-based client in `packages/icon-kit/src/figma/index.ts`
  - Auth: `FIGMA_TOKEN` and `FIGMA_FILE` validated in `packages/icon-kit/src/env.ts`

**Docs and Release Tooling:**
- Shopware developer portal - Admin SDK docs are linked into the external `developer-portal` repository instead of being built standalone in this repo.
  - SDK/Client: `docs-cli.cjs` invoked by `docs:env`, `docs:link`, and `docs:preview` in `packages/admin-sdk/package.json`
  - Auth: Local git access to the sibling `developer-portal` checkout documented in `docs/admin-sdk/README.md`
- GitHub Actions - CI, release, preview publish, size checks, visual tests, token updates, and icon updates are all externalized to GitHub-hosted workflows.
  - SDK/Client: Workflow definitions in `.github/workflows/tests.yml`, `.github/workflows/release.yml`, `.github/workflows/npm-preview-release.yml`, `.github/workflows/visual-tests.yml`, `.github/workflows/update-tokens.yml`, `.github/workflows/update-icons.yml`, `.github/workflows/size-limit.yml`, and `.github/workflows/create-meteor-extension-integration.yml`
  - Auth: GitHub secrets such as `GITHUB_TOKEN`, `TURBO_TOKEN`, `TURBO_TEAM`, `FIGMA_TOKEN`, `TOKENS__PRIMITIVE_TOKENS_FILE_KEY`, `TOKENS__ADMIN_TOKENS_FILE_KEY`, `ICON_KIT__FIGMA_FILE`, and `ICON_KIT__COMMITTER`
- npm publishing and preview releases - Package publishing is handled outside the packages through CI.
  - SDK/Client: `changesets/action@v1` in `.github/workflows/release.yml` and `pkg-pr-new` in `.github/workflows/npm-preview-release.yml`
  - Auth: npm credentials are expected in CI and are not stored in the repository

## Data Storage

**Databases:**
- None detected for the published packages under `packages/**`.
  - Connection: Not applicable
  - Client: Not applicable
- Example-only in-memory shop persistence exists in `examples/admin-sdk-app/src/server.ts`.
  - Connection: Process memory only
  - Client: `InMemoryShopRepository` from `shopware-app-server-sdk`

**File Storage:**
- Local filesystem only
  - Token artifacts are written under `packages/tokens/deliverables/**` and `packages/tokens/dictionaries/**`
  - Icon assets are written under `packages/icon-kit/icons/**`
  - Token generation uses `HardDiskFileSystem` in `packages/tokens/src/scripts/index.ts`

**Caching:**
- Browser-side persistent cache through `localforage` and `BroadcastChannel` in `packages/admin-sdk/src/data/composables/useSharedState.ts`
- CI build caching through Turbo remote cache variables in `.github/workflows/tests.yml`, `.github/workflows/release.yml`, and `.github/workflows/size-limit.yml`

## Authentication & Identity

**Auth Provider:**
- Shopware app registration flow in the example app
  - Implementation: Express routes `/authorize` and `/authorize/callback` in `examples/admin-sdk-app/src/server.ts` use `shopware-app-server-sdk` registration helpers and HMAC signing
- Browser-hosted Shopware extension identity in the SDK
  - Implementation: `packages/admin-sdk/src/channel.ts` resolves target origin and validates privileges before handling messages
- JWT payload decoding for payment-related helpers
  - Implementation: `packages/admin-sdk/src/_private/payment/index.ts` uses `jwt-decode` to inspect tokens delivered through the Shopware integration

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- CLI-oriented logging with `ora`, `console.error`, and package-level Node logging in `packages/tokens/src/scripts/index.ts` and the dependencies declared in `packages/icon-kit/package.json`
- GitHub Actions stores Playwright reports, visual diffs, and test artifacts in `.github/workflows/tests.yml`, `.github/workflows/visual-tests.yml`, and `.github/workflows/create-meteor-extension-integration.yml`

## CI/CD & Deployment

**Hosting:**
- npm package distribution for the packages under `packages/**`
- Preview package publishing for pull requests via `.github/workflows/npm-preview-release.yml`
- Admin SDK CDN bundle output from `packages/admin-sdk/cdn`
- Admin SDK docs deployment via the external developer portal integration described in `docs/admin-sdk/README.md`

**CI Pipeline:**
- GitHub Actions
  - Static analysis, unit tests, Playwright tests, circular dependency checks: `.github/workflows/tests.yml`
  - Visual regression and Storybook tests: `.github/workflows/visual-tests.yml`
  - Release and preview publishing: `.github/workflows/release.yml` and `.github/workflows/npm-preview-release.yml`
  - Automated asset sync: `.github/workflows/update-tokens.yml` and `.github/workflows/update-icons.yml`
  - CLI integration against Shopware trunk: `.github/workflows/create-meteor-extension-integration.yml`

## Environment Configuration

**Required env vars:**
- `FIGMA_TOKEN`, `FIGMA_FILE`, `ADMIN_TOKENS_FILE_KEY`, `PRIMITIVE_TOKENS_FILE_KEY`
- `APP_URL`, `ADMIN_URL`, `SHOPWARE_ADMIN_USERNAME`, `SHOPWARE_ADMIN_PASSWORD`
- `PORT`, `URL`, `CI`
- `TURBO_TOKEN`, `TURBO_TEAM`, `API_KEY`

**Secrets location:**
- GitHub Actions secrets referenced from `.github/workflows/*.yml`
- Local process environment and `.env` loading through `dotenv` in `packages/tokens/src/env.ts`, `packages/create-meteor-extension/tests/integration/playwright.config.ts`, and `examples/admin-sdk-plugin/tests/acceptance/playwright.config.ts`
- `.env` files were referenced by code but not inspected

## Webhooks & Callbacks

**Incoming:**
- `GET /authorize` and `POST /authorize/callback` in `examples/admin-sdk-app/src/server.ts`
- Browser `message` event listeners in `packages/admin-sdk/src/channel.ts` and `packages/admin-sdk/src/_private/payment/index.ts`

**Outgoing:**
- Figma REST calls to `https://api.figma.com/v1` from `packages/tokens/src/figma/infrastructure/FigmaApi.ts` and `packages/icon-kit/src/figma/index.ts`
- Browser `window.parent.postMessage` and `event.source.postMessage` calls in `packages/admin-sdk/src/channel.ts`
- Telemetry events sent through `telemetryDispatch` in `packages/admin-sdk/src/telemetry/index.ts`

---

*Integration audit: 2026-04-10*
