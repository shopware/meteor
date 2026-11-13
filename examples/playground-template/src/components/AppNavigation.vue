<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { MtNav, type NavSection } from "@shopware-ag/meteor-component-library";

const { t } = useI18n();

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
</script>

<template>
  <mt-nav class="app-navigation" :sections="sections" />
</template>

<style scoped>
/* The shell sizes the navigation to its content, so it brings its own width. */
.app-navigation {
  flex: 1;
  width: 15rem;
  min-height: 0;
}
</style>
