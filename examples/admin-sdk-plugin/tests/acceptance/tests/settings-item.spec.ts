import { test, expect } from "../fixtures/AcceptanceTest";
import { getSDKiFrame, mockUpdateApi } from "../fixtures/Helper";

test.beforeEach(async ({ ShopAdmin }) => {
  await mockUpdateApi(ShopAdmin.page);

  await ShopAdmin.goesTo("/admin/#sw/settings/index/shop");

  const mainHidden = await getSDKiFrame(ShopAdmin.page, "sw-main-hidden");
  await expect(mainHidden.locator("body")).not.toBeEmpty();
});

test("@sdk: add settings without searchbar", async ({ ShopAdmin }) => {
  await ShopAdmin.page
    .locator("#ui-menu-item-add-menu-item", { hasText: "Without searchbar" })
    .click();
  await expect(ShopAdmin.page.locator(".smart-bar__content")).toHaveText(
    "Without searchbar",
  );

  const frame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-menu-item-add-menu-item",
  );
  await expect(
    frame.getByRole("heading", { name: "Hello from the new Menu Page" }),
  ).toBeVisible();
  await expect(
    ShopAdmin.page.locator(".sw-page__search-bar"),
  ).not.toBeInViewport();
});

test("@sdk: add settings with searchbar", async ({ ShopAdmin }) => {
  await ShopAdmin.goesTo("/admin/#sw/settings/index/plugins");
  await ShopAdmin.page.getByRole("link", { name: "App Settings" }).click();
  await expect(ShopAdmin.page.locator(".smart-bar__content")).toHaveText(
    "App Settings",
  );

  const frame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-menu-item-add-menu-item",
  );
  await expect(
    frame.getByRole("heading", {
      name: "Hello from the new menu page with searchbar",
    }),
  ).toBeVisible();
  await expect(ShopAdmin.page.locator(".sw-page__search-bar")).toBeVisible();
});
