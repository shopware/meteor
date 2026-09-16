import path from "node:path";
import { type Bump } from "./changeset-file.js";
import { generateChangeset } from "./generate-changeset.js";
import { ICON_CHANGE_KINDS } from "./icon-changes.js";

const PACKAGE_NAME = "@shopware-ag/meteor-icon-kit";

// Every icon release since v5.6.0 has been a minor, whether icons were added or
// only modified.
const BUMP: Bump = "minor";

const { changes, repositoryRoot, changesetPath } = generateChangeset({
  packageName: PACKAGE_NAME,
  bump: BUMP,
  iconDirectory: path.resolve(import.meta.dirname, "../../icons"),
});

if (!changesetPath) {
  console.log("No icon changes detected — skipping changeset.");
  process.exit(0);
}

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
