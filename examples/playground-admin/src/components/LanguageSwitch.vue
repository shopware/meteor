<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { MtSelect } from "@shopware-ag/meteor-component-library";

/**
 * The content language of a page, next to its actions, as in the Administration. The playground
 * has its content in one language only, so it changes nothing.
 */
const { t } = useI18n();
const language = ref("en-GB");

const options = [
  { value: "en-GB", label: "English" },
  { value: "de-DE", label: "Deutsch" },
];
</script>

<template>
  <mt-select
    v-model="language"
    class="language-switch"
    :aria-label="t('common.contentLanguage')"
    :options="options"
    :enable-search="false"
    hide-clearable-button
  />
</template>

<style scoped>
.language-switch {
  width: 10.25rem;
}

.language-switch :deep(.mt-field) {
  margin: 0;
}

@media (max-width: 720px) {
  .language-switch {
    display: none;
  }
}
</style>
