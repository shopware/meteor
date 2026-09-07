import type { MenuEntry, MenuTreeEntry } from "../mt-admin-menu.types";

/**
 * Identity of an entry: its id, with the path as fallback. Must match how the menu keys its
 * branches, otherwise collapsing one id-less branch would drop every other id-less entry.
 */
export function menuEntryKey(entry: Pick<MenuEntry, "id" | "path">): string | undefined {
  return entry.id ?? entry.path;
}

const DEFAULT_POSITION = 1;

function byPosition(first: MenuEntry, second: MenuEntry): number {
  return (first.position ?? DEFAULT_POSITION) - (second.position ?? DEFAULT_POSITION);
}

/**
 * Nests a flat list of entries by their `parent` reference and sorts siblings by `position`.
 * Entries whose parent is not part of the list are dropped.
 */
export function buildMenuTree(entries: MenuEntry[]): MenuTreeEntry[] {
  function childrenOf(parentKey: string | undefined, level: number): MenuTreeEntry[] {
    return entries
      .filter((entry) => (parentKey === undefined ? !entry.parent : entry.parent === parentKey))
      .sort(byPosition)
      .map((entry) => {
        const key = menuEntryKey(entry);

        return {
          ...entry,
          level,
          children: key === undefined ? [] : childrenOf(key, level + 1),
        };
      });
  }

  return childrenOf(undefined, 1);
}
