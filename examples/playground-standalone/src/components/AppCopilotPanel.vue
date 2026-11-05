<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtButton,
  MtIcon,
  useApp,
} from "@shopware-ag/meteor-component-library";
import AppChat from "./AppChat.vue";
import AppPanelHeader from "./AppPanelHeader.vue";

const { t } = useI18n();
const router = useRouter();
const app = useApp();

/** Moves the conversation to the Copilot page and closes the sidebar, which would repeat it. */
function openModule() {
  app.close("sidebar");
  router.push("/copilot");
}
</script>

<template>
  <aside class="app-copilot-panel" :aria-label="t('copilot.title')">
    <AppPanelHeader panel="sidebar" :title="t('copilot.title')">
      <template #icon>
        <mt-icon
          name="regular-shopware-copilot"
          size="var(--scale-size-16)"
          decorative
        />
      </template>

      <template #actions>
        <mt-button
          variant="tertiary"
          size="default"
          square
          :aria-label="t('copilot.open')"
          @click="openModule"
        >
          <mt-icon
            name="regular-expand-arrows"
            size="var(--scale-size-16)"
            decorative
          />
        </mt-button>
      </template>
    </AppPanelHeader>

    <AppChat />
  </aside>
</template>

<style scoped>
.app-copilot-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}
</style>
