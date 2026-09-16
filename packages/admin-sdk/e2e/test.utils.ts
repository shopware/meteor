import { Page, expect } from "@playwright/test";

export async function setup({
  page,
  subFrameSrc = 'http://localhost:8182',
  mainFrameSetup,
}: {
  page: Page,
  subFrameSrc?: string,
  mainFrameSetup?: (page: Page) => Promise<void>,
}) {
  await page.goto(`http://localhost:8181`);
  await expect(page.locator('h1')).toContainText('E2E channel test');

  // collect all console logs
  page.on('console', msg => {
    console.log(msg)
  })

  // e.g. register handlers that must exist before the sub frame boots
  if (mainFrameSetup) {
    await mainFrameSetup(page);
  }

  // create iFrame with other page
  await page.evaluate(async (src) => {
    // change headline to "Main window"
    document.body.innerHTML = `<h1>Main window</h1>`;

    // add iFrame with new page
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.id = 'subFrame'
    document.body.appendChild(iframe);
  }, subFrameSrc)

  await page.waitForLoadState('networkidle');

  const subFrame = page.frame({ name: 'subFrame' });

  if (subFrame === null) {
    throw new Error('The child iFrame "subFrame" was not found');
  }

  await subFrame.evaluate(async () => {
    // change headline to "Sub window"
    document.body.innerHTML = `<h1>Sub window</h1>`;
  })

  return {
    mainFrame: page,
    subFrame: subFrame
  }
}
