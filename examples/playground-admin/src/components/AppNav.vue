<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtLink } from "@shopware-ag/meteor-component-library";

const { t } = useI18n();

const routes = [
  { to: "/", label: "nav.dashboard" },
  { to: "/products", label: "nav.products" },
  { to: "/cms", label: "nav.cms" },
  { to: "/settings", label: "nav.settings" },
];
</script>

<template>
  <nav class="sidebar-start" :aria-label="t('nav.label')">
    <ul class="sidebar-start__links">
      <li v-for="route in routes" :key="route.to">
        <mt-link class="sidebar-start__link" :to="route.to">{{
          t(route.label)
        }}</mt-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.sidebar-start {
  width: 15rem;
  padding: var(--scale-size-16);
}

.sidebar-start__links {
  display: grid;
  gap: var(--scale-size-8);
  margin: 0;
  padding: 0;
  list-style: none;
}

.sidebar-start__link.router-link-exact-active {
  font-weight: var(--font-weight-semibold);
}
</style>
