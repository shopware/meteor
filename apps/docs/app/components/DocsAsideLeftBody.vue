<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";

// Overrides Docus' default to filter the sidebar (query comes from the input in
// DocsAsideLeftTop) and expand all sections at once. `default-open` is omitted on
// purpose: UContentNavigation opens only the active section when it's true, but
// opens every section when absent.
const { sidebarNavigation } = useSubNavigation();
const query = useSidebarFilter();

// Reset the filter on navigation so a stale query doesn't leave another
// section's sidebar showing "No matches".
const route = useRoute();
watch(
  () => route.path,
  () => {
    query.value = "";
  },
);

// Keep an item when its own title matches, or when any descendant matches (then
// only the matching descendants are shown).
function filterNavigation(
  items: ContentNavigationItem[],
  q: string,
): ContentNavigationItem[] {
  return items.flatMap((item) => {
    if (item.title?.toLowerCase().includes(q)) return [item];
    const children = item.children ? filterNavigation(item.children, q) : [];
    return children.length ? [{ ...item, children }] : [];
  });
}

const filteredNavigation = computed<ContentNavigationItem[]>(() => {
  const q = query.value.trim().toLowerCase();
  const nav = sidebarNavigation.value ?? [];
  return q ? filterNavigation(nav, q) : nav;
});
</script>

<template>
  <UContentNavigation
    v-if="filteredNavigation.length"
    type="multiple"
    :highlight="false"
    variant="pill"
    color="neutral"
    :navigation="filteredNavigation"
  />
  <p v-else class="px-2.5 text-sm text-muted">No matches.</p>
</template>
