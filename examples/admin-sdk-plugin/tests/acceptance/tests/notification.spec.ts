import { test, expect } from "../fixtures/AcceptanceTest";
import { getSDKiFrame, mockUpdateApi } from "../fixtures/Helper";

test.beforeEach(async ({ ShopAdmin, AdminDashboard }) => {
  await mockUpdateApi(ShopAdmin.page);

  await ShopAdmin.goesTo(AdminDashboard.url());

  // The main hidden iFrame should exist
  const mainHidden = await getSDKiFrame(ShopAdmin.page, "sw-main-hidden");
  await expect(mainHidden.locator("body")).not.toBeEmpty();
});

test("@sdk: dispatch a notification", async ({ ShopAdmin }) => {
  await ShopAdmin.page.locator(".sw-admin-menu__item--sw-order").click();
  await ShopAdmin.page.getByRole("link", { name: "Test item" }).first().click();

  const frame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-main-module-add-main-module",
  );
  await frame.locator("button", { hasText: "Dispatch a notification" }).click();

  ShopAdmin.page.locator(".sw-alert__title", { hasText: "Your title" });
  ShopAdmin.page.locator(".sw-alert__message", {
    hasText: "Your message",
  });
});
