import { expect, test } from "@playwright/test";
import { gotoWith } from "../fixtures";

test("the theme select stores the preference and the shell applies it", async ({
  page,
}) => {
  await gotoWith(page, "/settings");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page
    .locator(".mt-field")
    .filter({ has: page.getByText("Theme", { exact: true }) })
    .getByRole("textbox")
    .click();
  await page.getByTestId("mt-select-option--dark").click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => localStorage.getItem("mt-theme"))).toBe(
    "dark",
  );

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("the default system theme follows the OS preference", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await gotoWith(page, "/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.emulateMedia({ colorScheme: "light" });

  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("future flags reach the components inside the shell", async ({ page }) => {
  await gotoWith(page, "/settings");
  await expect(page.locator(".mt-switch").first()).toHaveClass(
    /mt-switch--future-no-min-height/,
  );

  await gotoWith(page, "/settings", { future: "0" });
  await expect(page.locator(".mt-switch").first()).not.toHaveClass(
    /mt-switch--future-no-min-height/,
  );
});
