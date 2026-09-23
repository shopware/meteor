<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  MtActionMenu,
  MtActionMenuItem,
  MtButton,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtLink,
} from "@shopware-ag/meteor-component-library";

const { t } = useI18n();

const routes = [
  { to: "/", label: "nav.pageOne" },
  { to: "/page-two", label: "nav.pageTwo" },
  { to: "/settings", label: "nav.settings" },
];
</script>

<template>
  <div class="sidebar-start">
    <nav :aria-label="t('shell.navigation')">
      <ul class="sidebar-start__links">
        <li v-for="route in routes" :key="route.to">
          <mt-link class="sidebar-start__link" :to="route.to">{{
            t(route.label)
          }}</mt-link>
        </li>
      </ul>
    </nav>

    <!-- a teleported dropdown owned by the sidebar; stays usable while the sidebar is a drawer -->
    <mt-dropdown-menu-root>
      <mt-dropdown-menu-trigger as-child>
        <mt-button variant="secondary" size="small">{{
          t("nav.actions")
        }}</mt-button>
      </mt-dropdown-menu-trigger>

      <mt-dropdown-menu-portal>
        <mt-action-menu>
          <mt-action-menu-item icon="file-text">{{
            t("nav.documentation")
          }}</mt-action-menu-item>
          <mt-action-menu-item icon="copy">{{
            t("nav.copyLink")
          }}</mt-action-menu-item>
        </mt-action-menu>
      </mt-dropdown-menu-portal>
    </mt-dropdown-menu-root>
  </div>
</template>

<style scoped>
.sidebar-start {
  display: grid;
  gap: var(--scale-size-16);
  align-content: start;
  justify-items: start;
  width: 15rem; /* 240px */
  padding: var(--scale-size-16);
}

.sidebar-start__links {
  display: grid;
  gap: var(--scale-size-8);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* exactly one link is active: the one matching the current route */
.sidebar-start__link.router-link-exact-active {
  font-weight: var(--font-weight-semibold);
}
</style>
