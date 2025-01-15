import { test, expect } from "../fixtures/AcceptanceTest";
import { getSDKiFrame, mockUpdateApi } from "../fixtures/Helper";

test.beforeEach(async ({ ShopAdmin, TestDataService, AdminProductDetail }) => {
  await mockUpdateApi(ShopAdmin.page);

  const product = await TestDataService.createBasicProduct();
  await ShopAdmin.goesTo(AdminProductDetail.url(product.id));

  const mainHidden = await getSDKiFrame(ShopAdmin.page, "sw-main-hidden");
  await expect(mainHidden.locator("body")).not.toBeEmpty();
});

test("@sdk: modals", async ({ ShopAdmin }) => {
  await ShopAdmin.page.getByRole("link", { name: "Example" }).click();
  await expect(
    ShopAdmin.page.locator(".sw-card", { hasText: "Hello in the new tab" }),
  ).toBeVisible();

  const frame = await getSDKiFrame(ShopAdmin.page, "ui-modals");
  await expect(
    frame.getByRole("heading", { name: "Hello in the example card" }),
  ).toBeVisible();

  await frame.getByRole("button", { name: "Open Modal" }).click();
  await expect(
    ShopAdmin.page.locator(".sw-modal", { hasText: "Hello from the plugin" }),
  ).toBeVisible();

  // Open and close modal via SDK
  const contentFrame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-modals-modal-content",
  );
  await expect(
    contentFrame.getByRole("heading", { name: "Hello from the plugin 👋🏻" }),
  ).toBeVisible();
  await contentFrame.getByRole("button", { name: "Close modal" }).click();

  // Close modal via Shopware
  await frame.getByRole("button", { name: "Open Modal" }).click();
  await expect(
    ShopAdmin.page.locator(".sw-modal", { hasText: "Hello from the plugin" }),
  ).toBeVisible();
  await ShopAdmin.page.getByRole("button", { name: "Close modal" }).click();

  // Modal without header
  await frame.getByRole("button", { name: "Open No Header" }).click();
  await expect(
    ShopAdmin.page.locator(".sw-modal__header"),
  ).not.toBeInViewport();
  await ShopAdmin.page.getByRole("button", { name: "Close modal" }).click();

  // Small modal
  await frame.getByRole("button", { name: "Open small variant" }).click();
  await expect(ShopAdmin.page.locator(".sw-modal--small")).toBeVisible();
  await ShopAdmin.page.getByRole("button", { name: "Close modal" }).click();

  // Open modal which is not closable without action
  await frame.getByRole("button", { name: "Open none closable" }).click();
  await expect(ShopAdmin.page.locator(".sw-modal__close")).not.toBeInViewport();
  await ShopAdmin.page.getByRole("button", { name: "Close modal" }).click();
});
