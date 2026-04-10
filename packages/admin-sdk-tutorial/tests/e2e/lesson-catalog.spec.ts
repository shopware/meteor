import { expect, test } from "@playwright/test";

test("renders the lesson catalog from the normalized manifest tree", async ({ page }) => {
  await page.goto("/");

  const tutorialParts = page.getByTestId("tutorial-part");
  const lessonRows = page.getByTestId("lesson-list-item");
  const lessonTitles = lessonRows.locator("h4");
  const docsLinks = page.getByTestId("lesson-doc-link");

  await expect(tutorialParts).toHaveCount(1);
  await expect(lessonRows).toHaveCount(2);
  await expect(lessonTitles).toHaveText([
    "1. Dispatch your first notification",
    "1. Understand hidden locations",
  ]);
  await expect(docsLinks).toHaveCount(3);
  await expect(docsLinks.nth(0)).toHaveAttribute("href", "/guide/api-reference/notification");
  await expect(docsLinks.nth(1)).toHaveAttribute("href", "/guide/concepts/locations");
  await expect(docsLinks.nth(2)).toHaveAttribute("href", "/guide/concepts/positions");
});
