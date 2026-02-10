import { test, expect } from '../fixtures/IntegrationTest';

/**
 * Integration tests for the generated Meteor extension.
 * These tests verify that the CLI-generated extension works correctly
 * when installed in Shopware 6.
 */

test.describe('Generated Meteor Extension', () => {
  test.beforeEach(async ({ ShopAdmin }) => {
    // Mock the update API to prevent update notifications from interfering
    await ShopAdmin.page.route('*/**/_action/update/check', async (route) => {
      await route.fulfill({ json: null });
    });
  });

  test('Dashboard card is visible', async ({ ShopAdmin }) => {
    // Navigate to dashboard
    await ShopAdmin.goToMainMenuEntry({ mainMenuKey: 'sw-dashboard' });

    // Wait for the dashboard to load
    await expect(ShopAdmin.page.locator('.sw-dashboard-index')).toBeVisible({
      timeout: 10000,
    });

    // Check for the dashboard card with the expected title
    // Note: The card title comes from the i18n translations
    const cardTitle = ShopAdmin.page.locator('.sw-card__title', {
      hasText: 'Hello from your new Meteor app',
    });

    await expect(cardTitle).toBeVisible({ timeout: 10000 });
  });

  test('Product tab is visible and accessible', async ({
    ShopAdmin,
    TestDataService,
    AdminProductDetail,
  }) => {
    // Create a test product
    const product = await TestDataService.createBasicProduct();

    // Navigate to product detail page
    await ShopAdmin.goesTo(AdminProductDetail.url(product.id));

    // Wait for the product detail page to load
    await expect(
      ShopAdmin.page.locator('.sw-product-detail-page'),
    ).toBeVisible({
      timeout: 10000,
    });

    // Look for the custom tab added by the extension
    // The tab name comes from the i18n: "Example Meteor App"
    const customTab = ShopAdmin.page.getByRole('link', {
      name: 'Example Meteor App',
    });

    await expect(customTab).toBeVisible({ timeout: 10000 });

    // Click on the custom tab
    await customTab.click();

    // Verify the card inside the tab is visible
    const cardInTab = ShopAdmin.page.locator('.sw-card__title', {
      hasText: 'Example Meteor App',
    });

    await expect(cardInTab).toBeVisible({ timeout: 10000 });
  });

  test('Product card displays content correctly', async ({
    ShopAdmin,
    TestDataService,
    AdminProductDetail,
  }) => {
    // Create a test product
    const product = await TestDataService.createBasicProduct();

    // Navigate to product detail page
    await ShopAdmin.goesTo(AdminProductDetail.url(product.id));

    // Wait for the product detail page to load
    await expect(
      ShopAdmin.page.locator('.sw-product-detail-page'),
    ).toBeVisible({
      timeout: 10000,
    });

    // Click on the custom tab
    const customTab = ShopAdmin.page.getByRole('link', {
      name: 'Example Meteor App',
    });
    await customTab.click();

    // Verify the card content
    const cardSubtitle = ShopAdmin.page.locator('.sw-card__subtitle', {
      hasText: 'This is an example of a product card',
    });

    await expect(cardSubtitle).toBeVisible({ timeout: 10000 });

    // Check that the iframe for the location exists
    const locationIframe = ShopAdmin.page.frameLocator(
      'iframe[src*="location-id="]',
    );
    await expect(locationIframe.locator('body')).not.toBeEmpty();
  });
});
