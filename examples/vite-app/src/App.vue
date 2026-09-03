<template>
  <main class="standalone-demo">
    <mt-card :title="t('app.title')" :subtitle="t('app.description')">
      <div class="standalone-demo__language">
        <mt-select
          :label="t('app.language')"
          :model-value="locale"
          :options="languageOptions"
          data-testid="language-select"
          @update:model-value="onLanguageChange"
        />
      </div>

      <mt-text as="p">
        {{ t("app.ownTexts") }}
      </mt-text>
      <mt-text as="p">
        {{ t("app.meteorTexts") }}
      </mt-text>

      <mt-pagination
        :current-page="currentPage"
        :limit="25"
        :total-items="213"
        @change-current-page="currentPage = $event"
      />
    </mt-card>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtCard,
  MtPagination,
  MtSelect,
  MtText,
} from "@shopware-ag/meteor-component-library";

const { t, locale } = useI18n();

const currentPage = ref(1);

const languageOptions = [
  { label: "English", value: "en" },
  { label: "Deutsch", value: "de" },
  { label: "Français", value: "fr" },
];

function onLanguageChange(value: unknown) {
  if (value === "en" || value === "de" || value === "fr") {
    locale.value = value;
  }
}
</script>

<style scoped>
.standalone-demo {
  max-width: 40rem;
  margin: var(--scale-size-32) auto;
  padding: 0 var(--scale-size-16);
}

.standalone-demo__language {
  margin-block-end: var(--scale-size-16);
}
</style>
