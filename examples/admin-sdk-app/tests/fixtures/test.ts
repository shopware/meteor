import { Page } from "@playwright/test";
import { test as base } from "@playwright/test";

/**
 * Mocks the check updates call to return null.
 *
 * This method is called before each test case to prevent the "Updates available"
 * notification from interfering with tests on older Shopware versions.
 */
export async function mockUpdateApi(page: Page): Promise<unknown> {
  return page.route("*/**/_action/update/check", async (route) => {
    const json = {};
    await route.fulfill({ json });
  });
}

export const test = base.extend<{ mockUpdateApi: void }>({
  mockUpdateApi: [
    async ({ page }, use) => {
      await mockUpdateApi(page);
      await use();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
