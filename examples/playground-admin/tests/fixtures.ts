import type { Locator, Page } from "@playwright/test";

/** Opens a route with the given shell settings (see src/store/settings.ts). */
export async function gotoWith(
  page: Page,
  path = "/",
  query: Record<string, string> = {},
) {
  const params = new URLSearchParams(query).toString();
  await page.goto(params ? `${path}?${params}` : path);
  await page.locator(".mt-app").waitFor();
}

export function shell(page: Page): Locator {
  return page.locator(".mt-app");
}

export function backdrop(page: Page): Locator {
  return page.getByTestId("mt-app-backdrop");
}

export function trigger(page: Page, side: "start" | "end"): Locator {
  return page.getByRole("button", {
    name: side === "start" ? "Open Navigation" : "Open Details",
    exact: true,
  });
}

/** A closed drawer is hidden and has no accessible name, so it is located by its attributes. */
export function drawer(page: Page, side: "start" | "end"): Locator {
  return page.locator(
    `[role="dialog"][aria-label="${side === "start" ? "Navigation" : "Details"}"]`,
  );
}

export async function openDrawer(page: Page, side: "start" | "end") {
  await trigger(page, side).click();
  await drawer(page, side).waitFor({ state: "visible" });
}

export function isMobile(page: Page) {
  return page.locator(".mt-app[data-layout='mobile']");
}
