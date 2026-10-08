<script setup lang="ts">
import { ref } from "vue";
import MtNav from "@shopware-ag/meteor-component-library/MtNav";
import type { NavItem, NavSection } from "@shopware-ag/meteor-component-library";

const sections: NavSection[] = [
  {
    header: "Shop",
    items: [
      { label: "Dashboard", icon: "regular-home", to: "#dashboard" },
      { label: "Orders", icon: "regular-shopping-bag", to: "#orders" },
      { label: "Customers", icon: "regular-users", to: "#customers" },
    ],
  },
  {
    header: "System",
    items: [
      { label: "Settings", icon: "regular-cog", to: "#settings" },
      { label: "Docs", href: "https://docs.shopware.com", target: "_blank" },
    ],
  },
];

const current = ref("#dashboard");

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
