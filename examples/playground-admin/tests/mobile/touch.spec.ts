import { expect, test } from "@playwright/test";
import { backdrop, drawer, gotoWith, shell, trigger } from "../fixtures";

test("drawers open and close by tapping", async ({ page }) => {
  await gotoWith(page, "/");

  await trigger(page, "start").tap();
  await expect(drawer(page, "start")).toBeVisible();
  await expect(shell(page)).toHaveAttribute("data-drawer", "start");

  await backdrop(page).tap({ position: { x: 380, y: 400 } });
  await expect(drawer(page, "start")).toBeHidden();
  await expect(shell(page)).not.toHaveAttribute("data-drawer");
});
