<script setup lang="ts">
import { ref } from "vue";
import MtApp from "@shopware-ag/meteor-component-library/MtApp";
import MtThemeSelect from "@shopware-ag/meteor-component-library/MtThemeSelect";
import type { Theme } from "@shopware-ag/meteor-component-library";

// controlled: the application owns the preference and the shell applies it to <html>
const theme = ref<Theme>("system");
</script>

<template>
  <mt-app v-model:theme="theme" :future="{ all: true }">
    <template #header>
      <mt-theme-select v-model="theme" label="Color theme" />
    </template>

    <template #content>
      <router-view />
    </template>
  </mt-app>
</template>
