import { test, expect } from "../fixtures/AcceptanceTest";
import { getSDKiFrame, mockUpdateApi } from "../fixtures/Helper";

test.beforeEach(async ({ ShopAdmin, TestDataService, AdminProductDetail }) => {
  await mockUpdateApi(ShopAdmin.page);

  const product = await TestDataService.createBasicProduct();
  ShopAdmin.goesTo(AdminProductDetail.url(product.id));

  await getSDKiFrame(ShopAdmin.page, "sw-main-hidden");
});

test("@sdk: add a component section", async ({ ShopAdmin }) => {
  await ShopAdmin.page.getByRole("tab", { name: "Specifications" }).click();

  await expect(ShopAdmin.page.getByText("Location tests")).toBeVisible();

  await expect(
    ShopAdmin.page.getByText("Testing if the location methods work correctly")
  ).toBeVisible();

  await getSDKiFrame(ShopAdmin.page, "location-index");
});

test("@sdk: add a component section with tabs", async ({ ShopAdmin }) => {
  await ShopAdmin.page.getByRole("link", { name: "Specifications" }).click();

  await expect(
    ShopAdmin.page.locator(".sw-card__title", { hasText: "Card tabs tests" })
  ).toBeVisible();
  await expect(
    ShopAdmin.page.locator(".sw-card__subtitle", {
      hasText: "Testing if the the card tabs work correctly",
    })
  ).toBeVisible();
  await expect(
    ShopAdmin.page.locator(".sw-tabs-item", { hasText: "Tab 1" })
  ).toBeVisible();

  await getSDKiFrame(ShopAdmin.page, "card-tab-1");

  await ShopAdmin.page.locator(".sw-tabs-item", { hasText: "Tab 2" }).click();

  await getSDKiFrame(ShopAdmin.page, "card-tab-2");
});
