import { test, expect, type Page } from "@playwright/test";

/**
 * The full standalone chain: the app's vue-i18n instance drives BOTH the app's own
 * texts and Meteor's components through createVueI18nAdapter. English and German come
 * from Meteor's bundled snippets; French is supplied by the app's own catalog.
 */

async function switchLanguage(page: Page, label: string) {
  await page.getByTestId("language-select").click();
  await page.getByText(label, { exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  // Surface in-page failures in the test output — a blank page is undebuggable from CI logs.
  page.on("pageerror", (error) => console.log("[page error]", error.message));
  page.on("console", (message) => {
    if (message.type() === "error")
      console.log("[page console.error]", message.text());
  });
  await page.goto("/");
});

test("renders Meteor's bundled English by default", async ({ page }) => {
  await expect(page.getByText("Standalone Meteor example")).toBeVisible();
  await expect(page.getByText("1-25 of 213")).toBeVisible();
  await expect(page.getByText("First page")).toBeVisible();
});

test("switching to German uses Meteor's bundled German snippets", async ({
  page,
}) => {
  await switchLanguage(page, "Deutsch");

  await expect(page.getByText("Eigenständiges Meteor-Beispiel")).toBeVisible();
  await expect(page.getByText("1-25 von 213")).toBeVisible();
  await expect(page.getByText("Erste Seite")).toBeVisible();
});

test("switching to French uses the app-supplied Meteor translations", async ({
  page,
}) => {
  await switchLanguage(page, "Français");

  // The app's own text and Meteor's snippets flip together — one catalog drives both.
  await expect(page.getByText("Exemple Meteor autonome")).toBeVisible();
  await expect(page.getByText("1-25 sur 213")).toBeVisible();
  await expect(page.getByText("Première page")).toBeVisible();
});
