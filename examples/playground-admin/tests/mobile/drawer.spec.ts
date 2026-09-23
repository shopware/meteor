import { expect, test } from "@playwright/test";
import {
  backdrop,
  drawer,
  gotoWith,
  openDrawer,
  shell,
  trigger,
} from "../fixtures";

test.beforeEach(async ({ page }) => {
  await gotoWith(page, "/");
  await expect(shell(page)).toHaveAttribute("data-layout", "mobile");
});

test("starts with closed, unreachable drawers", async ({ page }) => {
  await expect(trigger(page, "start")).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect(drawer(page, "start")).toBeHidden();
  await expect(drawer(page, "start")).toHaveAttribute("inert", "");
  await expect(trigger(page, "start")).toHaveAttribute(
    "aria-controls",
    (await drawer(page, "start").getAttribute("id")) ?? "",
  );
  await expect(backdrop(page)).toBeHidden();
  await expect(shell(page)).not.toHaveAttribute("data-drawer");
});

test("opens from the trigger, focuses the drawer and closes with the close button", async ({
  page,
}) => {
  await openDrawer(page, "start");

  await expect(trigger(page, "start")).toHaveAttribute("aria-expanded", "true");
  await expect(drawer(page, "start")).toBeFocused();
  await expect(drawer(page, "start")).toHaveAttribute("aria-modal", "true");
  await expect(page.getByRole("main")).toHaveAttribute("inert", "");
  await expect(page.locator(".mt-app__header")).toHaveAttribute("inert", "");
  await expect(backdrop(page)).toBeVisible();
  await expect(shell(page)).toHaveAttribute("data-drawer", "start");

  // the icon kit resolves in source mode: the close button renders an inline SVG
  await expect(
    page.getByRole("button", { name: "Close Navigation" }).locator("svg path"),
  ).not.toHaveCount(0);

  await page.getByRole("button", { name: "Close Navigation" }).click();

  await expect(drawer(page, "start")).toBeHidden();
  await expect(page.getByRole("main")).not.toHaveAttribute("inert");
  await expect(trigger(page, "start")).toBeFocused();
});

test("closes on Escape and returns the focus to the trigger", async ({
  page,
}) => {
  await openDrawer(page, "end");
  await expect(drawer(page, "end")).toBeFocused();

  await page.keyboard.press("Escape");

  await expect(drawer(page, "end")).toBeHidden();
  await expect(trigger(page, "end")).toBeFocused();
});

test("closes when the backdrop is clicked", async ({ page }) => {
  await openDrawer(page, "start");

  await backdrop(page).click({ position: { x: 380, y: 400 } });

  await expect(drawer(page, "start")).toBeHidden();
  await expect(shell(page)).not.toHaveAttribute("data-drawer");
});

test("wraps the keyboard focus inside the drawer", async ({ page }) => {
  await openDrawer(page, "start");

  await page.keyboard.press("Shift+Tab");
  await expect(
    drawer(page, "start").getByRole("button", { name: "Actions" }),
  ).toBeFocused();

  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close Navigation" }),
  ).toBeFocused();
});

test("the navigation drawer slides in from the left edge", async ({ page }) => {
  await openDrawer(page, "start");

  // the slide-in takes 200ms
  await expect
    .poll(() =>
      drawer(page, "start").evaluate(
        (element) => element.getBoundingClientRect().left,
      ),
    )
    .toBeCloseTo(0, 0);
});
