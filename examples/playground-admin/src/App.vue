<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";
import { MtApp } from "@shopware-ag/meteor-component-library";
import AppHeader from "./components/AppHeader.vue";
import AppNav from "./components/AppNav.vue";
import AppSidebar from "./components/AppSidebar.vue";

const { t } = useI18n();

/** Whether a panel is shown on the desktop, remembered across visits. */
function usePanelState(storageKey: string) {
  const isOpen = ref(localStorage.getItem(storageKey) !== "false");
  watch(isOpen, (value) => localStorage.setItem(storageKey, String(value)));

  return isOpen;
}

const navigationOpen = usePanelState("playground-admin-navigation-open");
const sidebarOpen = usePanelState("playground-admin-sidebar-open");
</script>

<template>
  <mt-app
    v-model:navigation-open="navigationOpen"
    v-model:sidebar-open="sidebarOpen"
    :navigation-label="t('nav.label')"
    :sidebar-label="t('sidebar.label')"
    loading-bar
  >
    <template #header>
      <AppHeader />
    </template>

    <template #navigation>
      <AppNav />
    </template>

    <template #content>
      <RouterView />
    </template>

    <template #sidebar="{ isMobile }">
      <AppSidebar :framed="!isMobile" />
    </template>
  </mt-app>
</template>
