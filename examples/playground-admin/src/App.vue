<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";
import { MtApp } from "@shopware-ag/meteor-component-library";
import AppHeader from "./components/AppHeader.vue";
import AppNav from "./components/AppNav.vue";
import AppSidebar from "./components/AppSidebar.vue";
import { settings } from "./stores/settings";

const { t } = useI18n();
</script>

<template>
  <mt-app :navigation-label="t('nav.label')" loading-bar>
    <template v-if="settings.header" #header>
      <AppHeader />
    </template>

    <template v-if="settings.navigation" #navigation>
      <AppNav />
    </template>

    <template #content>
      <RouterView />
    </template>

    <template v-if="settings.sidebar" #sidebar="{ isMobile }">
      <AppSidebar :framed="!isMobile" />
    </template>
  </mt-app>
</template>
