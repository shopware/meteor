import type { ContentNavigationItem } from "@nuxt/content";

// Section roots (e.g. /components, /utilities, /documentation/design) have no
// index page of their own. Rather than hard-coding a redirect target per
// section — which silently points at the wrong page whenever the sidebar is
// reordered or a higher-sorted page is added — resolve the first entry from the
// live navigation tree and redirect there. The redirect therefore always tracks
// whatever the sidebar shows first.
export default defineNuxtRouteMiddleware(async (to) => {
  // Only the docs sections use this pattern; skip the landing page and the rest.
  if (!/^\/(documentation|components|utilities)(\/|$)/.test(to.path)) return;

  const path = to.path.replace(/\/+$/, "") || "/";

  // Own cache key (not Docus' "navigation_docs") so we don't clash with its
  // useAsyncData options; the query result is cached per request either way.
  // Mirror Docus' transform: strip a `/docs` wrapper level if one exists so the
  // tree (and its order) matches the sidebar exactly.
  const { data: navigation } = await useAsyncData(
    "section-redirect:navigation",
    () => queryCollectionNavigation("docs"),
    {
      transform: (data: ContentNavigationItem[]) =>
        data.find((item) => item.path === "/docs")?.children ?? data,
    },
  );

  const nav = navigation.value;
  if (!nav) return;

  const node = findNode(nav, path);
  // Leaf pages have no children; only section nodes are redirected.
  if (!node?.children?.length) return;

  const target = firstLeafPath(node);
  if (target && target !== path) {
    // 302 (temporary): the target is derived from navigation order and can
    // change when pages are added or reordered, so it must not be hard-cached.
    return navigateTo(target, { redirectCode: 302, replace: true });
  }
});

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
