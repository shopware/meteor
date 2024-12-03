import { test, expect } from "../fixtures/AcceptanceTest";
import { getSDKiFrame, mockUpdateApi } from "../fixtures/Helper";

// Defaults
const DEFAULT_LANGUAGE_ID = "2fbb5fe2e29a4d70aa5854ce7ce3e20b";
const LOCALE = "en-GB";
const FALLBACK_LOCALE = "en-GB";

// Used to keep track of the current product id
let productId = "";

test.beforeEach(async ({ ShopAdmin, TestDataService, AdminDashboard }) => {
  await mockUpdateApi(ShopAdmin.page);

  // Create product and assign id
  const product = await TestDataService.createBasicProduct();
  productId = product.id;

  // Go to dashboard
  await ShopAdmin.goesTo(AdminDashboard.url());

  // The main hidden iFrame should exist
  const mainHidden = await getSDKiFrame(ShopAdmin.page, "sw-main-hidden");
  await expect(mainHidden.locator("body")).not.toBeEmpty();
});

test("@sdk: get current language", async ({ ShopAdmin }) => {
  await ShopAdmin.page.locator(".sw-order").click();

  await ShopAdmin.page.getByRole("link", { name: "Test item" }).first().click();

  const frame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-main-module-add-main-module",
  );
  await frame.locator("button", { hasText: "Get current language" }).click();

  await expect(
    frame.locator("p", {
      hasText: `system-language-ID: ${DEFAULT_LANGUAGE_ID}`,
    }),
  ).toBeVisible();
  await expect(
    frame.locator("p", { hasText: `languageId: ${DEFAULT_LANGUAGE_ID}` }),
  ).toBeVisible();
});

test("@sdk: subscribe on language changes", async ({
  ShopAdmin,
  AdminProductDetail,
}) => {
  // Go to product directly
  await ShopAdmin.goesTo(AdminProductDetail.url(productId));

  // Open app action buttons
  await ShopAdmin.page.locator(".sw-app-actions").click();
  await expect(
    ShopAdmin.page.locator(".sw-context-menu__content"),
  ).toBeVisible();

  // activate language subscription
  await ShopAdmin.page
    .locator(".sw-context-menu__content .sw-app-action-button", {
      hasText: "Activate language subscription",
    })
    .click();

  // expect notification
  await expect(
    ShopAdmin.page.locator(".sw-alert__title", {
      hasText: "Subscriber activated",
    }),
  ).toBeVisible();
  await expect(
    ShopAdmin.page.locator(".sw-alert__message", {
      hasText: "The subscriber for language changes was activated",
    }),
  ).toBeVisible();

  // close notification
  await ShopAdmin.page.locator(".sw-alert__close").click();

  // change language
  await ShopAdmin.page.locator(".sw-language-switch input").click();
  await ShopAdmin.page
    .locator(".sw-select-result", { hasText: "Deutsch" })
    .click();

  // check for subscriber alert
  await expect(
    ShopAdmin.page.locator(".sw-alert__title", {
      hasText: "Language changes",
    }),
  ).toBeVisible();
  await expect(
    ShopAdmin.page.locator(".sw-alert__message", { hasText: "languageId: " }),
  ).toBeVisible(); // this id is random therefore no explicit check
  await expect(
    ShopAdmin.page.locator(".sw-alert__message", {
      hasText: `systemLanguageId: ${DEFAULT_LANGUAGE_ID}`,
    }),
  ).toBeVisible();
});

test("@sdk: get current environment", async ({ ShopAdmin }) => {
  await ShopAdmin.page.locator(".sw-order").click();

  await ShopAdmin.page.getByRole("link", { name: "Test item" }).first().click();

  const frame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-main-module-add-main-module",
  );
  await frame.locator("button", { hasText: "Get current environment" }).click();

  await expect(
    frame.locator("p", { hasText: "Environment: production" }),
  ).toBeVisible();
});

test("@sdk: get current locale", async ({ ShopAdmin }) => {
  await ShopAdmin.page.locator(".sw-order").click();

  await ShopAdmin.page.getByRole("link", { name: "Test item" }).first().click();

  const frame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-main-module-add-main-module",
  );
  await frame.locator("button", { hasText: "Get current locale" }).click();

  await expect(
    frame.locator("p", { hasText: `Locale: ${LOCALE}` }),
  ).toBeVisible();
  await expect(
    frame.locator("p", { hasText: `Fallback Locale: ${FALLBACK_LOCALE}` }),
  ).toBeVisible();
});

test("@sdk: subscribe on locale changes", async ({
  ShopAdmin,
  AdminProductDetail,
}) => {
  // Go to product directly
  await ShopAdmin.goesTo(AdminProductDetail.url(productId));

  // Open app action buttons
  await ShopAdmin.page.locator(".sw-app-actions").click();
  await expect(
    ShopAdmin.page.locator(".sw-context-menu__content"),
  ).toBeVisible();

  // activate locale subscription
  await ShopAdmin.page
    .locator(".sw-context-menu__content .sw-app-action-button", {
      hasText: "Activate locale subscription",
    })
    .click();

  // expect notification
  await expect(
    ShopAdmin.page.locator(".sw-alert__title", {
      hasText: "Subscriber activated",
    }),
  ).toBeVisible();
  await expect(
    ShopAdmin.page.locator(".sw-alert__message", {
      hasText: "The subscriber for locale changes was activated",
    }),
  ).toBeVisible();

  // close notification
  await ShopAdmin.page.locator(".sw-alert__close").click();

  // change locale
  await ShopAdmin.page.locator(".sw-admin-menu__user-name").click();
  await ShopAdmin.page.getByRole("link", { name: "Your profile" }).click();
  await expect(
    ShopAdmin.page.locator(".smart-bar__header", { hasText: "Your Profile" }),
  ).toBeVisible();
  await ShopAdmin.page
    .locator("select", { hasText: "English (United Kingdom)" })
    .selectOption("German (Germany)");
  await ShopAdmin.page.locator("button", { hasText: "Save" }).click();
  await ShopAdmin.page.locator("#sw-field--confirm-password").fill("shopware");
  await ShopAdmin.page.locator("button", { hasText: "Confirm" }).click();

  // check for subscriber alert
  await expect(
    ShopAdmin.page.locator(".sw-alert__title", { hasText: "Locale changes" }),
  ).toBeVisible();
  await expect(
    ShopAdmin.page.locator(".sw-alert__message", {
      hasText: "locale: de-DE",
    }),
  ).toBeVisible();
  await expect(
    ShopAdmin.page.locator(".sw-alert__message", {
      hasText: "fallbackLocale: en-GB",
    }),
  ).toBeVisible();
});

test("@sdk: get current shopware version", async ({ ShopAdmin }) => {
  await ShopAdmin.page.locator(".sw-order").click();

  await ShopAdmin.page.getByRole("link", { name: "Test item" }).first().click();

  const frame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-main-module-add-main-module",
  );
  await frame
    .locator("button", { hasText: "Get current Shopware version" })
    .click();

  await expect(
    frame.locator("p", { hasText: "Shopware version: 6." }),
  ).toBeVisible();
});

test("@sdk: get app information", async ({ ShopAdmin }) => {
  await ShopAdmin.page.locator(".sw-order").click();

  await ShopAdmin.page.getByRole("link", { name: "Test item" }).first().click();

  const frame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-main-module-add-main-module",
  );
  await frame.locator("button", { hasText: "Get app information" }).click();

  await expect(
    frame.locator("p", { hasText: "App name: TestPlugin" }),
  ).toBeVisible();
  await expect(
    frame.locator("p", { hasText: "App type: plugin" }),
  ).toBeVisible();
});

test("@sdk: get module information", async ({ ShopAdmin }) => {
  await ShopAdmin.page.locator(".sw-order").click();

  await ShopAdmin.page.getByRole("link", { name: "Test item" }).first().click();

  const frame = await getSDKiFrame(
    ShopAdmin.page,
    "ui-main-module-add-main-module",
  );
  await frame.locator("button", { hasText: "Get module information" }).click();

  await expect(
    frame.locator("p", {
      hasText:
        "Display search bar: true Heading: App Settings LocationId: ui-menu-item-add-menu-item-with-searchbar",
    }),
  ).toBeVisible();
});
