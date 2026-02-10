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
    await expect(authenticatedPage.locator('.sw-dashboard-index').first()).toBeVisible({
      timeout: 10000,
    });

    // Wait for Meteor extension iframe to be present (indicates extension is loaded)
    // The iframe has the location-id parameter in its src
    await authenticatedPage.waitForSelector('iframe[src*="location-id=example-dashboard-before-content"]', {
      timeout: 20000,
      state: 'attached',
    });

    // Wait a bit more for the card component to be fully rendered
    await authenticatedPage.waitForTimeout(1000);

    // Find all cards on the page and look for ours by text content
    // Use getByText which is more flexible than exact text matching
    const card = authenticatedPage.getByText('Hello from your new Meteor app');
    
    // Scroll the card into view
    await card.scrollIntoViewIfNeeded({ timeout: 10000 });
    
    // Verify it's visible
    await expect(card).toBeVisible({ timeout: 5000 });
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

    // Wait for the product detail page to load by checking for the main tabs container
    await expect(
      authenticatedPage.locator('main').first(),
    ).toBeVisible({
      timeout: 10000,
    });

    // Look for the custom tab added by the extension
    // The tab name comes from the i18n: "Example Meteor App"
    const customTab = authenticatedPage.getByRole('tab', {
      name: 'Example Meteor App',
    });

    await expect(customTab).toBeVisible({ timeout: 10000 });

    // Click on the custom tab
    await customTab.click();

    // Verify the card inside the tab is visible
    const cardInTab = authenticatedPage.getByRole('heading', {
      name: 'Example Meteor App',
      level: 3,
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

    // Wait for the product detail page to load by checking for the main tabs container
    await expect(
      authenticatedPage.locator('main').first(),
    ).toBeVisible({
      timeout: 10000,
    });

    // Click on the custom tab
    const customTab = authenticatedPage.getByRole('tab', {
      name: 'Example Meteor App',
    });
    await customTab.click();

    // Verify the card content by looking for the text directly
    const cardSubtitle = authenticatedPage.getByText(
      'This is an example of a product card',
    );

    await expect(cardSubtitle).toBeVisible({ timeout: 10000 });

    // Check that the iframe for the product tab location exists
    const locationIframe = authenticatedPage.frameLocator(
      'iframe[src*="location-id=example-product-tab"]',
    );
    await expect(locationIframe.locator('body')).not.toBeEmpty();
  });
});
