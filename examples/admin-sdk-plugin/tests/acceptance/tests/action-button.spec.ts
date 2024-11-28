import { test, expect } from "../fixtures/AcceptanceTest";
import { getSDKiFrame, mockUpdateApi } from "../fixtures/Helper";

test.beforeEach(async ({ ShopAdmin, TestDataService, AdminProductDetail }) => {
  await mockUpdateApi(ShopAdmin.page);

  const product = await TestDataService.createBasicProduct();
  ShopAdmin.goesTo(AdminProductDetail.url(product.id));

  const mainHidden = await getSDKiFrame(ShopAdmin.page, "sw-main-hidden");
  await expect(mainHidden.locator("body")).not.toBeEmpty();
});

test("@sdk: action button", async ({ ShopAdmin }) => {
  await ShopAdmin.page.locator(".sw-app-actions").click();
  await ShopAdmin.page
    .locator(".sw-context-menu__content .sw-app-action-button", {
      hasText: "Test action",
    })
    .click();

  await expect(
    ShopAdmin.page.locator(".sw-alert__title", {
      hasText: "Action button click",
    }),
  ).toBeVisible();
  await expect(
    ShopAdmin.page.locator(".sw-alert__message", {
      hasText: "The action button in the product detail page was clicked",
    }),
  ).toBeVisible();
});
