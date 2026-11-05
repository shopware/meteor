<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { MtPage } from "@shopware-ag/meteor-component-library";
import AppChat from "../components/AppChat.vue";

const { t } = useI18n();
</script>

<template>
  <mt-page
    :breadcrumb="[{ label: t('copilot.title'), icon: 'shopware-copilot' }]"
    inset
  >
    <div class="copilot-view">
      <AppChat />
    </div>
  </mt-page>
</template>

<style scoped>
/* Fills the page, so the messages scroll above a composer that stays at the bottom. */
.copilot-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 48rem;
  height: 100%;
  margin-inline: auto;
}
</style>
