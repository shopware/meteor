import { Page } from '@playwright/test';

/**
 * Login to Shopware admin panel
 */
export async function loginToShopware(page: Page): Promise<void> {
  const adminUrl = process.env.ADMIN_URL || 'http://localhost:8000/admin/';
  const username = process.env.SHOPWARE_ADMIN_USERNAME || 'admin';
  const password = process.env.SHOPWARE_ADMIN_PASSWORD || 'shopware';

  // Navigate to admin login page
  await page.goto(adminUrl);

  // Wait for login form to be visible
  await page.waitForSelector('#sw-field--username', { timeout: 10000 });

  // Fill in credentials
  await page.fill('#sw-field--username', username);
  await page.fill('#sw-field--password', password);

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for successful navigation to admin dashboard
  // The admin panel loads with a hash route like #/sw/dashboard/index
  await page.waitForURL(/.*#\/sw\/.*/, { timeout: 15000 });

  // Wait for the main admin interface to load
  await page.waitForSelector('.sw-admin-menu', { timeout: 10000 });
}
