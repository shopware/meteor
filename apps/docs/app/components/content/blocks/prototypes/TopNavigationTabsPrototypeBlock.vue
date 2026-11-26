<script setup lang="ts">
import { computed, ref } from "vue";
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtApp,
  MtAppHeader,
  MtBrand,
  MtNav,
  MtPage,
  MtScrollArea,
  MtUserMenu,
  type BreadcrumbItem,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

// The sections of the application. Each one has pages of its own in the second row.
const sections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: "regular-dashboard", to: "/" },
      { label: "Orders", icon: "regular-shopping-bag", to: "/orders" },
      { label: "Products", icon: "regular-products", to: "/products", active: true },
      { label: "Customers", icon: "regular-users", to: "/customers" },
      { label: "Marketing", icon: "regular-megaphone", to: "/marketing" },
    ],
  },
];

// The pages of the current section.
const subpages: NavSection[] = [
  {
    items: [
      { id: "overview", label: "Overview", to: "/products" },
      { id: "categories", label: "Categories", to: "/products/categories" },
      { id: "reviews", label: "Reviews", to: "/products/reviews" },
      { id: "manufacturers", label: "Manufacturers", to: "/products/manufacturers" },
      { id: "properties", label: "Properties", to: "/products/properties" },
    ],
  },
];

const subpage = ref("overview");

// With Vue Router, compare the item with the current route instead.
const isActive = (item: NavItem) => item.id === subpage.value;

const breadcrumb = computed<BreadcrumbItem[]>(() => [
  { label: "Products", to: "/products", icon: "products" },
  { label: subpages[0]!.items.find((item: NavItem) => item.id === subpage.value)?.label ?? "" },
]);
</script>

<template>
  <mt-app>
    <template #header>
      <mt-app-header :sections="sections">
        <template #start>
          <mt-brand title="Shopware" subtitle="Meteor" />
        </template>

        <template #end="{ isMobile }">
          <mt-user-menu name="Max Mustermann" subtitle="Administrator" :compact="!isMobile">
            <mt-action-menu-group>
              <mt-action-menu-item icon="regular-sign-out" variant="critical">
                Log out
              </mt-action-menu-item>
            </mt-action-menu-group>
          </mt-user-menu>
        </template>
      </mt-app-header>
    </template>

    <mt-page width="l" :breadcrumb="breadcrumb">
      <div class="stack">
        <div class="subnav">
          <mt-scroll-area orientation="horizontal">
            <mt-nav
              orientation="horizontal"
              :sections="subpages"
              label="Products"
              :is-active="isActive"
              @navigate="(item: NavItem) => (subpage = item.id ?? subpage)"
            />
          </mt-scroll-area>

          <missing-feature title="Second header row" kind="slot" inline>
            App and App Header have no row below the header for the pages of a section, so they
            sit at the top of the page and scroll with it.
          </missing-feature>
        </div>

        <placeholder-slot style="height: 24rem" />
      </div>
    </mt-page>
  </mt-app>
</template>

<style scoped>
.stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
  align-content: start;
}

.subnav {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--scale-size-8);
  padding-block-end: var(--scale-size-8);
  border-block-end: 1px solid var(--color-border-secondary-default);
}

@media (width < 800px) {
  .subnav {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
