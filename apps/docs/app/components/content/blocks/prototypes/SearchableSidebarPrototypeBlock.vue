<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtApp,
  MtAppSidebar,
  MtBrand,
  MtPage,
  MtPanel,
  MtSearch,
  MtText,
  MtUserMenu,
  type BreadcrumbItem,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

// The main navigation of the application. Mark the current page with `active`.
const sections: NavSection[] = [
  {
    header: "Shop",
    items: [
      { label: "Dashboard", icon: "regular-dashboard", to: "/", active: true },
      { label: "Orders", icon: "regular-shopping-bag", to: "/orders" },
      {
        label: "Products",
        icon: "regular-products",
        children: [
          { label: "Overview", to: "/products" },
          { label: "Categories", to: "/categories" },
          { label: "Reviews", to: "/reviews" },
        ],
      },
      { label: "Customers", icon: "regular-users", to: "/customers" },
    ],
  },
  {
    header: "Content",
    items: [
      { label: "Shopping Experiences", icon: "regular-image-text", to: "/cms" },
      { label: "Media", icon: "regular-image", to: "/media" },
    ],
  },
  {
    header: "Marketing",
    items: [
      { label: "Promotions", icon: "regular-discount", to: "/promotions" },
      { label: "Newsletter", icon: "regular-envelope", to: "/newsletter" },
    ],
  },
  {
    header: "System",
    items: [
      { label: "Extensions", icon: "regular-plug", to: "/extensions" },
      { label: "Settings", icon: "regular-cog", to: "/settings" },
    ],
  },
];

const term = ref("");

// Keeps the items whose label matches the search, and the groups with a matching child.
function filterItems(items: NavItem[]): NavItem[] {
  const needle = term.value.trim().toLowerCase();

  return items.flatMap((item) => {
    if (item.label.toLowerCase().includes(needle)) return [item];
    if (!("children" in item) || !item.children) return [];

    const children = filterItems(item.children);
    return children.length > 0 ? [{ ...item, children }] : [];
  });
}

const visibleSections = computed<NavSection[]>(() =>
  term.value.trim()
    ? sections
        .map((section) => ({ ...section, items: filterItems(section.items) }))
        .filter((section) => section.items.length > 0)
    : sections,
);

const breadcrumb: BreadcrumbItem[] = [{ label: "Dashboard", icon: "dashboard" }];
</script>

<template>
  <mt-app>
    <template #navigation>
      <mt-panel label="Navigation" closable resizable :min-width="200" :max-width="320">
        <mt-app-sidebar :sections="visibleSections">
          <template #start>
            <mt-brand title="Shopware" subtitle="Meteor" />
          </template>

          <template #actions>
            <div class="sidebar-actions">
              <mt-search v-model="term" size="small" placeholder="Search pages" />

              <mt-text
                v-if="visibleSections.length === 0"
                size="xs"
                color="color-text-secondary-default"
              >
                No pages match "{{ term }}".
              </mt-text>

              <missing-feature title="Open groups" kind="prop" inline>
                Nav only opens the group of the active page. A group with a match for the search
                stays closed, as there is no prop to open it.
              </missing-feature>
              <missing-feature title="Counters" kind="slot" inline>
                App Sidebar does not pass on the suffix slot of Nav, so items can't show a count
                such as twelve open orders.
              </missing-feature>
              <missing-feature title="Disabled items" kind="prop" inline>
                Nav items have no disabled state, for pages people can see but not open.
              </missing-feature>
              <missing-feature title="Section actions" kind="slot" inline>
                Section headers are plain text. A button next to a header, such as one to add a
                page, has no place.
              </missing-feature>
            </div>
          </template>

          <template #end>
            <div class="sidebar-end">
              <missing-feature title="Icon-only mode" kind="prop" inline>
                The panel can only close completely. A narrow mode that keeps the icons of the
                navigation is missing.
              </missing-feature>

              <mt-user-menu name="Max Mustermann" subtitle="Administrator">
                <mt-action-menu-group>
                  <mt-action-menu-item icon="regular-sign-out" variant="critical">
                    Log out
                  </mt-action-menu-item>
                </mt-action-menu-group>
              </mt-user-menu>
            </div>
          </template>
        </mt-app-sidebar>
      </mt-panel>
    </template>

    <mt-page width="l" :breadcrumb="breadcrumb">
      <placeholder-slot style="height: 24rem" />
    </mt-page>
  </mt-app>
</template>

<style scoped>
.sidebar-actions,
.sidebar-end {
  display: grid;
  flex: 1;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-8);
  min-width: 0;
}

.sidebar-actions > .missing-feature,
.sidebar-end > .missing-feature {
  justify-self: start;
}
</style>
