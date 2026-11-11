import {
  ICON_CHANGE_KINDS,
  type IconChangeKind,
  type IconChanges,
} from "./icon-changes.js";

export type Bump = "major" | "minor" | "patch";

const HEADINGS: Record<IconChangeKind, { singular: string; plural: string }> = {
  added: { singular: "Added icon:", plural: "Added multiple icons:" },
  modified: { singular: "Modified icon:", plural: "Modified icons:" },
  removed: { singular: "Removed icon:", plural: "Removed icons:" },
};

/**
 * A changeset for the icon kit, rendered in the format the icon changelog has
 * used since v5.6.0: a bump for a single package, followed by one section per
 * kind of change listing the affected icon names as inline code.
 */
export class ChangesetFile {
  constructor(
    private readonly packageName: string,
    private readonly bump: Bump,
    private readonly changes: IconChanges
  ) {}

  toString(): string {
    const frontmatter = `---\n"${this.packageName}": ${this.bump}\n---`;

    const sections = ICON_CHANGE_KINDS.flatMap((kind) => {
      const icons = this.changes[kind];
      if (icons.length === 0) {
        return [];
      }

      const heading =
        icons.length === 1 ? HEADINGS[kind].singular : HEADINGS[kind].plural;

      return [[heading, ...icons.map((icon) => `\`${icon}\``)].join("\n")];
    });

    return `${[frontmatter, ...sections].join("\n\n")}\n`;
  }
}
