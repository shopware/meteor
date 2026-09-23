import { expect, test } from "@playwright/test";
import { gotoWith, trigger } from "../fixtures";

test("switching the language translates the app and the shell and is remembered", async ({
  page,
}) => {
  await gotoWith(page, "/settings");
  await expect(page.getByText("Header", { exact: true })).toBeVisible();

  await page
    .locator(".mt-field")
    .filter({ has: page.getByText("Language", { exact: true }) })
    .getByRole("textbox")
    .click();
  await page.getByTestId("mt-select-option--de").click();

  await expect(page.getByText("Kopfzeile", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Seite eins" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "de");

  await page.reload();
  await expect(page.getByText("Kopfzeile", { exact: true })).toBeVisible();

  // the shell's own snippets follow the host locale
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("button", { name: "Navigation öffnen", exact: true }),
  ).toBeVisible();
  await expect(trigger(page, "start")).toHaveCount(0);
});
