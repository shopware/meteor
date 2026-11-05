<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";
import { MtApp, MtPanel } from "@shopware-ag/meteor-component-library";
import AppChat from "./components/AppChat.vue";
import AppHeader from "./components/AppHeader.vue";

const { t } = useI18n();
</script>

<template>
  <mt-app loading-bar>
    <template #header>
      <AppHeader />
    </template>

    <RouterView />

    <template #sidebar>
      <mt-panel
        :label="t('copilot.title')"
        icon="regular-shopware-copilot"
        closable
        resizable
      >
        <AppChat />
      </mt-panel>
    </template>
  </mt-app>
</template>
