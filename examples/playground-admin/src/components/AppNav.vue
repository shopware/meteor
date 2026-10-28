<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtLink } from "@shopware-ag/meteor-component-library";

const { t } = useI18n();

const routes = [
  { to: "/", label: "nav.dashboard" },
  { to: "/cms", label: "nav.cms" },
  { to: "/settings", label: "nav.settings" },
];
</script>

<template>
  <div class="app-nav">
    <ul class="app-nav__links">
      <li v-for="route in routes" :key="route.to">
        <mt-link class="app-nav__link" :to="route.to">{{
          t(route.label)
        }}</mt-link>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.app-nav {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 15rem;
  padding: var(--scale-size-16);
}

.app-nav__links {
  display: grid;
  gap: var(--scale-size-8);
  margin: 0;
  padding: 0;
  list-style: none;
}

.app-nav__link.router-link-exact-active {
  font-weight: var(--font-weight-semibold);
}
</style>
