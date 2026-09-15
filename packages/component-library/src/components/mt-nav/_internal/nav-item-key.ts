import type { NavItem } from "../mt-nav.types";

/**
 * Identity of an item: its id, with the path as fallback. Branches are keyed by it, so items
 * without either share the key undefined and are compared by reference instead.
 */
export function navItemKey(item: Pick<NavItem, "id" | "path">): string | undefined {
  return item.id ?? item.path;
}
