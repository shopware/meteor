// Shared filter query for the docs sidebar, so the input (DocsAsideLeftTop) and
// the navigation (DocsAsideLeftBody) can live in separate aside slots.
export function useSidebarFilter() {
  return useState<string>("docs-sidebar-filter", () => "");
}
