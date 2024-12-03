import { test, expect } from "../fixtures/AcceptanceTest";
import { getSDKiFrame, mockUpdateApi } from "../fixtures/Helper";

test.beforeEach(async ({ ShopAdmin, TestDataService, AdminProductDetail }) => {
  await mockUpdateApi(ShopAdmin.page);

  // Create product and open detail page
  const product = await TestDataService.createBasicProduct();
  await ShopAdmin.goesTo(AdminProductDetail.url(product.id));

  // The main hidden iFrame should exist
  const mainHidden = await getSDKiFrame(ShopAdmin.page, "sw-main-hidden");
  await expect(mainHidden.locator("body")).not.toBeEmpty();
});

test("@sdk: update the height of the location iFrame", async ({
  ShopAdmin,
}) => {
  await ShopAdmin.page.getByRole("link", { name: "Specifications" }).click();
  await expect(
    ShopAdmin.page.locator(".sw-card__title", { hasText: "Location tests" }),
  ).toBeVisible();

  const frame = await getSDKiFrame(ShopAdmin.page, "location-index");
  await frame.locator("button", { hasText: "Stop auto resizing" }).click();

  await expect(
    frame.locator("p", { hasText: "Auto-Resize: Off" }),
  ).toBeVisible();

  await frame.locator("input").clear();
  await frame.locator("input").fill("456");
  await frame.locator("button", { hasText: "Update height manually" }).click();

  await expect(
    ShopAdmin.page.locator(`iframe[src*='location-id=location-index']`),
  ).toHaveAttribute("height", "456px");
});

test("@sdk: start auto resizing of the iFrame height", async ({
  ShopAdmin,
}) => {
  await ShopAdmin.page.getByRole("link", { name: "Specifications" }).click();
  await expect(
    ShopAdmin.page.locator(".sw-card__title", { hasText: "Location tests" }),
  ).toBeVisible();

  const frame = await getSDKiFrame(ShopAdmin.page, "location-index");
  await expect(
    frame.locator("p", { hasText: "Auto-Resize: On" }),
  ).toBeVisible();

  await frame.locator("input").clear();
  await frame.locator("input").fill("700");
  await frame
    .locator("button", { hasText: "Update height using auto resizing" })
    .click();

  /**
   * Value is higher because the margin and padding inside the iFrame
   * are also considered in automatic height
   */
  await frame.locator("button", { hasText: "Stop auto resizing" }).click();
  await expect(
    ShopAdmin.page.locator(`iframe[src*='location-id=location-index']`),
  ).toHaveAttribute("height", "736px");
});
