<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtContainer, MtText } from "@shopware-ag/meteor-component-library";

const { t } = useI18n();
</script>

<template>
  <div class="page">
    <mt-container size="m" class="intro">
      <mt-text as="h1" size="l" weight="semibold">{{
        t("dashboard.title")
      }}</mt-text>
      <mt-text size="xs" color="color-text-secondary-default">
        {{ t("dashboard.description") }}
      </mt-text>
    </mt-container>
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  gap: var(--scale-size-4);
}
</style>
