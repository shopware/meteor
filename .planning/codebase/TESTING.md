# Testing Patterns

**Analysis Date:** 2026-04-10

## Test Framework

**Runner:**
- `vitest` is the main runner for `packages/component-library` (`packages/component-library/vitest.config.ts`), `packages/tokens` (`packages/tokens/vitest.config.ts`), and `packages/icon-kit` (`packages/icon-kit/package.json`).
- `jest` is still used in `packages/admin-sdk` (`packages/admin-sdk/jest.config.js`) and `packages/create-meteor-extension` (`packages/create-meteor-extension/package.json`).
- `node --test` plus `stylelint-test-rule-node` is used for `packages/stylelint-plugin-meteor` (`packages/stylelint-plugin-meteor/package.json`).
- `playwright` covers browser and end-to-end flows in `packages/admin-sdk/e2e/channel.spec.ts`, `examples/admin-sdk-plugin/tests/acceptance/tests/*.spec.ts`, `examples/nuxt-app/tests/smoke.spec.ts`, and `packages/create-meteor-extension/tests/integration/tests/generated-extension.spec.ts`.

**Assertion Library:**
- `expect` comes from the active runner.
- `packages/component-library/vitest.setup.ts` installs `@testing-library/jest-dom/vitest`, so DOM matchers such as `toBeVisible`, `toHaveFocus`, and `toHaveText` are standard there.
- Playwright suites use locator assertions directly from `@playwright/test`.

**Run Commands:**
```bash
pnpm --dir packages/component-library test:unit
pnpm --dir packages/tokens test:unit
pnpm --dir packages/icon-kit test:unit
pnpm --dir packages/admin-sdk test:unit
pnpm --dir packages/admin-sdk test:e2e
pnpm --dir packages/create-meteor-extension test
pnpm --dir packages/create-meteor-extension/tests/integration test
pnpm --dir examples/admin-sdk-plugin/tests/acceptance test:ats
pnpm --dir examples/nuxt-app test:e2e
pnpm --dir packages/stylelint-plugin-meteor test:unit
```

## Test File Organization

**Location:**
- Co-locate unit tests with source in `packages/component-library/src/**`, `packages/admin-sdk/src/**`, `packages/tokens/src/**`, `packages/icon-kit/src/**`, and `packages/stylelint-plugin-meteor/src/**`.
- Keep browser/integration suites in dedicated test directories:
  - `packages/admin-sdk/e2e/`
  - `packages/create-meteor-extension/tests/integration/`
  - `examples/admin-sdk-plugin/tests/acceptance/`
  - `examples/nuxt-app/tests/`
- `packages/create-meteor-extension/__tests__/` is the exception: Jest tests live in a package-level test folder instead of beside source.

**Naming:**
- Use `.spec.ts` for component, SDK, and Playwright specs, for example `packages/component-library/src/components/overlay/mt-modal/mt-modal.spec.ts` and `packages/admin-sdk/e2e/channel.spec.ts`.
- Use `.test.ts` for domain-heavy and Vitest packages, for example `packages/tokens/src/GenerateArtifacts.test.ts`, `packages/icon-kit/src/domain/css-file.test.ts`, and `packages/stylelint-plugin-meteor/src/rules/prefer-color-token/prefer-color-token.test.ts`.
- Jest tests in `packages/create-meteor-extension/__tests__/` also use `.test.ts`.

**Structure:**
```text
packages/component-library/src/components/<group>/<component>/<component>.vue
packages/component-library/src/components/<group>/<component>/<component>.spec.ts

packages/admin-sdk/src/<feature>.ts
packages/admin-sdk/src/<feature>.spec.ts
packages/admin-sdk/e2e/channel.spec.ts

packages/create-meteor-extension/tests/integration/fixtures/IntegrationTest.ts
packages/create-meteor-extension/tests/integration/tests/generated-extension.spec.ts
```

## Test Structure

**Suite Organization:**
```typescript
describe("mt-text-field", () => {
  it("emits a blur event when the user blurs the input", async () => {
    // ARRANGE
    const handler = vi.fn();
    render(MtTextField, { attrs: { onBlur: handler } });

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(handler).toHaveBeenCalledExactlyOnceWith(expect.any(FocusEvent));
  });
});
```

**Patterns:**
- `packages/component-library/src/**` favors `describe`/`it`, section comments, and user-centric assertions with Testing Library or Vue Test Utils.
- `packages/tokens/src/**` and `packages/icon-kit/src/**` often use flat `test(...)` blocks instead of nested suites.
- Playwright suites use `test.beforeEach(...)`, shared fixtures, and locator-driven interactions, for example `examples/admin-sdk-plugin/tests/acceptance/tests/dataset.spec.ts`.

## Mocking

**Framework:** package-specific

**Patterns:**
```typescript
vi.mock("node:fs", () => ({
  default: {
    writeFileSync: () => null,
    readFileSync: () => null,
    mkdirSync: () => null,
    rmSync: () => null,
  },
}));

jest.mock("../index", () => ({
  get: jest.fn(),
  subscribe: jest.fn(),
  update: jest.fn(),
}));
```

**What to Mock:**
- Mock browser-unfriendly dependencies and boundary APIs:
  - `node:fs` in `packages/icon-kit/src/filesystem/node-filesystem.test.ts`
  - SDK bridge functions in `packages/admin-sdk/src/data/composables/useDataset.spec.ts`
  - Vue utilities such as debounce/throttle or `@vueuse/core` in component-library specs like `packages/component-library/src/components/form/mt-select/mt-select.spec.ts`
  - HTTP responses with MSW in `packages/tokens/src/GenerateArtifacts.test.ts`
  - Playwright network calls with `page.route(...)` in `packages/create-meteor-extension/tests/integration/tests/generated-extension.spec.ts` and `examples/admin-sdk-plugin/tests/acceptance/fixtures/Helper.ts`

**What NOT to Mock:**
- Do not mock the rendered DOM for interaction-heavy component tests; `packages/component-library/src/components/form/mt-text-field/mt-text-field.spec.ts` and `packages/component-library/src/components/overlay/mt-modal/mt-modal.spec.ts` interact with real rendered markup.
- Do not replace CLI filesystem effects when the test is validating generated output; `packages/create-meteor-extension/__tests__/cli-integration.test.ts` creates a temp directory and inspects generated files directly.
- Do not mock iframe communication in Playwright coverage; `packages/admin-sdk/e2e/channel.spec.ts` and `examples/admin-sdk-plugin/tests/acceptance/tests/*.spec.ts` exercise the real browser boundary.

## Fixtures and Factories

**Test Data:**
```typescript
export const test = base.extend<{
  authenticatedPage: Page
  createProduct: typeof createBasicProduct
}>({
  authenticatedPage: async ({ page }, use) => {
    await loginToShopware(page)
    await use(page)
  },
});
```

**Location:**
- `packages/create-meteor-extension/tests/integration/fixtures/IntegrationTest.ts` extends Playwright fixtures for authenticated Shopware pages and product creation helpers.
- `examples/admin-sdk-plugin/tests/acceptance/fixtures/AcceptanceTest.ts` re-exports and merges the shared Shopware acceptance suite.
- `examples/admin-sdk-plugin/tests/acceptance/fixtures/Helper.ts` provides iframe lookup and API stubbing helpers.
- `packages/admin-sdk/e2e/test.utils.ts` bootstraps the two-window iframe test harness.
- `packages/tokens/tests/mocks/node.ts` wires MSW server lifecycle for token-generation tests.

## Coverage

**Requirements:** package-specific
- `packages/admin-sdk/package.json` runs `jest --collectCoverage` for `test:unit`, so unit coverage is an expected output there.
- `packages/create-meteor-extension/package.json` exposes `coverage`, but it is opt-in rather than part of the default test script.
- No workspace-wide minimum coverage threshold is detected.

**View Coverage:**
```bash
pnpm --dir packages/admin-sdk test:unit
pnpm --dir packages/create-meteor-extension coverage
```

## Test Types

**Unit Tests:**
- `packages/component-library/src/**` tests Vue components, directives, utilities, and services in jsdom.
- `packages/admin-sdk/src/**` tests bridge behavior, composables, serializers, and private payment flow logic under Jest.
- `packages/tokens/src/**` and `packages/icon-kit/src/**` test domain objects and infrastructure with Vitest.
- `packages/stylelint-plugin-meteor/src/**` tests lint rules against accept/reject CSS samples.

**Integration Tests:**
- `packages/create-meteor-extension/__tests__/cli-integration.test.ts` runs the CLI, creates output on disk, and verifies generated files.
- `packages/create-meteor-extension/tests/integration/tests/generated-extension.spec.ts` installs the generated extension into a running Shopware instance and verifies real admin locations.

**E2E Tests:**
- `packages/admin-sdk/e2e/channel.spec.ts` validates cross-window messaging in a browser.
- `examples/admin-sdk-plugin/tests/acceptance/tests/*.spec.ts` validate SDK integration against Shopware Administration.
- `examples/nuxt-app/tests/smoke.spec.ts` verifies the example app end-to-end, including a visual snapshot with `toHaveScreenshot()`.

## Common Patterns

**Async Testing:**
```typescript
const [result, app] = mockLoadComposableInApp(() => useDataset("product"));
await flushPromises();
expect(result.isReady.value).toBe(true);
app.$destroy();
```
- Use `flushPromises()` in Vue/Jest suites when watchers or async composables must settle, for example `packages/admin-sdk/src/data/composables/useDataset.spec.ts`.
- Use `await userEvent...`, `await fireEvent...`, and `await expect(...)` in component-library tests.
- Use Playwright locators and explicit waits instead of raw timers where possible; targeted timeouts still appear in integration suites.

**Error Testing:**
```typescript
if (!frame) {
  throw new Error(`Unable to find iframe with location-id=${locationId}`);
}
```
- Assert thrown errors directly for domain failures in `packages/tokens` and `packages/icon-kit`.
- In browser suites, fail early by throwing from helper utilities such as `examples/admin-sdk-plugin/tests/acceptance/fixtures/Helper.ts` and `packages/admin-sdk/e2e/test.utils.ts`.
- `packages/admin-sdk/jest.afterEnv.js` enables `jest-fail-on-console`, so unexpected console output is treated as a test failure unless explicitly mocked or asserted.

---

*Testing analysis: 2026-04-10*
