import { expect, test } from "@playwright/test";
import { gotoWith, shell, trigger } from "../fixtures";

test("switches layouts exactly at the breakpoint", async ({ page }) => {
  await gotoWith(page, "/");

  await page.setViewportSize({ width: 1281, height: 900 });
  await expect(shell(page)).toHaveAttribute("data-layout", "desktop");

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(shell(page)).toHaveAttribute("data-layout", "desktop");

  await page.setViewportSize({ width: 1279, height: 900 });
  await expect(shell(page)).toHaveAttribute("data-layout", "mobile");
  await expect(trigger(page, "start")).toBeVisible();
  await expect(trigger(page, "end")).toBeVisible();
});

test("a breakpoint of zero disables the mobile layout", async ({ page }) => {
  await gotoWith(page, "/", { breakpoint: "0" });

  await page.setViewportSize({ width: 500, height: 900 });

  await expect(shell(page)).toHaveAttribute("data-layout", "desktop");
  await expect(trigger(page, "start")).toHaveCount(0);
});

test("a huge breakpoint forces the mobile layout", async ({ page }) => {
  await gotoWith(page, "/", { breakpoint: "99999" });

  await expect(shell(page)).toHaveAttribute("data-layout", "mobile");
  await expect(trigger(page, "start")).toBeVisible();
});
