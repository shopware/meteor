<script setup lang="ts">
import { ref } from "vue";
import MtNav from "@shopware-ag/meteor-component-library/MtNav";
import type { NavItem, NavSection } from "@shopware-ag/meteor-component-library";

const sections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: "regular-home", to: "#dashboard" },
      {
        label: "Settings",
        icon: "regular-cog",
        children: [
          {
            label: "Shop",
            children: [
              { label: "Basic information", to: "#basic-information" },
              { label: "Languages", to: "#languages" },
              { label: "Currencies", to: "#currencies" },
            ],
          },
          {
            label: "System",
            children: [
              { label: "Users & permissions", to: "#users" },
              { label: "Integrations", to: "#integrations" },
            ],
          },
        ],
      },
    ],
  },
];

const current = ref("#languages");

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
