import { expect, test } from "@playwright/test";
import { drawer, gotoWith, isMobile, openDrawer } from "../fixtures";

test("following a navigation link changes the route and closes an open drawer", async ({
  page,
}) => {
  await gotoWith(page, "/");
  const mobile = (await isMobile(page).count()) > 0;

  if (mobile) await openDrawer(page, "start");

  await page.getByRole("link", { name: "Page two" }).click();

  await expect(page).toHaveURL(/\/page-two$/);
  await expect(page.getByText("Paragraph 1 of the long page.")).toBeVisible();

  if (mobile) await expect(drawer(page, "start")).toBeHidden();
});

test("the drawer stays open on navigation when closing on navigation is disabled", async ({
  page,
}) => {
  await gotoWith(page, "/", { closeOnNavigate: "0" });
  test.skip((await isMobile(page).count()) === 0, "desktop has no drawers");

  await openDrawer(page, "start");
  await page.getByRole("link", { name: "Page two" }).click();

  await expect(page).toHaveURL(/\/page-two$/);
  await expect(drawer(page, "start")).toBeVisible();
});
