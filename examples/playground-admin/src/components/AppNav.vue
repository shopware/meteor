<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtLink, MtUser } from "@shopware-ag/meteor-component-library";

const { t } = useI18n();

const routes = [
  { to: "/", label: "nav.dashboard" },
  { to: "/products", label: "nav.products" },
  { to: "/cms", label: "nav.cms" },
  { to: "/settings", label: "nav.settings" },
];
</script>

<template>
  <div class="sidebar-start">
    <nav :aria-label="t('nav.label')">
      <ul class="sidebar-start__links">
        <li v-for="route in routes" :key="route.to">
          <mt-link class="sidebar-start__link" :to="route.to">{{
            t(route.label)
          }}</mt-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-start__footer">
      <mt-user name="Mila Hoffmann" subtitle="mila.hoffmann@example.com" />
    </div>
  </div>
</template>

<style scoped>
.sidebar-start {
  display: flex;
  flex: 1;
  flex-direction: column;
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

.sidebar-start__footer {
  margin-block-start: auto;
  padding-block-start: var(--scale-size-16);
}

.sidebar-start__link.router-link-exact-active {
  font-weight: var(--font-weight-semibold);
}
</style>
