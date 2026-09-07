import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ChangesetFile, type Bump } from "./changeset-file.js";
import {
  countIconChanges,
  parseIconChanges,
  type IconChanges,
} from "./icon-changes.js";
import { md5 } from "../utils.js";

export type GenerateChangesetResult = {
  changes: IconChanges;
  repositoryRoot: string;
  /**
   * Absolute path of the changeset that was written, or `undefined` when no
   * icons changed and therefore nothing was written.
   */
  changesetPath: string | undefined;
};

function git(args: string[], cwd: string): string {
  return execFileSync("git", args, { cwd, encoding: "utf-8" });
}

/**
 * Writes a changeset describing how `iconDirectory` differs from what is
 * committed, i.e. what the Figma sync just changed.
 */
export function generateChangeset(options: {
  packageName: string;
  bump: Bump;
  iconDirectory: string;
}): GenerateChangesetResult {
  const { packageName, bump, iconDirectory } = options;

  const repositoryRoot = git(
    ["rev-parse", "--show-toplevel"],
    iconDirectory
  ).trim();

  // git reports paths relative to the repository root, always with forward
  // slashes, so build the prefix we match against the same way.
  const iconsPrefix = `${path
    .relative(repositoryRoot, iconDirectory)
    .split(path.sep)
    .join("/")}/`;

  const changes = parseIconChanges(
    git(
      [
        "status",
        "--porcelain",
        "-z",
        "--untracked-files=all",
        "--no-renames",
        "--",
        iconDirectory,
      ],
      repositoryRoot
    ),
    iconsPrefix
  );

  if (countIconChanges(changes) === 0) {
    return { changes, repositoryRoot, changesetPath: undefined };
  }

  // Derive the filename from the changes themselves so re-running the sync on
  // an unchanged icon set updates the existing changeset instead of piling up
  // near-duplicates.
  const changesetPath = path.join(
    repositoryRoot,
    ".changeset",
    `update-icons-${md5(changes).slice(0, 8)}.md`
  );

  fs.writeFileSync(
    changesetPath,
    new ChangesetFile(packageName, bump, changes).toString()
  );

  return { changes, repositoryRoot, changesetPath };
}
