<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  MtContainer,
  MtPage,
  MtText,
} from "@shopware-ag/meteor-component-library";

const { t } = useI18n();
</script>

<template>
  <mt-page :title="t('dashboard.title')">
    <mt-container class="page stack">
      <mt-text size="xs" color="color-text-secondary-default">
        {{ t("dashboard.description") }}
      </mt-text>
    </mt-container>
  </mt-page>
</template>
