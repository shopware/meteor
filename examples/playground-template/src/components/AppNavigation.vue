<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  MtNav,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

const { t } = useI18n();
const route = useRoute();

const sections = computed<NavSection[]>(() => [
  {
    items: [
      { id: "home", label: t("nav.home"), icon: "regular-home", to: "/" },
      {
        id: "settings",
        label: t("nav.settings"),
        icon: "regular-cog",
        to: "/settings",
      },
    ],
  },
]);

/** A row is active on its own page and on the pages below it. */
function isActive(item: NavItem) {
  if (typeof item.to !== "string") return false;
  if (item.to === "/") return route.path === "/";

  return route.path === item.to || route.path.startsWith(`${item.to}/`);
}
</script>

<template>
  <mt-nav class="app-navigation" :sections="sections" :is-active="isActive" />
</template>

<style scoped>
/* The shell sizes the navigation to its content, so it brings its own width. */
.app-navigation {
  flex: 1;
  width: 15rem;
  min-height: 0;
}
</style>
