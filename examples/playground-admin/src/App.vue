<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";
import { MtApp } from "@shopware-ag/meteor-component-library";
import AppConfirmModal from "./components/AppConfirmModal.vue";
import AppNav from "./components/AppNav.vue";
import AppSidebar from "./components/AppSidebar.vue";
import { useLayoutSettings } from "./composables/useLayoutSettings";

const { t } = useI18n();
const layout = useLayoutSettings();
</script>

<template>
  <mt-app
    :navigation-label="t('nav.label')"
    :sidebar-label="t('sidebar.label')"
    :navigation-closable="layout.navigationClosable"
    :sidebar-closable="layout.sidebarClosable"
    loading-bar
  >
    <template #navigation>
      <AppNav />
    </template>

    <template #content>
      <RouterView />
      <AppConfirmModal />
    </template>

    <template #sidebar>
      <AppSidebar />
    </template>
  </mt-app>
</template>
