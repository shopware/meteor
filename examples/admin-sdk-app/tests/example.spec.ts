import { test, expect } from "./fixtures/test";

test("should navigate to the admin page", async ({ page }) => {
  await page.goto("/admin");

  await expect(page.getByRole("heading")).toContainText(
    "Log in to your Shopware store"
  );
});
