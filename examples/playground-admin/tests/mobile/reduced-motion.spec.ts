import { expect, test } from "@playwright/test";
import { drawer, gotoWith, trigger } from "../fixtures";

test("skips the slide animation when reduced motion is preferred", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gotoWith(page, "/");

  await trigger(page, "start").click();

  const state = await drawer(page, "start").evaluate((element) => ({
    transitionDuration: getComputedStyle(element).transitionDuration,
    left: element.getBoundingClientRect().left,
  }));

  expect(state.transitionDuration).toBe("0s");
  expect(state.left).toBeCloseTo(0, 0);
});
