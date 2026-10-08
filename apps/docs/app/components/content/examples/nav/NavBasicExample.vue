<script setup lang="ts">
import { ref } from "vue";
import MtNav from "@shopware-ag/meteor-component-library/MtNav";
import type { NavItem, NavSection } from "@shopware-ag/meteor-component-library";

const sections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: "regular-home", to: "#dashboard" },
      {
        label: "Products",
        icon: "regular-products",
        children: [
          { label: "Overview", to: "#overview" },
          { label: "Categories", to: "#categories" },
          { label: "Manufacturers", to: "#manufacturers" },
        ],
      },
      { label: "Orders", icon: "regular-shopping-bag", to: "#orders" },
      { label: "Customers", icon: "regular-users", to: "#customers" },
      { label: "Settings", icon: "regular-cog", to: "#settings" },
    ],
  },
];

// In an application, compare against the current route instead
const current = ref("#overview");

function isActive(item: NavItem) {
  return item.to === current.value;
}

function onNavigate(item: NavItem) {
  if (typeof item.to === "string") {
    current.value = item.to;
  }
}
</script>

<template>
  <div style="width: 240px; height: 360px">
    <mt-nav :sections="sections" :is-active="isActive" @navigate="onNavigate" />
  </div>
</template>
