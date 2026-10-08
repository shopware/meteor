<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtText } from "@shopware-ag/meteor-component-library";

/** Framed like the content panel; inside a drawer the frame is dropped. */
defineProps<{
  framed?: boolean;
}>();

const { t } = useI18n();
</script>

<template>
  <div class="app-sidebar" :class="{ 'app-sidebar--framed': framed }">
    <mt-text size="xs" color="color-text-secondary-default">{{
      t("sidebar.label")
    }}</mt-text>
  </div>
</template>

<style scoped>
.app-sidebar {
  width: 20rem;
  padding: var(--scale-size-16);
}

.app-sidebar--framed {
  height: 100%;
  overflow: auto;
  background-color: var(--color-elevation-surface-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
}
</style>
