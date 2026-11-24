<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtAvatar,
  MtButton,
  MtCard,
  MtCheckbox,
  MtEmailField,
  MtModal,
  MtModalAction,
  MtModalClose,
  MtModalRoot,
  MtModalTrigger,
  MtNumberField,
  MtPage,
  MtPasswordField,
  MtSelect,
  MtSwitch,
  MtTabs,
  MtText,
  MtTextField,
  MtThemeSelect,
  useSnackbar,
  useTheme,
} from "@shopware-ag/meteor-component-library";
import { useBreadcrumb } from "../composables/useBreadcrumb";
import { useCurrentUser } from "../composables/useCurrentUser";
import {
  resetLayoutSettings,
  useLayoutSettings,
} from "../composables/useLayoutSettings";

const { t, locale } = useI18n();
const breadcrumb = useBreadcrumb(() => t("profile.title"));
const { theme } = useTheme();
const { addSnackbar } = useSnackbar();
const layout = useLayoutSettings();
const user = useCurrentUser();

const activeTab = ref("general");

const tabs = computed(() =>
  (["general", "search", "privacy"] as const).map((name) => ({
    name,
    label: t(`profile.tabs.${name}`),
  })),
);

const profile = ref({
  firstName: user.firstName,
  lastName: user.lastName,
  username: "admin",
  email: user.email,
  timezone: "Europe/Berlin",
  moduleColors: "neutral",
  minSearchLength: 2,
  usageData: true,
});

const localeOptions = [
  { label: "English", value: "en" },
  { label: "Deutsch", value: "de" },
];

const timezoneOptions = [
  "Europe/Berlin",
  "Europe/London",
  "Europe/Amsterdam",
  "America/New_York",
  "UTC",
].map((value) => ({ value, label: value }));

const moduleColorOptions = computed(() => [
  { value: "neutral", label: t("profile.moduleColors.neutral") },
  { value: "colored", label: t("profile.moduleColors.colored") },
]);

/** The searchable entities and their fields, as in the search preferences. */
const searchable = ref([
  {
    key: "product",
    checked: true,
    fields: ["ean", "name", "tags", "productNumber", "manufacturerNumber"],
  },
  {
    key: "customer",
    checked: true,
    fields: ["email", "company", "firstName", "lastName", "customerNumber"],
  },
  { key: "order", checked: true, fields: ["orderNumber", "tags"] },
  { key: "category", checked: true, fields: ["name", "tags"] },
]);

function setAllSearchable(value: boolean) {
  searchable.value.forEach((entity) => (entity.checked = value));
}

function save() {
  addSnackbar({ message: t("profile.saved"), variant: "success" });
}

function reset(close: () => void) {
  locale.value = "en";
  theme.value = "system";
  resetLayoutSettings();
  close();
  addSnackbar({ message: t("profile.playground.resetDone"), variant: "success" });
}
</script>

<template>
  <mt-page width="m" :breadcrumb="breadcrumb">
    <template #actions>
      <mt-button variant="primary" size="default" @click="save">
        {{ t("common.save") }}
      </mt-button>
    </template>

    <div class="stack">
      <mt-tabs
        :items="tabs"
        :default-item="activeTab"
        @new-item-active="activeTab = $event"
      />

      <template v-if="activeTab === 'general'">
        <mt-card :title="t('profile.cards.information')">
          <div class="stack">
            <div class="form-row">
              <mt-text-field
                v-model="profile.firstName"
                :label="t('profile.fields.firstName')"
              />
              <mt-text-field
                v-model="profile.lastName"
                :label="t('profile.fields.lastName')"
              />
              <mt-text-field
                v-model="profile.username"
                :label="t('profile.fields.username')"
              />
              <mt-email-field
                v-model="profile.email"
                :label="t('profile.fields.email')"
                required
              />
            </div>

            <div class="profile__picture">
              <mt-avatar
                size="l"
                :first-name="profile.firstName"
                :last-name="profile.lastName"
              />
              <div class="stack profile__picture-text">
                <mt-text size="xs" weight="semibold">
                  {{ t("profile.fields.picture") }}
                </mt-text>
                <div class="cluster">
                  <mt-button variant="secondary" size="small">
                    {{ t("products.uploadFile") }}
                  </mt-button>
                  <mt-button variant="secondary" size="small">
                    {{ t("products.openMedia") }}
                  </mt-button>
                </div>
              </div>
            </div>
          </div>
        </mt-card>

        <mt-card :title="t('profile.cards.interface')">
          <div class="form-row">
            <mt-select
              v-model="locale"
              :label="t('profile.fields.language')"
              :options="localeOptions"
              :enable-search="false"
              hide-clearable-button
            />
            <mt-select
              v-model="profile.timezone"
              :label="t('profile.fields.timezone')"
              :options="timezoneOptions"
              hide-clearable-button
              required
            />
            <mt-theme-select
              v-model="theme"
              :label="t('profile.fields.appearance')"
            />
            <mt-select
              v-model="profile.moduleColors"
              :label="t('profile.fields.moduleColors')"
              :options="moduleColorOptions"
              :enable-search="false"
              hide-clearable-button
            />
          </div>
        </mt-card>

        <mt-card :title="t('profile.cards.password')">
          <div class="form-row">
            <mt-password-field
              :label="t('profile.fields.newPassword')"
              :placeholder="t('profile.placeholders.newPassword')"
            />
            <mt-password-field
              :label="t('profile.fields.confirmPassword')"
              :placeholder="t('profile.placeholders.confirmPassword')"
            />
          </div>
        </mt-card>

        <mt-card
          :title="t('profile.playground.title')"
          :subtitle="t('profile.playground.subtitle')"
        >
          <template #headerRight>
            <mt-modal-root>
              <mt-modal-trigger :as="MtButton" variant="secondary" size="small">
                {{ t("profile.playground.reset") }}
              </mt-modal-trigger>

              <mt-modal :title="t('profile.playground.resetTitle')" width="s">
                <mt-text size="xs">{{ t("profile.playground.resetText") }}</mt-text>

                <template #footer>
                  <div class="actions">
                    <mt-modal-close
                      :as="MtButton"
                      variant="secondary"
                      size="default"
                    >
                      {{ t("common.cancel") }}
                    </mt-modal-close>
                    <mt-modal-action
                      :as="MtButton"
                      variant="critical"
                      size="default"
                      @click="reset"
                    >
                      {{ t("profile.playground.reset") }}
                    </mt-modal-action>
                  </div>
                </template>
              </mt-modal>
            </mt-modal-root>
          </template>

          <div class="stack">
            <mt-switch
              v-model="layout.navigationClosable"
              :label="t('profile.playground.navigationClosable')"
            />
            <mt-switch
              v-model="layout.sidebarClosable"
              :label="t('profile.playground.sidebarClosable')"
            />
          </div>
        </mt-card>
      </template>

      <template v-else-if="activeTab === 'search'">
        <mt-card
          :title="t('profile.cards.searchBehavior')"
          :subtitle="t('profile.cards.searchBehaviorSubtitle')"
        >
          <div class="form-row">
            <mt-number-field
              v-model="profile.minSearchLength"
              :label="t('profile.fields.minSearchLength')"
              number-type="int"
              :min="1"
              :max="10"
            />
          </div>
        </mt-card>

        <mt-card
          :title="t('profile.cards.searchableContent')"
          :subtitle="t('profile.cards.searchableContentSubtitle')"
        >
          <div class="stack">
            <div class="cluster">
              <mt-button
                variant="secondary"
                size="small"
                @click="setAllSearchable(true)"
              >
                {{ t("profile.selectAll") }}
              </mt-button>
              <mt-button
                variant="secondary"
                size="small"
                @click="setAllSearchable(false)"
              >
                {{ t("profile.deselectAll") }}
              </mt-button>
              <mt-button
                variant="secondary"
                size="small"
                @click="setAllSearchable(true)"
              >
                {{ t("profile.resetDefault") }}
              </mt-button>
            </div>

            <div v-for="entity in searchable" :key="entity.key" class="profile__entity">
              <mt-checkbox
                v-model="entity.checked"
                :label="t(`profile.entities.${entity.key}`)"
              />
              <div class="profile__fields">
                <mt-checkbox
                  v-for="field in entity.fields"
                  :key="field"
                  :model-value="entity.checked"
                  :label="t(`profile.searchFields.${field}`)"
                  :disabled="!entity.checked"
                />
              </div>
            </div>
          </div>
        </mt-card>
      </template>

      <mt-card v-else :title="t('profile.cards.privacy')">
        <div class="stack">
          <p class="card-text">{{ t("profile.privacy.intro") }}</p>
          <div class="profile__consent">
            <mt-switch
              v-model="profile.usageData"
              :label="t('profile.privacy.usageData')"
            />
            <p class="card-text">{{ t("profile.privacy.usageDataText") }}</p>
          </div>
          <ul class="profile__promises">
            <li v-for="promise in ['gdpr', 'secure', 'noSharing']" :key="promise">
              <mt-text size="xs">✓ {{ t(`profile.privacy.${promise}`) }}</mt-text>
            </li>
          </ul>
        </div>
      </mt-card>
    </div>
  </mt-page>
</template>

<style scoped>
.profile__picture {
  display: flex;
  align-items: center;
  gap: var(--scale-size-16);
}

.profile__picture-text {
  gap: var(--scale-size-8);
}

.profile__entity {
  display: grid;
  gap: var(--scale-size-8);
  padding-block-end: var(--scale-size-16);
  border-block-end: 1px solid var(--color-border-secondary-default);
}

.profile__fields {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: var(--scale-size-4) var(--scale-size-16);
  padding-inline-start: var(--scale-size-24);
}

.profile__consent {
  display: grid;
  gap: var(--scale-size-8);
  padding: var(--scale-size-16);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
}

.profile__promises {
  display: grid;
  gap: var(--scale-size-8);
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
