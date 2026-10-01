<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtText, useMtApp } from "@shopware-ag/meteor-component-library";

const { t } = useI18n();
const { isMobile } = useMtApp();
</script>

<template>
  <div class="app-header" :class="{ 'app-header--mobile': isMobile }">
    <mt-text as="span" size="s" weight="bold">{{ t("app.title") }}</mt-text>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  min-height: var(--scale-size-56);
  padding-inline: var(--scale-size-16);
}

.app-header--mobile {
  padding-inline: 0;
}
</style>
