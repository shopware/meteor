<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtText } from "@shopware-ag/meteor-component-library";

const { t } = useI18n();
</script>

<template>
  <div class="app-header">
    <mt-text as="span" size="s" weight="bold">{{ t("app.title") }}</mt-text>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  min-height: var(--scale-size-64);
  padding-inline: var(--scale-size-24);
}
</style>
