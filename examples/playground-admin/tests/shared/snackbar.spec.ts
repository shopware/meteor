import { expect, test } from "@playwright/test";
import { gotoWith, isMobile, openDrawer } from "../fixtures";

test("the snackbar host survives route changes and exists once", async ({
  page,
}) => {
  await gotoWith(page, "/settings");

  await page.getByRole("button", { name: "Show notification" }).click();
  await expect(
    page.getByText("Notification from the snackbar host"),
  ).toHaveCount(1);

  // on mobile the navigation lives in the drawer
  if ((await isMobile(page).count()) > 0) await openDrawer(page, "start");
  await page.getByRole("link", { name: "Page one" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByText("Notification from the snackbar host"),
  ).toHaveCount(1);
});

test("the snackbar host can be disabled", async ({ page }) => {
  await gotoWith(page, "/settings", { snackbar: "0" });

  await page.getByRole("button", { name: "Show notification" }).click();
  await page.waitForTimeout(200);

  await expect(
    page.getByText("Notification from the snackbar host"),
  ).toHaveCount(0);
});
