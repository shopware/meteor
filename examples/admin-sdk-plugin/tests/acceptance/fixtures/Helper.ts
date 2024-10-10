import { Page, Frame, expect } from '@playwright/test';

export async function getSDKiFrame(
  page: Page,
  locationId: string,
): Promise<Frame> {
  // Wait for the iframe to be present in the DOM
  const iframeLocator = page.frameLocator(
    `iframe[src*="location-id=${locationId}"]`,
  );

  // Wait for the iframe's content to be loaded
  await expect(iframeLocator.locator('body')).not.toBeEmpty();

  // Get the Frame object
  const frame = page.frame({ url: new RegExp(`location-id=${locationId}`) });

  if (!frame) {
    throw new Error(`Unable to find iframe with location-id=${locationId}`);
  }

  return frame;
}

/**
 * Mocks the check updates call to return null.
 * 
 * This method is called before each test case to prevent the "Updates available" 
 * notification from interfering with tests on older Shopware versions.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mockUpdateApi(page: Page): Promise<any> {
  return page.route('*/**/_action/update/check', async (route) => {
    const json = null;
    await route.fulfill({ json });
  });
}
