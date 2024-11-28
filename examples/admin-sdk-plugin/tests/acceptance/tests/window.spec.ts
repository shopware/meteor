import { test, expect } from "../fixtures/AcceptanceTest";
import { getSDKiFrame, mockUpdateApi } from "../fixtures/Helper";

test.beforeEach(async ({ ShopAdmin, AdminDashboard }) => {
  await mockUpdateApi(ShopAdmin.page);

  await ShopAdmin.goesTo(AdminDashboard.url());

  // The main hidden iFrame should exist
  const mainHidden = await getSDKiFrame(ShopAdmin.page, "sw-main-hidden");
  await expect(mainHidden.locator("body")).not.toBeEmpty();
});

test("@sdk: redirect to another URL", async ({ ShopAdmin }) => {
  await ShopAdmin.page.locator(".sw-admin-menu__item--sw-order").click();
  await ShopAdmin.page.getByRole("link", { name: "Test item" }).first().click();

  const frame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-main-module-add-main-module",
  );
  await frame.locator("button", { hasText: "Dispatch a notification" }).click();

  // Click the button that opens the new tab
  await ShopAdmin.page
    .locator(".sw-button__content", { hasText: "Redirect to Shopware" })
    .click();
  // Wait for the new page to be created
  const pagePromise = ShopAdmin.page.context().waitForEvent("page");

  // Wait for the new page to be created and load
  const newPage = await pagePromise;

  // Check the URL of the new page
  expect(newPage.url()).toBe("https://www.shopware.com/en/");
});

test("@sdk: push router", async ({ ShopAdmin }) => {
  await ShopAdmin.page.locator(".sw-admin-menu__item--sw-order").click();
  await ShopAdmin.page.getByRole("link", { name: "Test item" }).first().click();

  const frame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-main-module-add-main-module",
  );
  await frame.locator("button", { hasText: "Push route" }).click();

  await expect(
    ShopAdmin.page.locator(".sw-card__title", { hasText: "Orders" }),
  ).toBeVisible();
});
