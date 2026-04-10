import { expect, test, type Page } from "@playwright/test";

async function appendToEditor(page: Page, marker: string) {
  const editor = page.getByTestId("lesson-editor").locator(".cm-content");

  await editor.click();
  await page.keyboard.press("End");
  await page.keyboard.type(`\n${marker}`);
}

test("proves the desktop workspace editing, compare, restore, and refresh flows", async ({
  page,
}) => {
  const restoredMarker = "persisted after refresh";

  await page.goto("/");
  await expect(page.getByTestId("workspace-shell")).toBeVisible();

  await appendToEditor(page, "desktop draft that will be cleared");
  await expect(page.getByTestId("lesson-editor").locator(".cm-content")).toContainText(
    "desktop draft that will be cleared"
  );

  await page.getByTestId("show-solution-button").click();
  await expect(page.getByTestId("solution-panel")).toBeVisible();

  await page.getByTestId("hide-solution-button").click();
  await expect(page.getByTestId("solution-panel")).toBeHidden();

  await page.getByTestId("restore-starter-button").click();
  await expect(page.getByTestId("restore-confirm-dialog")).toBeVisible();
  await page.getByTestId("restore-confirm-dialog").getByRole("button", { name: "Keep draft" }).click();
  await expect(page.getByTestId("lesson-editor").locator(".cm-content")).toContainText(
    "desktop draft that will be cleared"
  );

  await page.getByTestId("restore-starter-button").click();
  await page
    .getByTestId("restore-confirm-dialog")
    .getByRole("button", { name: "Restore starter" })
    .click();
  await expect(page.getByTestId("lesson-editor").locator(".cm-content")).not.toContainText(
    "desktop draft that will be cleared"
  );

  await page.getByTestId("lesson-nav-row").nth(1).click();
  await appendToEditor(page, restoredMarker);
  await page.waitForTimeout(900);
  await page.reload();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Understand hidden locations");
  await expect(page.getByTestId("lesson-editor").locator(".cm-content")).toContainText(
    restoredMarker
  );
});

test("keeps lessons, guide, and workspace reachable on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto("/");

  await expect(page.getByTestId("mobile-shell-tab")).toHaveCount(3);

  await page.getByRole("button", { name: "Lessons" }).click();
  await expect(page.getByTestId("lesson-tree")).toBeVisible();

  await page.getByRole("button", { name: "Guide" }).click();
  await expect(page.getByTestId("lesson-guide")).toBeVisible();

  await page.getByRole("button", { name: "Workspace" }).click();
  await expect(page.getByTestId("lesson-editor")).toBeVisible();
  await expect(page.getByTestId("lesson-preview")).toBeVisible();

  await appendToEditor(page, "mobile draft marker");
  await page.getByRole("button", { name: "Lessons" }).click();
  await page.getByTestId("lesson-nav-row").nth(1).click();

  await expect(page.getByTestId("lesson-switch-confirm-dialog")).toBeVisible();
  await expect(page.getByTestId("lesson-switch-confirm-dialog")).toContainText(
    "Your draft stays saved on this device. Open the next lesson or keep editing here?"
  );
});
