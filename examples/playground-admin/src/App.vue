<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";
import { MtApp } from "@shopware-ag/meteor-component-library";
import AppHeader from "./components/AppHeader.vue";
import AppNav from "./components/AppNav.vue";
import SidebarEnd from "./components/SidebarEnd.vue";
import { settings } from "./store/settings";

const { t } = useI18n();
</script>

<template>
  <mt-app
    :future="{ all: settings.future }"
    :breakpoint="settings.breakpoint"
    :snackbar="settings.snackbar"
    :close-on-navigate="settings.closeOnNavigate"
    :sidebar-start-label="t('shell.navigation')"
    :sidebar-end-label="t('shell.details')"
  >
    <template v-if="settings.header" #header>
      <AppHeader />
    </template>

    <template v-if="settings.sidebarStart" #sidebar-start>
      <AppNav />
    </template>

    <template #content>
      <RouterView />
    </template>

    <template v-if="settings.sidebarEnd" #sidebar-end="{ isMobile }">
      <SidebarEnd :framed="!isMobile" />
    </template>
  </mt-app>
</template>
