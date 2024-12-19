import { test, expect } from "../fixtures/AcceptanceTest";
import { getSDKiFrame, mockUpdateApi } from "../fixtures/Helper";

test.beforeEach(async ({ ShopAdmin }) => {
  await mockUpdateApi(ShopAdmin.page);

  await ShopAdmin.goesTo("/admin/#/sw/extension/my-extensions/listing/");

  const mainHidden = await getSDKiFrame(ShopAdmin.page, "sw-main-hidden");
  await expect(mainHidden.locator("body")).not.toBeEmpty();
});

test("@sdk: add main module", async ({ ShopAdmin }) => {
  await expect(
    ShopAdmin.page.locator(".sw-meteor-page__smart-bar-title"),
  ).toBeVisible();
  await ShopAdmin.page
    .locator(".sw-meteor-card__content-wrapper", { hasText: "SDK Testplugin" })
    .locator(".sw-context-button")
    .click();
  await ShopAdmin.page
    .locator(".sw-context-menu-item__text", { hasText: "Open extension" })
    .click();

  await expect(
    ShopAdmin.page.locator(".smart-bar__content", { hasText: "My App" }),
  ).toBeVisible();
});

test("@sdk: check main module with searchbar", async ({ ShopAdmin }) => {
  await expect(
    ShopAdmin.page.locator(".sw-meteor-page__smart-bar-title"),
  ).toBeVisible();

  await ShopAdmin.page.locator(".navigation-list-item__sw-extension").click();
  await expect(
    ShopAdmin.page.getByRole("link", { name: "Store" }).first(),
  ).toBeVisible();

  await ShopAdmin.page
    .getByRole("link", { name: "Test with searchbar" })
    .first()
    .click();
  await expect(
    ShopAdmin.page.locator(".smart-bar__content", {
      hasText: "Test with searchbar",
    }),
  ).toBeVisible();

  const frame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-menu-item-add-menu-item-with-searchbar",
  );
  await expect(
    frame.getByRole("heading", { name: "Hello from the new menu page" }),
  ).toBeVisible();
  await expect(ShopAdmin.page.locator(".sw-page__search-bar")).toBeVisible();
});
