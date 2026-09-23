import { expect, test } from "@playwright/test";
import { gotoWith, shell } from "../fixtures";

async function rect(locator: ReturnType<typeof shell>) {
  return locator.evaluate((element) => {
    const { top, right, bottom, left } = element.getBoundingClientRect();
    return { top, right, bottom, left };
  });
}

test("keeps the content panel 8px away from sidebars and shell edge, flush with the header", async ({
  page,
}) => {
  await gotoWith(page, "/");

  const app = await rect(shell(page));
  const header = await rect(page.locator(".mt-app__header"));
  const main = await rect(page.getByRole("main"));
  const start = await rect(
    page.getByRole("complementary", { name: "Navigation" }),
  );
  const end = await rect(page.getByRole("complementary", { name: "Details" }));

  expect(main.top - header.bottom).toBeCloseTo(0, 0);
  expect(main.left - start.right).toBeCloseTo(8, 0);
  expect(end.left - main.right).toBeCloseTo(8, 0);
  expect(app.bottom - main.bottom).toBeCloseTo(8, 0);
  expect(start.left - app.left).toBeCloseTo(8, 0);
  expect(app.right - end.right).toBeCloseTo(8, 0);
  expect(start.top - header.bottom).toBeCloseTo(0, 0);
  expect(app.top).toBe(0);
  expect(app.bottom).toBeCloseTo(page.viewportSize()!.height, 0);
  expect(header.bottom - header.top).toBeCloseTo(64, 0);
});

test("renders no empty regions and keeps the spacing without header and sidebars", async ({
  page,
}) => {
  await gotoWith(page, "/", { header: "0", start: "0", end: "0" });

  await expect(page.locator(".mt-app__header")).toHaveCount(0);
  await expect(page.getByRole("complementary")).toHaveCount(0);

  const app = await rect(shell(page));
  const main = await rect(page.getByRole("main"));

  expect(main.top - app.top).toBeCloseTo(8, 0);
  expect(main.left - app.left).toBeCloseTo(8, 0);
  expect(app.right - main.right).toBeCloseTo(8, 0);
  expect(app.bottom - main.bottom).toBeCloseTo(8, 0);
});

test("the content panel scrolls instead of the document", async ({ page }) => {
  await gotoWith(page, "/page-two");

  const main = page.getByRole("main");
  await main.evaluate((element) => (element.scrollTop = 400));

  expect(await main.evaluate((element) => element.scrollTop)).toBe(400);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(
    page.viewportSize()!.height,
  );
});

test("the document never scrolls while the shell is mounted", async ({
  page,
}) => {
  await gotoWith(page, "/settings");

  await page.mouse.move(700, 500);
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(200);

  const document = await page.evaluate(() => ({
    scrollY: window.scrollY,
    scrollHeight: window.document.documentElement.scrollHeight,
    overflow: getComputedStyle(window.document.documentElement).overflow,
  }));

  expect(document.scrollY).toBe(0);
  expect(document.scrollHeight).toBe(page.viewportSize()!.height);
  expect(document.overflow).toBe("hidden");
});

test("exactly one navigation link is active", async ({ page }) => {
  await gotoWith(page, "/page-two");

  const active = page.locator(".router-link-exact-active");
  await expect(active).toHaveCount(1);
  await expect(active).toHaveText("Page two");
});
