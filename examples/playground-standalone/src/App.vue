<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView, useRoute } from "vue-router";
import {
  MtApp,
  MtPanel,
  type MtAppRegions,
} from "@shopware-ag/meteor-component-library";
import AppCopilotPanel from "./components/AppCopilotPanel.vue";
import AppHeader from "./components/AppHeader.vue";

const { t } = useI18n();
const route = useRoute();

/**
 * The header brings the sidebar's trigger. Without the header, as in full screen, the panel is
 * closable, so the page header shows its trigger instead.
 */
const isHeaderHidden = computed(() => {
  // The library's built types don't carry its `RouteMeta` augmentation.
  const regions = route.meta.mtAppRegions as MtAppRegions | undefined;
  return regions?.header === false;
});
</script>

<template>
  <mt-app loading-bar>
    <template #header="{ isMobile }">
      <AppHeader :is-mobile="isMobile" />
    </template>

    <RouterView />

    <template #sidebar>
      <mt-panel
        :label="t('copilot.title')"
        icon="regular-shopware-copilot"
        :closable="isHeaderHidden"
        resizable
      >
        <AppCopilotPanel />
      </mt-panel>
    </template>
  </mt-app>
</template>
