import { test, expect } from "../fixtures/AcceptanceTest";
import { getSDKiFrame, mockUpdateApi } from "../fixtures/Helper";

test.beforeEach(async ({ ShopAdmin, TestDataService, AdminProductDetail }) => {
  await mockUpdateApi(ShopAdmin.page);

  const product = await TestDataService.createBasicProduct();
  await ShopAdmin.goesTo(AdminProductDetail.url(product.id));

  const mainHidden = await getSDKiFrame(ShopAdmin.page, "sw-main-hidden");
  await expect(mainHidden.locator("body")).not.toBeEmpty();
});

test("@sdk: Check tab existence", async ({ ShopAdmin }) => {
  await ShopAdmin.page.getByRole("link", { name: "Example" }).click();
  await expect(
    ShopAdmin.page.locator(".sw-card", { hasText: "Hello in the new tab" }),
  ).toBeVisible();

  await getSDKiFrame(ShopAdmin.page, "ui-modals");

  // Reload and make sure the tab still exists
  await ShopAdmin.page.reload();
  await expect(
    ShopAdmin.page.locator(".sw-card", { hasText: "Hello in the new tab" }),
  ).toBeVisible();
});
