<script setup lang="ts">
import { RouterView } from "vue-router";
import { MtApp } from "@shopware-ag/meteor-component-library";
import AppNavigation from "./components/AppNavigation.vue";
</script>

<template>
  <mt-app loading-bar>
    <template #navigation>
      <AppNavigation />
    </template>

    <template #content>
      <RouterView />
    </template>
  </mt-app>
</template>
