<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtContainer, MtText } from "@shopware-ag/meteor-component-library";

const { t } = useI18n();
</script>

<template>
  <div class="page">
    <mt-container class="page__content">
      <mt-text size="xs">{{ t("pages.one") }}</mt-text>
    </mt-container>
  </div>
</template>
