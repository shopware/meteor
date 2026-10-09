<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";
import { MtApp } from "@shopware-ag/meteor-component-library";
import AppNav from "./components/AppNav.vue";
import AppSidebar from "./components/AppSidebar.vue";

const { t } = useI18n();
</script>

<template>
  <mt-app
    :navigation-label="t('nav.label')"
    :sidebar-label="t('sidebar.label')"
    loading-bar
  >
    <template #navigation>
      <AppNav />
    </template>

    <template #content>
      <RouterView />
    </template>

    <template #sidebar>
      <AppSidebar />
    </template>
  </mt-app>
</template>
