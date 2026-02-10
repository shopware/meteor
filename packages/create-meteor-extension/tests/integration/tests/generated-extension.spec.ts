import { test, expect } from '../fixtures/IntegrationTest';

/**
 * Integration tests for the generated Meteor extension.
 * These tests verify that the CLI-generated extension works correctly
 * when installed in Shopware 6.
 */

test.describe('Generated Meteor Extension', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Mock the update API to prevent update notifications from interfering
    await authenticatedPage.route('*/**/_action/update/check', async (route) => {
      await route.fulfill({ json: null });
    });
  });

  test('Dashboard card is visible', async ({ authenticatedPage }) => {
    // Navigate to dashboard
    await authenticatedPage.goto(
      `${process.env.ADMIN_URL || 'http://localhost:8000/admin/'}#/sw/dashboard/index`
    );

    // Wait for the dashboard to load
    await expect(authenticatedPage.locator('.sw-dashboard-index')).toBeVisible({
      timeout: 10000,
    });

    // Check for the dashboard card with the expected title
    // Note: The card title comes from the i18n translations
    const cardTitle = authenticatedPage.locator('.sw-card__title', {
      hasText: 'Hello from your new Meteor app',
    });

    await expect(cardTitle).toBeVisible({ timeout: 10000 });
  });

  test('Product tab is visible and accessible', async ({
    authenticatedPage,
    createProduct,
  }) => {
    // Create a test product
    const product = await createProduct();

    // Navigate to product detail page
    await authenticatedPage.goto(
      `${process.env.ADMIN_URL || 'http://localhost:8000/admin/'}#/sw/product/detail/${product.id}`
    );

    // Wait for the product detail page to load
    await expect(
      authenticatedPage.locator('.sw-product-detail-page'),
    ).toBeVisible({
      timeout: 10000,
    });

    // Look for the custom tab added by the extension
    // The tab name comes from the i18n: "Example Meteor App"
    const customTab = authenticatedPage.getByRole('link', {
      name: 'Example Meteor App',
    });

    await expect(customTab).toBeVisible({ timeout: 10000 });

    // Click on the custom tab
    await customTab.click();

    // Verify the card inside the tab is visible
    const cardInTab = authenticatedPage.locator('.sw-card__title', {
      hasText: 'Example Meteor App',
    });

    await expect(cardInTab).toBeVisible({ timeout: 10000 });
  });

  test('Product card displays content correctly', async ({
    authenticatedPage,
    createProduct,
  }) => {
    // Create a test product
    const product = await createProduct();

    // Navigate to product detail page
    await authenticatedPage.goto(
      `${process.env.ADMIN_URL || 'http://localhost:8000/admin/'}#/sw/product/detail/${product.id}`
    );

    // Wait for the product detail page to load
    await expect(
      authenticatedPage.locator('.sw-product-detail-page'),
    ).toBeVisible({
      timeout: 10000,
    });

    // Click on the custom tab
    const customTab = authenticatedPage.getByRole('link', {
      name: 'Example Meteor App',
    });
    await customTab.click();

    // Verify the card content
    const cardSubtitle = authenticatedPage.locator('.sw-card__subtitle', {
      hasText: 'This is an example of a product card',
    });

    await expect(cardSubtitle).toBeVisible({ timeout: 10000 });

    // Check that the iframe for the location exists
    const locationIframe = authenticatedPage.frameLocator(
      'iframe[src*="location-id="]',
    );
    await expect(locationIframe.locator('body')).not.toBeEmpty();
  });
});
