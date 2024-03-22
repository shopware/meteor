import { test, expect } from '@playwright/test';

test('renders an example page', async ({ page }) => {
  await page.goto('/');

  const cardTitle = page.getByText('Example card', { exact: true });
  await expect(cardTitle).toBeVisible();

  const paragraph = page.getByText(/this is an example card/i);
  expect(paragraph).toBeVisible();

  const bannerTitle = page.getByText('A banner', { exact: true });
  await expect(bannerTitle).not.toBeVisible();

  const button = page.getByRole('button', { name: /show banner/i });
  await expect(button).toBeVisible();

  await button.click();

  await expect(bannerTitle).toBeVisible();

  const text = page.getByTestId('example-text');
  await expect(text).toHaveText('Type something into the text field!');

  const inputField = page.getByRole('textbox', { name: /a text field/i });
  await expect(inputField).toBeVisible();
  await inputField.fill('Hello, World!');

  await expect(text).toHaveText('Hello, World!');

  await expect(page).toHaveScreenshot();
});
