import { test, expect } from "../fixtures/AcceptanceTest";
import { getSDKiFrame, mockUpdateApi } from "../fixtures/Helper";

test.beforeEach(async ({ ShopAdmin, AdminDashboard }) => {
  await mockUpdateApi(ShopAdmin.page);

  await ShopAdmin.goesTo(AdminDashboard.url());

  const mainHidden = await getSDKiFrame(ShopAdmin.page, "sw-main-hidden");
  await expect(mainHidden.locator("body")).not.toBeEmpty();
});

test("@sdk: add menu item", async ({ ShopAdmin }) => {
  await ShopAdmin.page.locator(".sw-order").click();
  await ShopAdmin.page.getByRole("link", { name: "Test item" }).first().click();

  const frame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-main-module-add-main-module",
  );

  await expect(
    frame.getByRole("heading", { name: "Hello from the new Menu Page" }),
  ).toBeVisible();
});

test("@sdk: add menu item at third level", async ({ ShopAdmin }) => {
  await ShopAdmin.page.locator(".sw-catalogue").click();

  // Trigger hover manually - Both statements are needed!
  await ShopAdmin.page
    .getByRole("link", { name: "Manufacturers" })
    .first()
    .hover();
  await ShopAdmin.page.evaluate(() => {
    const element = document.querySelector(
      '.sw-admin-menu__navigation-link-label[title="Manufacturers"]',
    );
    if (element) {
      element.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    }
  });
  await ShopAdmin.page
    .getByRole("link", { name: "Third level" })
    .nth(1)
    .click();

  const frame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-main-module-add-main-module",
  );
  await expect(
    frame.getByRole("heading", { name: "Hello from the new Menu Page" }),
  ).toBeVisible();
});

test("@sdk: check menu position", async ({ ShopAdmin }) => {
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

  await expect(
    ShopAdmin.page
      .locator(
        ".sw-admin-menu__item--sw-extension > .sw-admin-menu__sub-navigation-list > .navigation-list-item__type-plugin",
      )
      .first(),
  ).toHaveText("First item");
});
