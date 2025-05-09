import { test, expect } from "../fixtures/test";

test("adds a card to the dashboard", async ({ page }) => {
  await page.goto("/admin");

  // sign in
  await page.getByRole("textbox", { name: "Username" }).fill("admin");
  await page.getByRole("textbox", { name: "Password" }).fill("shopware");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Meteor Admin SDK",
    })
  ).toBeVisible();

  await expect(page.getByText("Welcome to the example")).toBeVisible();

  await expect(
    page
      .getByRole("article", { name: "Meteor Admin SDK" })
      .frameLocator(
        'iframe[title="http\\:\\/\\/localhost\\:8888\\/index\\.html"]'
      )
      .getByText("This App is built for")
  ).toBeVisible();

  await expect(
    page
      .getByRole("article", { name: "Meteor Admin SDK" })
      .frameLocator(
        'iframe[title="http\\:\\/\\/localhost\\:8888\\/index\\.html"]'
      )
      .getByRole("button", {
        name: "Go to the example module",
      })
  ).toBeVisible();

  await page
    .getByRole("article", { name: "Meteor Admin SDK" })
    .frameLocator(
      'iframe[title="http\\:\\/\\/localhost\\:8888\\/index\\.html"]'
    )
    .getByRole("button", {
      name: "Go to the example module",
    })
    .click();

  await expect(
    page.getByRole("heading", { name: "Meteor Admin SDK example" })
  ).toBeVisible();
});
