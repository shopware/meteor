import { expect, test } from "vitest";
import { countIconChanges, parseIconChanges } from "./icon-changes.js";

const PREFIX = "packages/icon-kit/icons/";

/** Builds the NUL-separated records `git status -z` emits. */
function porcelain(...records: string[]): string {
  return records.map((record) => `${record}\0`).join("");
}

test("returns nothing for a clean worktree", () => {
  // ACT
  const result = parseIconChanges("", PREFIX);

  // ASSERT
  expect(result).toEqual({ added: [], modified: [], removed: [] });
  expect(countIconChanges(result)).toBe(0);
});

test("buckets untracked, modified and deleted icons", () => {
  // ARRANGE
  const status = porcelain(
    "?? packages/icon-kit/icons/regular/panel-left.svg",
    " M packages/icon-kit/icons/regular/cog.svg",
    " D packages/icon-kit/icons/solid/legacy.svg"
  );

  // ACT
  const result = parseIconChanges(status, PREFIX);

  // ASSERT
  expect(result).toEqual({
    added: ["regular-panel-left"],
    modified: ["regular-cog"],
    removed: ["solid-legacy"],
  });
});

test("names icons the way their CSS class is named", () => {
  // ARRANGE
  const status = porcelain(
    "?? packages/icon-kit/icons/solid/shopware-copilot.svg",
    "?? packages/icon-kit/icons/regular/nested/deeply.svg"
  );

  // ACT
  const result = parseIconChanges(status, PREFIX);

  // ASSERT
  expect(result.added).toEqual([
    "regular-nested-deeply",
    "solid-shopware-copilot",
  ]);
});

test("ignores generated artifacts that are not icons", () => {
  // ARRANGE
  const status = porcelain(
    " M packages/icon-kit/icons/meta.json",
    " M packages/icon-kit/icons/meteor-icon-kit.scss",
    " D packages/icon-kit/icons/meteor-icon-kit-06d5d8be.css",
    "?? packages/icon-kit/icons/meteor-icon-kit-a1b2c3d4.css",
    " M packages/icon-kit/src/index.ts"
  );

  // ACT
  const result = parseIconChanges(status, PREFIX);

  // ASSERT
  expect(result).toEqual({ added: [], modified: [], removed: [] });
});

test("treats staged changes the same as worktree changes", () => {
  // ARRANGE
  const status = porcelain(
    "A  packages/icon-kit/icons/regular/added.svg",
    "M  packages/icon-kit/icons/regular/staged.svg",
    "MM packages/icon-kit/icons/regular/staged-and-dirty.svg",
    "D  packages/icon-kit/icons/regular/gone.svg",
    " T packages/icon-kit/icons/regular/typechange.svg"
  );

  // ACT
  const result = parseIconChanges(status, PREFIX);

  // ASSERT
  expect(result).toEqual({
    added: ["regular-added"],
    modified: [
      "regular-staged",
      "regular-staged-and-dirty",
      "regular-typechange",
    ],
    removed: ["regular-gone"],
  });
});

test("sorts icon names alphabetically", () => {
  // ARRANGE
  const status = porcelain(
    "?? packages/icon-kit/icons/solid/panel-top.svg",
    "?? packages/icon-kit/icons/regular/panel-top.svg",
    "?? packages/icon-kit/icons/regular/panel-bottom.svg"
  );

  // ACT
  const result = parseIconChanges(status, PREFIX);

  // ASSERT
  expect(result.added).toEqual([
    "regular-panel-bottom",
    "regular-panel-top",
    "solid-panel-top",
  ]);
});

test("reports each icon once even when it shows up twice", () => {
  // ARRANGE
  const status = porcelain(
    " M packages/icon-kit/icons/regular/cog.svg",
    " M packages/icon-kit/icons/regular/cog.svg"
  );

  // ACT
  const result = parseIconChanges(status, PREFIX);

  // ASSERT
  expect(result.modified).toEqual(["regular-cog"]);
});

test("refuses to guess at rename records", () => {
  // ARRANGE
  const status = porcelain(
    "R  packages/icon-kit/icons/regular/new.svg",
    "packages/icon-kit/icons/regular/old.svg"
  );

  // ACT & ASSERT
  expect(() => parseIconChanges(status, PREFIX)).toThrowError(/--no-renames/);
});

test("counts every change", () => {
  // ARRANGE
  const changes = {
    added: ["a", "b"],
    modified: ["c"],
    removed: [],
  };

  // ACT & ASSERT
  expect(countIconChanges(changes)).toBe(3);
});
