import type { ContentNavigationItem } from "@nuxt/content";

// Section roots (e.g. /components, /utilities, /documentation/design) have no
// index page. Redirect each to its first sidebar entry, resolved from the live
// navigation tree — so the target never goes stale when the sidebar is reordered,
// and brand-new sections (top-level or nested) work without touching this file.
export default defineNuxtRouteMiddleware(async (to) => {
  // The landing page is the only non-content top-level route; skip it so it does
  // not wait on the navigation query. Every other route is cheap to check.
  if (to.path === "/") return;

  const path = to.path.replace(/\/+$/, "") || "/";

  // Reuse the navigation tree Docus already fetched (keyed "navigation_docs")
  // instead of fetching our own copy, which would be serialised into the payload
  // a second time on every docs page. On a direct SSR hit the middleware can run
  // before Docus' fetch, so query the collection directly as a fallback.
  const cached = useNuxtData<ContentNavigationItem[]>("navigation_docs");
  let nav = cached.data.value ?? undefined;
  if (!nav) {
    const data = await queryCollectionNavigation("docs").catch(() => undefined);
    // Mirror Docus' transform: strip a `/docs` wrapper level if one exists so the
    // tree (and its order) matches the sidebar exactly.
    nav = data?.find((item) => item.path === "/docs")?.children ?? data;
  }

  if (nav) {
    const node = findNode(nav, path);
    // Only section nodes (those with children) redirect; leaf pages and unknown
    // routes fall through to normal rendering / 404.
    if (!node?.children?.length) return;
    const target = firstLeafPath(node);
    if (target && target !== path) {
      // 302 (temporary): the target is derived from navigation order and can
      // change as pages are added or reordered, so it must not be hard-cached.
      return navigateTo(target, { redirectCode: 302, replace: true });
    }
    return;
  }

  // Fail-safe: if the navigation tree can't be loaded, the section entry points
  // linked from the header (see useMainNav) must still resolve instead of 404ing.
  const fallback = SECTION_ROOT_FALLBACKS[path];
  if (fallback)
    return navigateTo(fallback, { redirectCode: 302, replace: true });
});

// Only the header-linked roots need a hard-coded safety net; deeper section roots
// are non-critical if navigation is momentarily unavailable.
const SECTION_ROOT_FALLBACKS: Record<string, string> = {
  "/documentation": "/documentation/getting-started/installation",
  "/components": "/components/action-menu",
  "/utilities": "/utilities/components/inset",
};

function findNode(
  items: ContentNavigationItem[],
  path: string,
): ContentNavigationItem | undefined {
  for (const item of items) {
    if (item.path === path) return item;
    const found = item.children && findNode(item.children, path);
    if (found) return found;
  }
  return undefined;
}

function firstLeafPath(item: ContentNavigationItem): string {
  let current = item;
  while (current.children?.length) current = current.children[0]!;
  return current.path;
}
