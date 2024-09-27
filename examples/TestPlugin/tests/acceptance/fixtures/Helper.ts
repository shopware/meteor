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
