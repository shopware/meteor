<script setup lang="ts">
import {
  MtApp,
  MtNav,
  MtPage,
  type BreadcrumbItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

// The main navigation of the application. Mark the current page as active, or
// pass `is-active` to mt-nav to compare the rows with the current route.
const navigation: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: "regular-home", to: "/", active: true },
      {
        label: "Products",
        icon: "regular-products",
        children: [
          { label: "Overview", to: "/products" },
          { label: "Categories", to: "/categories" },
        ],
      },
      { label: "Orders", icon: "regular-shopping-bag", to: "/orders" },
      { label: "Settings", icon: "regular-cog", to: "/settings" },
    ],
  },
];

const breadcrumb: BreadcrumbItem[] = [{ label: "Dashboard", icon: "dashboard" }];
</script>

<template>
  <mt-app>
    <template #navigation>
      <mt-nav class="navigation" :sections="navigation" />
    </template>

    <mt-page width="l" :breadcrumb="breadcrumb">
      <placeholder-slot style="height: 24rem" />
    </mt-page>
  </mt-app>
</template>

<style scoped>
.navigation {
  width: 15rem;
}
</style>
