import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, expect, test } from "vitest";
import { generateChangeset } from "./generate-changeset.js";

const PACKAGE_NAME = "@shopware-ag/meteor-icon-kit";

const repositories: string[] = [];

afterEach(() => {
  while (repositories.length > 0) {
    fs.rmSync(repositories.pop()!, { recursive: true, force: true });
  }
});

function git(args: string[], cwd: string): void {
  execFileSync("git", args, { cwd, encoding: "utf-8" });
}

function writeIcon(iconDirectory: string, name: string, body = "<svg/>"): void {
  fs.writeFileSync(path.join(iconDirectory, `${name}.svg`), body);
}

/**
 * Creates a throwaway repository laid out like this one, with two committed
 * icons, so `generateChangeset` runs against real `git status` output.
 *
 * The temp path is realpath'd because macOS resolves `os.tmpdir()` through a
 * symlink, which would otherwise not match what `git rev-parse` reports.
 */
function createRepository(): { root: string; iconDirectory: string } {
  const root = fs.realpathSync(
    fs.mkdtempSync(path.join(os.tmpdir(), "icon-kit-changeset-"))
  );
  repositories.push(root);

  git(["init", "--quiet", "-b", "main"], root);
  // Local config only, so the test does not depend on — or care about — the
  // committer's global git setup (commit signing included).
  git(["config", "user.email", "test@example.com"], root);
  git(["config", "user.name", "Test"], root);
  git(["config", "commit.gpgsign", "false"], root);

  fs.mkdirSync(path.join(root, ".changeset"));
  fs.writeFileSync(path.join(root, ".changeset", "config.json"), "{}");

  const iconDirectory = path.join(root, "packages", "icon-kit", "icons");
  fs.mkdirSync(path.join(iconDirectory, "regular"), { recursive: true });
  fs.mkdirSync(path.join(iconDirectory, "solid"), { recursive: true });
  writeIcon(iconDirectory, "regular/cog");
  writeIcon(iconDirectory, "solid/cog");
  writeIcon(iconDirectory, "solid/legacy");
  fs.writeFileSync(path.join(iconDirectory, "meta.json"), "{}");

  git(["add", "--all"], root);
  git(["commit", "--quiet", "-m", "baseline"], root);

  return { root, iconDirectory };
}

function run(iconDirectory: string) {
  return generateChangeset({
    packageName: PACKAGE_NAME,
    bump: "minor",
    iconDirectory,
  });
}

test("writes a changeset for icons the sync added, changed and removed", () => {
  // ARRANGE
  const { root, iconDirectory } = createRepository();
  writeIcon(iconDirectory, "regular/panel-left");
  writeIcon(iconDirectory, "solid/panel-left");
  writeIcon(iconDirectory, "regular/cog", "<svg>changed</svg>");
  fs.rmSync(path.join(iconDirectory, "solid/legacy.svg"));

  // ACT
  const result = run(iconDirectory);

  // ASSERT
  expect(result.repositoryRoot).toBe(root);
  expect(result.changesetPath).toBeDefined();
  expect(fs.readFileSync(result.changesetPath!, "utf-8"))
    .toMatchInlineSnapshot(`
      "---
      "@shopware-ag/meteor-icon-kit": minor
      ---

      Added multiple icons:
      \`regular-panel-left\`
      \`solid-panel-left\`

      Modified icon:
      \`regular-cog\`

      Removed icon:
      \`solid-legacy\`
      "
    `);
});

test("writes the changeset into the repository's .changeset directory", () => {
  // ARRANGE
  const { root, iconDirectory } = createRepository();
  writeIcon(iconDirectory, "regular/panel-left");

  // ACT
  const result = run(iconDirectory);

  // ASSERT
  expect(path.dirname(result.changesetPath!)).toBe(
    path.join(root, ".changeset")
  );
  expect(path.basename(result.changesetPath!)).toMatch(
    /^update-icons-[0-9a-f]{8}\.md$/
  );
});

test("writes nothing when no icons changed", () => {
  // ARRANGE
  const { root, iconDirectory } = createRepository();

  // ACT
  const result = run(iconDirectory);

  // ASSERT
  expect(result.changesetPath).toBeUndefined();
  expect(result.changes).toEqual({ added: [], modified: [], removed: [] });
  expect(fs.readdirSync(path.join(root, ".changeset"))).toEqual([
    "config.json",
  ]);
});

test("ignores the generated artifacts the sync also rewrites", () => {
  // ARRANGE
  const { root, iconDirectory } = createRepository();
  fs.writeFileSync(path.join(iconDirectory, "meta.json"), '{"changed":true}');
  fs.writeFileSync(path.join(iconDirectory, "meteor-icon-kit.scss"), "// css");
  // The stylesheet carries a content hash, so every sync looks like a rename.
  fs.writeFileSync(path.join(iconDirectory, "meteor-icon-kit-abc123.css"), "");

  // ACT
  const result = run(iconDirectory);

  // ASSERT
  expect(result.changesetPath).toBeUndefined();
  expect(fs.readdirSync(path.join(root, ".changeset"))).toEqual([
    "config.json",
  ]);
});

test("reuses the same file when re-run on an unchanged icon set", () => {
  // ARRANGE
  const { root, iconDirectory } = createRepository();
  writeIcon(iconDirectory, "regular/panel-left");

  // ACT
  const first = run(iconDirectory);
  const second = run(iconDirectory);

  // ASSERT
  expect(second.changesetPath).toBe(first.changesetPath);
  expect(fs.readdirSync(path.join(root, ".changeset"))).toHaveLength(2);
});

test("writes a separate file when a later sync changes different icons", () => {
  // ARRANGE
  const { root, iconDirectory } = createRepository();
  writeIcon(iconDirectory, "regular/panel-left");

  // ACT
  const first = run(iconDirectory);
  writeIcon(iconDirectory, "regular/panel-right");
  const second = run(iconDirectory);

  // ASSERT
  expect(second.changesetPath).not.toBe(first.changesetPath);
  expect(fs.readdirSync(path.join(root, ".changeset"))).toHaveLength(3);
});

test("only reports icons, even when other files in the repository changed", () => {
  // ARRANGE
  const { iconDirectory } = createRepository();
  writeIcon(iconDirectory, "regular/panel-left");
  fs.writeFileSync(
    path.join(iconDirectory, "..", "package.json"),
    '{"name":"unrelated"}'
  );

  // ACT
  const result = run(iconDirectory);

  // ASSERT
  expect(result.changes).toEqual({
    added: ["regular-panel-left"],
    modified: [],
    removed: [],
  });
});
