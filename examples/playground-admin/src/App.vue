<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";
import { MtApp, MtPanel } from "@shopware-ag/meteor-component-library";
import AppConfirmModal from "./components/AppConfirmModal.vue";
import AppNav from "./components/AppNav.vue";
import AppSidebar from "./components/AppSidebar.vue";
import { useLayoutSettings } from "./composables/useLayoutSettings";

const { t } = useI18n();
const layout = useLayoutSettings();
</script>

<template>
  <mt-app loading-bar>
    <template #navigation>
      <mt-panel
        :label="t('nav.label')"
        :closable="layout.navigationClosable"
        resizable
        :width="240"
        :min-width="200"
        :max-width="400"
      >
        <AppNav />
      </mt-panel>
    </template>

    <template #content>
      <RouterView />
      <AppConfirmModal />
    </template>

    <template #sidebar>
      <mt-panel
        :label="t('sidebar.label')"
        icon="regular-info-circle"
        :closable="layout.sidebarClosable"
        resizable
        :width="320"
        :min-width="240"
        :max-width="560"
      >
        <AppSidebar />
      </mt-panel>
    </template>
  </mt-app>
</template>
