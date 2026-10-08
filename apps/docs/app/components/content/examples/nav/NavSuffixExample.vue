<script setup lang="ts">
import { ref } from "vue";
import MtNav from "@shopware-ag/meteor-component-library/MtNav";
import MtBadge from "@shopware-ag/meteor-component-library/MtBadge";
import type { NavItem, NavSection } from "@shopware-ag/meteor-component-library";

const sections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: "regular-home", to: "#dashboard" },
      { label: "Orders", icon: "regular-shopping-bag", to: "#orders" },
      {
        label: "Marketing",
        icon: "regular-megaphone",
        children: [
          { label: "Promotions", to: "#promotions" },
          { label: "Newsletter recipients", to: "#newsletter" },
        ],
      },
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
    <mt-nav :sections="sections" :is-active="isActive" @navigate="onNavigate">
      <template #suffix="{ item }">
        <mt-badge v-if="item.label === 'Orders'" variant="critical">12</mt-badge>
        <mt-badge v-if="item.label === 'Promotions'" variant="info">New</mt-badge>
      </template>
    </mt-nav>
  </div>
</template>
