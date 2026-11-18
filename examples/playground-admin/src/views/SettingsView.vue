<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtButton,
  MtCard,
  MtModal,
  MtModalAction,
  MtModalClose,
  MtModalRoot,
  MtModalTrigger,
  MtPage,
  MtSelect,
  MtSwitch,
  MtText,
  MtThemeSelect,
  useSnackbar,
  useTheme,
} from "@shopware-ag/meteor-component-library";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { resetClosedAnnouncements } from "../composables/useClosedAnnouncements";
import {
  resetLayoutSettings,
  useLayoutSettings,
} from "../composables/useLayoutSettings";

const { t, locale } = useI18n();
const breadcrumb = useBreadcrumb(() => t("settings.title"));
const { theme } = useTheme();
const { addSnackbar } = useSnackbar();
const layout = useLayoutSettings();

const announcementVariantOptions = computed(() =>
  (["neutral", "info", "attention", "critical", "positive"] as const).map(
    (value) => ({ label: t(`settings.announcementVariants.${value}`), value }),
  ),
);

const localeOptions = [
  { label: "English", value: "en" },
  { label: "Deutsch", value: "de" },
];

function reset(close: () => void) {
  locale.value = "en";
  theme.value = "system";
  resetLayoutSettings();
  resetClosedAnnouncements();
  close();
  addSnackbar({ message: t("settings.resetDone"), variant: "success" });
}
</script>

<template>
  <mt-page width="s" :breadcrumb="breadcrumb">
    <template #actions>
      <mt-modal-root>
        <mt-modal-trigger :as="MtButton" variant="secondary" size="default">
          {{ t("settings.reset") }}
        </mt-modal-trigger>

        <mt-modal :title="t('settings.resetTitle')" width="s">
          <mt-text size="xs">{{ t("settings.resetText") }}</mt-text>

          <template #footer>
            <div class="actions">
              <mt-modal-close :as="MtButton" variant="secondary" size="default">
                {{ t("common.cancel") }}
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

    <mt-card>
      <div class="stack">
        <mt-select
          v-model="locale"
          :label="t('settings.language')"
          :options="localeOptions"
          :enable-search="false"
          hide-clearable-button
        />
        <mt-theme-select v-model="theme" :label="t('settings.theme')" />
        <mt-switch
          v-model="layout.navigationClosable"
          :label="t('settings.navigationClosable')"
        />
        <mt-switch
          v-model="layout.sidebarClosable"
          :label="t('settings.sidebarClosable')"
        />
        <mt-switch
          v-model="layout.announcementShown"
          :label="t('settings.announcementShown')"
        />
        <mt-select
          v-model="layout.announcementVariant"
          :label="t('settings.announcementVariant')"
          :options="announcementVariantOptions"
          :enable-search="false"
          hide-clearable-button
        />
      </div>
    </mt-card>
  </mt-page>
</template>
