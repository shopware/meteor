<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  MtButton,
  MtCard,
  MtContainer,
  MtModal,
  MtModalClose,
  MtModalRoot,
  MtModalTrigger,
  MtSelect,
  MtSwitch,
  MtText,
  MtThemeSelect,
  useSnackbar,
  useTheme,
} from "@shopware-ag/meteor-component-library";
import { settings } from "../store/settings";

const { t } = useI18n();
const { addSnackbar } = useSnackbar();

const { theme } = useTheme();

const localeOptions = [
  { label: "English", value: "en" },
  { label: "Deutsch", value: "de" },
];
</script>

<template>
  <div class="page">
    <mt-container size="s" class="page__content">
      <mt-card :title="t('settings.userTitle')">
        <div class="settings-form">
          <mt-select
            v-model="settings.locale"
            :label="t('settings.language')"
            :options="localeOptions"
            :enable-search="false"
            hide-clearable-button
          />
          <mt-theme-select v-model="theme" :label="t('settings.theme')" />
        </div>
      </mt-card>

      <mt-card :title="t('settings.shellTitle')">
        <div class="settings-form">
          <mt-switch v-model="settings.header" :label="t('settings.header')" />
          <mt-switch
            v-model="settings.sidebarStart"
            :label="t('settings.sidebarStart')"
          />
          <mt-switch
            v-model="settings.sidebarEnd"
            :label="t('settings.sidebarEnd')"
          />
        </div>

        <template #footer>
          <div class="settings-actions">
            <mt-modal-root>
              <mt-modal-trigger
                :as="MtButton"
                variant="secondary"
                size="default"
              >
                {{ t("settings.openModal") }}
              </mt-modal-trigger>

              <mt-modal :title="t('settings.modalTitle')">
                <mt-text size="xs">{{ t("settings.modalText") }}</mt-text>

                <template #footer>
                  <mt-modal-close
                    :as="MtButton"
                    variant="secondary"
                    size="default"
                  >
                    {{ t("settings.close") }}
                  </mt-modal-close>
                </template>
              </mt-modal>
            </mt-modal-root>

            <mt-button
              variant="secondary"
              size="default"
              @click="
                addSnackbar({
                  message: t('settings.notification'),
                  variant: 'success',
                })
              "
            >
              {{ t("settings.showNotification") }}
            </mt-button>
          </div>
        </template>
      </mt-card>
    </mt-container>
  </div>
</template>

<style scoped>
.settings-form {
  display: grid;
  gap: var(--scale-size-16);
}

.settings-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--scale-size-8);
}
</style>
