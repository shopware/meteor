<script setup lang="ts">
import { MtNav, type NavSection } from "@shopware-ag/meteor-component-library";

const sections: NavSection[] = [
  {
    header: "Sales",
    items: [
      { label: "Orders", icon: "regular-shopping-bag", active: true },
      { label: "Customers", icon: "regular-users" },
    ],
  },
  {
    header: "System",
    items: [
      { label: "Extensions", icon: "regular-plug" },
      { label: "Settings", icon: "regular-cog" },
    ],
  },
];
</script>

<template>
  <mt-nav style="width: 15rem; height: 320px" :sections="sections" />
</template>
