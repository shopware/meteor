<script setup lang="ts">
import { RouterView } from "vue-router";
import { MtApp } from "@shopware-ag/meteor-component-library";
import AppHeader from "./components/AppHeader.vue";
import AppNav from "./components/AppNav.vue";
import Sidebar from "./components/Sidebar.vue";
import { settings } from "./store/settings";
</script>

<template>
  <mt-app end-drawer-variant="floating">
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
      <Sidebar :framed="!isMobile" />
    </template>
  </mt-app>
</template>
