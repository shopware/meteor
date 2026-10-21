<script setup lang="ts">
import { defineComponent, h, ref } from "vue";
import {
  MtNav,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

// Stands in for router-link, so the example stays on this page.
const DemoLink = defineComponent({
  props: { to: { type: String, required: true } },
  setup(_, { slots }) {
    return () =>
      h(
        "a",
        { href: "#", onClick: (event: MouseEvent) => event.preventDefault() },
        slots.default?.(),
      );
  },
});

const sections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: "regular-home", to: "/" },
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

// The current route of the example, which follows the clicked row.
const currentPath = ref("/products");

function isActive(item: NavItem) {
  return item.to === currentPath.value;
}

function onNavigate(item: NavItem) {
  currentPath.value = item.to as string;
}
</script>

<template>
  <mt-nav
    style="width: 15rem; height: 320px"
    :sections="sections"
    :link-component="DemoLink"
    :is-active="isActive"
    @navigate="onNavigate"
  />
</template>
