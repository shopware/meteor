<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  MtButton,
  MtCard,
  MtContainer,
  MtModal,
  MtModalAction,
  MtModalClose,
  MtModalRoot,
  MtModalTrigger,
  MtSelect,
  MtText,
  MtThemeSelect,
  useSnackbar,
  useTheme,
} from "@shopware-ag/meteor-component-library";

const { t, locale } = useI18n();
const { theme } = useTheme();
const { addSnackbar } = useSnackbar();

const localeOptions = [
  { label: "English", value: "en" },
  { label: "Deutsch", value: "de" },
];

function reset(done: () => void) {
  locale.value = "en";
  theme.value = "system";
  done();
  addSnackbar({ message: t("settings.resetDone"), variant: "success" });
}
</script>

<template>
  <mt-container as="section" size="s" class="page stack">
    <mt-card :title="t('settings.title')">
      <div class="stack">
        <mt-select
          v-model="locale"
          :label="t('settings.language')"
          :options="localeOptions"
          :enable-search="false"
          hide-clearable-button
        />
        <mt-theme-select v-model="theme" :label="t('settings.theme')" />
      </div>

      <template #footer>
        <mt-modal-root>
          <mt-modal-trigger :as="MtButton" variant="secondary" size="default">
            {{ t("settings.reset") }}
          </mt-modal-trigger>

          <mt-modal :title="t('settings.resetTitle')" width="s">
            <mt-text size="xs">{{ t("settings.resetText") }}</mt-text>

            <template #footer>
              <div class="actions">
                <mt-modal-close
                  :as="MtButton"
                  variant="secondary"
                  size="default"
                >
                  {{ t("settings.cancel") }}
                </mt-modal-close>
                <mt-modal-action
                  :as="MtButton"
                  variant="critical"
                  size="default"
                  @click="reset"
                >
                  {{ t("settings.reset") }}
                </mt-modal-action>
              </div>
            </template>
          </mt-modal>
        </mt-modal-root>
      </template>
    </mt-card>
  </mt-container>
</template>
