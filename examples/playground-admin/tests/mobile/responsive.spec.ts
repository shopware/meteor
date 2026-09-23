import { expect, test } from "@playwright/test";
import {
  backdrop,
  drawer,
  gotoWith,
  openDrawer,
  shell,
  trigger,
} from "../fixtures";

test("returns to inline sidebars when the viewport grows while a drawer is open", async ({
  page,
}) => {
  await gotoWith(page, "/");
  await openDrawer(page, "start");

  await page.setViewportSize({ width: 1440, height: 900 });

  await expect(shell(page)).toHaveAttribute("data-layout", "desktop");
  await expect(shell(page)).not.toHaveAttribute("data-drawer");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(backdrop(page)).toHaveCount(0);
  await expect(trigger(page, "start")).toHaveCount(0);
  const sidebar = page.getByRole("complementary", { name: "Navigation" });
  await expect(sidebar).toBeVisible();
  await expect(sidebar).not.toHaveAttribute("inert");
  await expect(sidebar).not.toHaveAttribute("aria-modal");
  await expect(page.getByRole("main")).not.toHaveAttribute("inert");

  await page.setViewportSize({ width: 390, height: 844 });

  await expect(shell(page)).toHaveAttribute("data-layout", "mobile");
  await expect(drawer(page, "start")).toBeHidden();
  await expect(backdrop(page)).toBeHidden();
});

test("uses the same sidebar element in both layouts", async ({ page }) => {
  await gotoWith(page, "/");
  await openDrawer(page, "start");
  const idBefore = await drawer(page, "start").getAttribute("id");
  await drawer(page, "start").evaluate((element) => {
    (element as HTMLElement & { __marker?: boolean }).__marker = true;
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  const sidebar = page.getByRole("complementary", { name: "Navigation" });
  await expect(sidebar).toHaveAttribute("id", idBefore ?? "");
  expect(
    await sidebar.evaluate(
      (element) => (element as HTMLElement & { __marker?: boolean }).__marker,
    ),
  ).toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  await openDrawer(page, "start");
  expect(
    await drawer(page, "start").evaluate(
      (element) => (element as HTMLElement & { __marker?: boolean }).__marker,
    ),
  ).toBe(true);
});

test("renders a shell-owned header for the triggers when there is no header content", async ({
  page,
}) => {
  await gotoWith(page, "/", { header: "0" });

  await expect(page.locator(".mt-app__header")).toBeVisible();
  await expect(page.locator(".mt-app__header")).not.toContainText(
    "Meteor playground",
  );
  await expect(trigger(page, "start")).toBeVisible();
  await expect(trigger(page, "end")).toBeVisible();

  await gotoWith(page, "/", { header: "0", start: "0", end: "0" });
  await expect(page.locator(".mt-app__header")).toHaveCount(0);
});

test("removing a sidebar removes its trigger and closes its drawer", async ({
  page,
}) => {
  await gotoWith(page, "/settings");
  await openDrawer(page, "end");
  await page.getByRole("button", { name: "Close Details" }).click();
  await expect(drawer(page, "end")).toBeHidden();

  await page.getByLabel("End sidebar").click();

  await expect(trigger(page, "end")).toHaveCount(0);
  await expect(drawer(page, "end")).toHaveCount(0);
  await expect(trigger(page, "start")).toBeVisible();
});

test("keeps the content scroll position while a drawer is open", async ({
  page,
}) => {
  await gotoWith(page, "/page-two");
  const main = page.getByRole("main");
  await main.evaluate((element) => (element.scrollTop = 600));
  expect(await main.evaluate((element) => element.scrollTop)).toBe(600);

  await openDrawer(page, "start");
  await page.mouse.move(380, 500);
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(200);

  expect(await main.evaluate((element) => element.scrollTop)).toBe(600);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  await backdrop(page).click({ position: { x: 380, y: 400 } });
  await expect(drawer(page, "start")).toBeHidden();
  expect(await main.evaluate((element) => element.scrollTop)).toBe(600);
});
