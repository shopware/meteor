<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtContainer, MtText } from "@shopware-ag/meteor-component-library";

const { t } = useI18n();
</script>

<template>
  <div class="page">
    <mt-container size="l" class="page__content">
      <mt-text size="xs">{{ t("pages.two") }}</mt-text>
      <mt-text
        v-for="n in 40"
        :key="n"
        size="xs"
        color="color-text-secondary-default"
      >
        {{ t("pages.paragraph", { n }) }}
      </mt-text>
    </mt-container>
  </div>
</template>
