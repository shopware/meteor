<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { RouterView, useRoute } from "vue-router";
import { MtApp, MtPanel } from "@shopware-ag/meteor-component-library";
import AppConfirmModal from "./components/AppConfirmModal.vue";
import AppNav from "./components/AppNav.vue";
import AppSidebar from "./components/AppSidebar.vue";
import AppTopBar from "./components/AppTopBar.vue";
import { useLayoutSettings } from "./composables/useLayoutSettings";

const { t } = useI18n();
const layout = useLayoutSettings();
const route = useRoute();
</script>

<template>
  <mt-app loading-bar>
    <template #navigation>
      <mt-panel
        :label="t('nav.label')"
        :closable="layout.navigationClosable"
        resizable
      >
        <AppNav />
      </mt-panel>
    </template>

    <div class="app-frame">
      <!-- Full-screen views, such as the layout editor, hide the top bar. -->
      <AppTopBar v-if="route.meta.topBar !== false" />
      <RouterView />
    </div>
    <AppConfirmModal />

    <template #sidebar>
      <mt-panel
        :label="t('sidebar.label')"
        icon="regular-shopware-copilot"
        :closable="layout.sidebarClosable"
        resizable
        :max-width="560"
      >
        <AppSidebar />
      </mt-panel>
    </template>
  </mt-app>
</template>
