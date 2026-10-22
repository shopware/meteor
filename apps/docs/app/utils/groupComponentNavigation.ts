import type { ContentNavigationItem } from "@nuxt/content";

// The sections of the components sidebar, in the order they show, and the
// pages in each, by slug. The sidebar lists the pages alphabetically.
const COMPONENT_SECTIONS: Record<string, string[]> = {
  Layout: ["app", "container", "content-layout", "page"],
  Content: [
    "action-menu",
    "avatar",
    "button",
    "card",
    "chart",
    "collapsible",
    "content-header",
    "data-table",
    "divider",
    "empty-state",
    "entity-data-table",
    "help-text",
    "icon",
    "text",
    "user",
  ],
  Navigation: ["breadcrumb", "link", "nav", "pagination", "tabs"],
  Forms: [
    "checkbox",
    "colorpicker",
    "datepicker",
    "email-field",
    "entity-select",
    "number-field",
    "password-field",
    "radio-group",
    "search",
    "select",
    "slider",
    "switch",
    "text-editor",
    "text-field",
    "textarea",
    "theme-select",
    "unit-field",
    "url-field",
  ],
  Status: [
    "badge",
    "banner",
    "loader",
    "progress-bar",
    "promo-badge",
    "skeleton-bar",
    "snackbar",
    "status-dot",
    "toast",
  ],
  Overlays: ["floating-ui", "modal", "popover", "tooltip"],
};

/**
 * Groups the component pages into the sections above. Other navigation passes
 * through unchanged. A component page missing from the sections shows after
 * them, so a new page stays visible until it gets its place.
 */
export function groupComponentNavigation(
  items: ContentNavigationItem[],
): ContentNavigationItem[] {
  const bySlug = new Map(
    items
      .filter((item) => item.path.startsWith("/components/"))
      .map((item) => [item.path.split("/").pop()!, item]),
  );
  if (bySlug.size === 0) return items;

  const sections = Object.entries(COMPONENT_SECTIONS)
    .map(([title, slugs]) => ({
      title,
      path: `#${title}`,
      stem: title,
      page: false as const,
      children: slugs
        .flatMap((slug) => bySlug.get(slug) ?? [])
        .sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .filter((section) => section.children.length > 0);

  const placed = new Set(Object.values(COMPONENT_SECTIONS).flat());
  const rest = items.filter((item) => !placed.has(item.path.split("/").pop()!));

  return [...sections, ...rest];
}
