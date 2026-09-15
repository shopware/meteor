import type { NavItem } from "../mt-nav.types";
import { navItemKey } from "./nav-item-key";

const MAX_NESTING_LEVEL = 3;

/**
 * Drops the children of items on the third level, which the navigation cannot render, and reports
 * every dropped item once.
 */
export function pruneDeepItems(items: NavItem[], level = 1): NavItem[] {
  return items.map((item) => {
    const children = item.children ?? [];

    if (level < MAX_NESTING_LEVEL) {
      return { ...item, children: pruneDeepItems(children, level + 1) };
    }

    children.forEach((child) => {
      console.error(
        `[mt-nav] The navigation item "${navItemKey(child)}" is nested on level 4 or higher. ` +
          "The navigation only supports up to three levels of nesting.",
      );
    });

    return { ...item, children: [] };
  });
}
