import { expect, test } from "vitest";
import { ChangesetFile } from "./changeset-file.js";

const PACKAGE_NAME = "@shopware-ag/meteor-icon-kit";

test("renders added and modified icons", () => {
  // ARRANGE
  const subject = new ChangesetFile(PACKAGE_NAME, "minor", {
    added: [
      "regular-panel-bottom",
      "regular-panel-left",
      "regular-panel-right",
      "regular-panel-top",
      "regular-shopware-copilot",
      "solid-panel-bottom",
      "solid-panel-left",
      "solid-panel-right",
      "solid-panel-top",
      "solid-shopware-copilot",
    ],
    modified: ["regular-cog", "solid-cog"],
    removed: [],
  });

  // ACT
  const result = subject.toString();

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    "---
    "@shopware-ag/meteor-icon-kit": minor
    ---

    Added multiple icons:
    \`regular-panel-bottom\`
    \`regular-panel-left\`
    \`regular-panel-right\`
    \`regular-panel-top\`
    \`regular-shopware-copilot\`
    \`solid-panel-bottom\`
    \`solid-panel-left\`
    \`solid-panel-right\`
    \`solid-panel-top\`
    \`solid-shopware-copilot\`

    Modified icons:
    \`regular-cog\`
    \`solid-cog\`
    "
  `);
});

test("uses singular headings for a single icon", () => {
  // ARRANGE
  const subject = new ChangesetFile(PACKAGE_NAME, "minor", {
    added: ["regular-trust"],
    modified: [],
    removed: ["solid-legacy"],
  });

  // ACT
  const result = subject.toString();

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    "---
    "@shopware-ag/meteor-icon-kit": minor
    ---

    Added icon:
    \`regular-trust\`

    Removed icon:
    \`solid-legacy\`
    "
  `);
});

test("omits sections without changes", () => {
  // ARRANGE
  const subject = new ChangesetFile(PACKAGE_NAME, "minor", {
    added: [],
    modified: ["regular-cog", "solid-cog"],
    removed: [],
  });

  // ACT
  const result = subject.toString();

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    "---
    "@shopware-ag/meteor-icon-kit": minor
    ---

    Modified icons:
    \`regular-cog\`
    \`solid-cog\`
    "
  `);
});

test("renders removed icons", () => {
  // ARRANGE
  const subject = new ChangesetFile(PACKAGE_NAME, "minor", {
    added: [],
    modified: [],
    removed: ["regular-cog", "solid-cog"],
  });

  // ACT
  const result = subject.toString();

  // ASSERT
  expect(result).toMatchInlineSnapshot(`
    "---
    "@shopware-ag/meteor-icon-kit": minor
    ---

    Removed icons:
    \`regular-cog\`
    \`solid-cog\`
    "
  `);
});
