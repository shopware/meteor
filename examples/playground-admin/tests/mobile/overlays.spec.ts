import { expect, test } from "@playwright/test";
import { drawer, gotoWith, openDrawer, trigger } from "../fixtures";

test("a menu inside the drawer is usable and keeps the drawer open", async ({
  page,
}) => {
  await gotoWith(page, "/");
  await openDrawer(page, "start");

  await drawer(page, "start").getByRole("button", { name: "Actions" }).click();
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();

  const item = menu.getByRole("menuitem", { name: "Copy link" });
  const onTop = await item.evaluate((element) => {
    const { left, top, width, height } = element.getBoundingClientRect();
    return (
      document
        .elementFromPoint(left + width / 2, top + height / 2)
        ?.closest("[role=menu]") !== null
    );
  });
  expect(onTop).toBe(true);

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Escape");

  await expect(menu).toBeHidden();
  await expect(drawer(page, "start")).toBeVisible();
  await expect(trigger(page, "start")).toHaveAttribute("aria-expanded", "true");
});

test("a modal stacks above the shell and Escape returns the focus to its trigger", async ({
  page,
}) => {
  await gotoWith(page, "/settings");

  await page.getByRole("button", { name: "Open modal" }).click();
  const modal = page.getByRole("dialog", { name: "Modal" });
  await expect(modal).toBeVisible();
  await expect(modal).toBeFocused();

  const onTop = await modal.evaluate((element) => {
    const { left, top, width, height } = element.getBoundingClientRect();
    return (
      document
        .elementFromPoint(left + width / 2, top + height / 2)
        ?.closest("[role=dialog]") === element
    );
  });
  expect(onTop).toBe(true);

  await page.keyboard.press("Escape");

  await expect(modal).toBeHidden();
  await expect(page.getByRole("button", { name: "Open modal" })).toBeFocused();

  await openDrawer(page, "start");
  await expect(drawer(page, "start")).toBeVisible();
});
