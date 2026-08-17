import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ChangesetFile, type Bump } from "./changeset-file.js";
import {
  countIconChanges,
  ICON_CHANGE_KINDS,
  parseIconChanges,
} from "./icon-changes.js";
import { md5 } from "../utils.js";

const PACKAGE_NAME = "@shopware-ag/meteor-icon-kit";

// Every icon release since v5.6.0 has been a minor, whether icons were added or
// only modified.
const BUMP: Bump = "minor";

function git(args: string[], cwd: string): string {
  return execFileSync("git", args, { cwd, encoding: "utf-8" });
}

const iconDirectory = path.resolve(import.meta.dirname, "../../icons");
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
  console.log("No icon changes detected — skipping changeset.");
  process.exit(0);
}

const changeset = new ChangesetFile(PACKAGE_NAME, BUMP, changes);

// Derive the filename from the changes themselves so re-running the sync on an
// unchanged icon set updates the existing changeset instead of piling up
// near-duplicates.
const changesetPath = path.join(
  repositoryRoot,
  ".changeset",
  `update-icons-${md5(changes).slice(0, 8)}.md`
);

fs.writeFileSync(changesetPath, changeset.toString());

for (const kind of ICON_CHANGE_KINDS) {
  if (changes[kind].length > 0) {
    console.log(`${kind}: ${changes[kind].join(", ")}`);
  }
}

if (changes.removed.length > 0) {
  console.warn(
    "Icons were removed, which is a breaking change for consumers. " +
      "Edit the changeset by hand if this needs a major bump."
  );
}

console.log(
  `Wrote ${path.relative(repositoryRoot, changesetPath)} (${BUMP} bump).`
);
