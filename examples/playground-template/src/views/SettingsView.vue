<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  MtCard,
  MtPage,
  MtSelect,
  MtThemeSelect,
  useTheme,
} from "@shopware-ag/meteor-component-library";

const { t, locale } = useI18n();
const { theme } = useTheme();

// Each language is named in itself, so everyone finds their own.
const localeOptions = [
  { label: "English", value: "en" },
  { label: "Deutsch", value: "de" },
];
</script>

<template>
  <mt-page
    width="s"
    :breadcrumb="[{ label: t('settings.title'), icon: 'cog' }]"
  >
    <mt-card>
      <div class="settings-fields">
        <mt-select
          v-model="locale"
          :label="t('settings.language')"
          :options="localeOptions"
          :enable-search="false"
          hide-clearable-button
        />
        <mt-theme-select v-model="theme" :label="t('settings.theme')" />
      </div>
    </mt-card>
  </mt-page>
</template>

<style scoped>
.settings-fields {
  display: grid;
  gap: var(--scale-size-16);
}
</style>
