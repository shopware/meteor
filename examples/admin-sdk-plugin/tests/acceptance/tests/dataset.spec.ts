import { test, expect } from "../fixtures/AcceptanceTest";
import { getSDKiFrame, mockUpdateApi } from "../fixtures/Helper";

test.beforeEach(async ({ ShopAdmin }) => {
  await mockUpdateApi(ShopAdmin.page);

  // Go to settings
  await ShopAdmin.goesTo("/admin/#sw/settings/index/shop");

  // The main hidden iFrame should exist
  const mainHidden = await getSDKiFrame(ShopAdmin.page, "sw-main-hidden");
  await expect(mainHidden.locator("body")).not.toBeEmpty();
});

test("@sdk: dataset get", async ({ ShopAdmin }) => {
  await ShopAdmin.page
    .locator(".sw-admin-menu__navigation-link", { hasText: "Storefront" })
    .click();

  const frame = await getSDKiFrame(ShopAdmin.page, "data-dataset");
  await frame.locator("button", { hasText: "Get dataset" }).click();

  await expect(
    frame.locator("p", { hasText: "Returned name: Storefront" }),
  ).toBeVisible();
  await expect(
    frame.locator("p", { hasText: "Returned active state: true" }),
  ).toBeVisible();
});

test("@sdk: dataset subscribe", async ({ ShopAdmin }) => {
  await ShopAdmin.page
    .locator(".sw-admin-menu__navigation-link", { hasText: "Storefront" })
    .click();

  const frame = await getSDKiFrame(ShopAdmin.page, "data-dataset");
  await frame.locator("button", { hasText: "Subscribe dataset" }).click();

  await expect(
    frame.locator("p", { hasText: "Returned name: Storefront" }),
  ).toBeVisible();
});

test("@sdk: dataset update", async ({ ShopAdmin }) => {
  await ShopAdmin.page
    .locator(".sw-admin-menu__navigation-link", { hasText: "Storefront" })
    .click();

  const frame = await getSDKiFrame(ShopAdmin.page, "data-dataset");
  await frame.locator("button", { hasText: "Get dataset" }).click();

  await expect(
    frame.locator("p", { hasText: "Returned name: Storefront" }),
  ).toBeVisible();

  await frame.locator("input").clear();
  await frame.locator("input").fill("Shoppingfront");
  await frame.locator("button", { hasText: "Update to main" }).click();

  await expect(
    ShopAdmin.page.locator(".smart-bar__header", {
      hasText: "Shoppingfront",
    }),
  ).toBeVisible();
});
