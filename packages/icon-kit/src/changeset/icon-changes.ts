export const ICON_CHANGE_KINDS = ["added", "modified", "removed"] as const;

export type IconChangeKind = (typeof ICON_CHANGE_KINDS)[number];

export type IconChanges = Record<IconChangeKind, string[]>;

const SVG_EXTENSION = ".svg";

/**
 * Turns a repository-relative path to an icon into the name the icon is
 * published under, e.g. `packages/icon-kit/icons/regular/cog.svg` becomes
 * `regular-cog`.
 *
 * This mirrors how `src/index.ts` derives the CSS class name for an icon, so
 * the names in a changeset match the names consumers actually use.
 */
function toIconName(path: string, iconsPrefix: string): string | undefined {
  if (!path.startsWith(iconsPrefix) || !path.endsWith(SVG_EXTENSION)) {
    return undefined;
  }

  return path
    .slice(iconsPrefix.length, -SVG_EXTENSION.length)
    .replaceAll("/", "-");
}

/**
 * Parses the output of
 * `git status --porcelain -z --untracked-files=all --no-renames`
 * into the set of added, modified and removed icons.
 *
 * `--no-renames` is required: with rename detection on, an entry carries a
 * second NUL-separated path whose position in the record is ambiguous between
 * git versions, so we refuse to guess and throw instead.
 *
 * @param porcelain Raw, NUL-separated `git status` output.
 * @param iconsPrefix Repository-relative path of the icons directory,
 * including a trailing slash, e.g. `packages/icon-kit/icons/`.
 */
export function parseIconChanges(
  porcelain: string,
  iconsPrefix: string
): IconChanges {
  const added = new Set<string>();
  const modified = new Set<string>();
  const removed = new Set<string>();

  for (const record of porcelain.split("\0")) {
    // A trailing NUL leaves an empty record behind.
    if (record === "") {
      continue;
    }

    const status = record.slice(0, 2);
    const path = record.slice(3);

    if (status.includes("R") || status.includes("C")) {
      throw new Error(
        `Unexpected rename/copy status "${status}" for "${path}". Run git status with --no-renames.`
      );
    }

    const iconName = toIconName(path, iconsPrefix);
    if (!iconName) {
      // Generated artifacts such as meta.json or the stylesheets — those are
      // not icons and have no place in the changeset.
      continue;
    }

    // The index column (first character) and the worktree column (second) can
    // disagree; a single icon only ever needs one bucket, so the most
    // significant state wins.
    if (status === "??" || status.includes("A")) {
      added.add(iconName);
    } else if (status.includes("D")) {
      removed.add(iconName);
    } else if (status.includes("M") || status.includes("T")) {
      modified.add(iconName);
    }
  }

  const sorted = (names: Set<string>) =>
    Array.from(names).sort((a, b) => a.localeCompare(b));

  return {
    added: sorted(added),
    modified: sorted(modified),
    removed: sorted(removed),
  };
}

export function countIconChanges(changes: IconChanges): number {
  return ICON_CHANGE_KINDS.reduce(
    (total, kind) => total + changes[kind].length,
    0
  );
}
