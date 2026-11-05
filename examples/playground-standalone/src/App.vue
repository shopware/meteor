<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView, useRoute } from "vue-router";
import { MtApp, MtPanel } from "@shopware-ag/meteor-component-library";
import AppCopilotPanel from "./components/AppCopilotPanel.vue";
import AppHeader from "./components/AppHeader.vue";
import AppPageTree from "./components/AppPageTree.vue";
import AppPanelHeader from "./components/AppPanelHeader.vue";

const { t } = useI18n();
const route = useRoute();

const navigation = computed(
  () =>
    route.meta.navigation ?? {
      label: "pageTree.label",
      icon: "regular-folder",
    },
);
</script>

<template>
  <mt-app loading-bar>
    <template #header="{ isMobile }">
      <AppHeader :is-mobile="isMobile" />
    </template>

    <template #navigation>
      <mt-panel
        :label="t(navigation.label)"
        :icon="navigation.icon"
        appearance="bordered"
        closable
        resizable
      >
        <AppPanelHeader panel="navigation" :title="t(navigation.label)" />

        <!-- A route can bring its own navigation as a named view; the others show the page tree. -->
        <div class="app-navigation">
          <RouterView v-slot="{ Component }" name="navigation">
            <component :is="Component ?? AppPageTree" />
          </RouterView>
        </div>
      </mt-panel>
    </template>

    <RouterView />

    <template #sidebar>
      <mt-panel
        :label="t('copilot.title')"
        icon="regular-shopware-copilot"
        closable
        resizable
      >
        <AppCopilotPanel />
      </mt-panel>
    </template>
  </mt-app>
</template>

<style scoped>
/* Scrolls below the panel header, which stays in place. */
.app-navigation {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
}
</style>
