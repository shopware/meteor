<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtText } from "@shopware-ag/meteor-component-library";

const { t } = useI18n();
</script>

<template>
  <div class="app-sidebar">
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
</style>
