<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtPage, MtText } from "@shopware-ag/meteor-component-library";

const { t } = useI18n();
</script>

<template>
  <mt-page :breadcrumb="[{ label: t('home.title'), icon: 'home' }]">
    <mt-text size="xs">{{ t("home.intro") }}</mt-text>
  </mt-page>
</template>
