<script setup lang="ts">
import {
  MtBadge,
  MtNav,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

const sections: NavSection[] = [
  {
    items: [
      { id: "dashboard", label: "Dashboard", icon: "regular-home" },
      { id: "orders", label: "Orders", icon: "regular-shopping-bag" },
      { id: "customers", label: "Customers", icon: "regular-users" },
    ],
  },
];
</script>

<template>
  <mt-nav style="width: 15rem; height: 240px" :sections="sections">
    <template #suffix="{ item }">
      <mt-badge v-if="item.id === 'orders'" variant="critical">12</mt-badge>
    </template>
  </mt-nav>
</template>
