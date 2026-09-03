import { test, expect, type Page } from "@playwright/test";

// End-to-end coverage of the Meteor i18n integration in a real consumer app:
// createMeteorI18nPlugin + createVueI18nAdapter wiring, reactive locale switching,
// the locale fallback chain, and region-specific overrides.
//
// Setup (examples/nuxt-app):
//  - Host vue-i18n drives the locale; Meteor follows it via the adapter.
//  - The plugin registers ONE region-specific override: en-GB -> mt.pagination.infoText.
//  - <MtPagination> renders `infoText` (visible) and a `firstPage` label (not overridden).

const infoText = (page: Page) => page.getByTestId("mt-pagination-info-text");
const firstPageButton = (page: Page) =>
  page.getByTestId("mt-pagination-first-page-button");

test.beforeEach(async ({ page }) => {
  await page.goto("/?i18n=1");
  await expect(page.getByTestId("i18n-demo")).toBeVisible();
});

test("renders Meteor's bundled English snippets by default", async ({
  page,
}) => {
  await expect(infoText(page)).toHaveText("1-25 of 213");
  await expect(firstPageButton(page)).toContainText("First page");
});

test("switches to bundled German snippets when the host locale changes", async ({
  page,
}) => {
  await page.getByTestId("locale-de").click();

  await expect(infoText(page)).toHaveText("1-25 von 213");
  await expect(firstPageButton(page)).toContainText("Erste Seite");
});

test("region variants share the language default (en-US -> en)", async ({
  page,
}) => {
  await page.getByTestId("locale-en-us").click();

  await expect(infoText(page)).toHaveText("1-25 of 213");
  await expect(firstPageButton(page)).toContainText("First page");
});

test("a region-specific override applies to en-GB only", async ({ page }) => {
  await page.getByTestId("locale-en-gb").click();

  // infoText IS overridden for en-GB -> the custom snippet wins (and still interpolates).
  await expect(infoText(page)).toHaveText("GB override: 1-25 of 213");

  // firstPage is NOT overridden -> even at en-GB it falls back through the chain to bundled en.
  await expect(firstPageButton(page)).toContainText("First page");
});

test("the en-GB override does not leak to en-US or en", async ({ page }) => {
  await page.getByTestId("locale-en-gb").click();
  await expect(infoText(page)).toHaveText("GB override: 1-25 of 213");

  await page.getByTestId("locale-en-us").click();
  await expect(infoText(page)).toHaveText("1-25 of 213");

  await page.getByTestId("locale-en").click();
  await expect(infoText(page)).toHaveText("1-25 of 213");
});
