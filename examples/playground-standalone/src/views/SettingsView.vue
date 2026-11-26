<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtAppPanelTrigger,
  MtCard,
  MtLayout,
  MtNav,
  MtPage,
  MtSelect,
  MtSwitch,
  MtTextField,
  MtThemeSelect,
  useAppRegions,
  useTheme,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";
import { useLayoutSettings } from "../composables/useLayoutSettings";

const sectionIds = ["general", "account", "notifications", "layout"] as const;
type SectionId = (typeof sectionIds)[number];

const props = defineProps<{
  /** The section in the URL. Without one, the page shows the first. */
  section?: string;
}>();

const { t, locale } = useI18n();
const { theme } = useTheme();
const layout = useLayoutSettings();

useAppRegions(() => (layout.settingsHideHeader ? { header: false } : {}));

const current = computed<SectionId>(
  () => sectionIds.find((id) => id === props.section) ?? "general",
);

const sections = computed<NavSection[]>(() => [
  {
    items: sectionIds.map((id) => ({
      id,
      label: t(`settings.sections.${id}`),
      to: `/settings/${id}`,
    })),
  },
]);

function isActive(item: NavItem) {
  return item.id === current.value;
}

const breadcrumb = computed(() => [
  { label: t("settings.title"), icon: "cog", to: "/settings" },
  { label: t(`settings.sections.${current.value}`) },
]);

// Each language is named in itself, so everyone finds their own.
const localeOptions = [
  { label: "English", value: "en" },
  { label: "Deutsch", value: "de" },
];

const headerOptions = computed(() => [
  { label: "mt-app-header", value: "app-header" },
  { label: t("settings.layout.customHeader"), value: "custom" },
  { label: t("settings.layout.off"), value: "off" },
]);

const panelOptions = computed(() => [
  { label: t("settings.layout.off"), value: "off" },
  { label: t("settings.layout.open"), value: "open" },
  { label: t("settings.layout.closable"), value: "closable" },
]);

// Placeholder content: these settings aren't saved anywhere.
const name = ref("Jane Doe");
const email = ref("jane.doe@example.com");
const notifications = ref({ orders: true, report: true, news: false });
</script>

<template>
  <!-- Without mt-page, only the header shows the triggers, unless the view adds them itself. -->
  <component
    :is="layout.settingsInPage ? MtPage : 'div'"
    v-bind="
      layout.settingsInPage
        ? { width: 'm', breadcrumb }
        : { class: 'settings-without-page' }
    "
  >
    <div
      v-if="!layout.settingsInPage && layout.settingsPanelTriggers"
      class="settings-triggers"
    >
      <mt-app-panel-trigger panel="navigation" />
      <mt-app-panel-trigger panel="sidebar" class="settings-triggers__end" />
    </div>

    <mt-layout>
      <template #start>
        <mt-nav
          :sections="sections"
          :is-active="isActive"
          :label="t('settings.title')"
        />
      </template>

      <mt-card v-if="current === 'general'">
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

      <mt-card v-else-if="current === 'account'">
        <div class="settings-fields">
          <mt-text-field v-model="name" :label="t('settings.name')" />
          <mt-text-field v-model="email" :label="t('settings.email')" />
        </div>
      </mt-card>

      <mt-card v-else-if="current === 'notifications'">
        <div class="settings-fields">
          <mt-switch
            v-model="notifications.orders"
            :label="t('settings.notifications.orders')"
          />
          <mt-switch
            v-model="notifications.report"
            :label="t('settings.notifications.report')"
          />
          <mt-switch
            v-model="notifications.news"
            :label="t('settings.notifications.news')"
          />
        </div>
      </mt-card>

      <template v-else>
        <mt-card :title="t('settings.layout.shell')">
          <div class="settings-fields">
            <mt-select
              v-model="layout.header"
              :label="t('settings.layout.header')"
              :options="headerOptions"
              :enable-search="false"
              hide-clearable-button
            />
            <mt-switch
              v-model="layout.customHeaderNavigationTrigger"
              :label="t('settings.layout.customHeaderNavigationTrigger')"
              :disabled="layout.header !== 'custom'"
            />
            <mt-switch
              v-model="layout.customHeaderSidebarTrigger"
              :label="t('settings.layout.customHeaderSidebarTrigger')"
              :disabled="layout.header !== 'custom'"
            />
            <mt-select
              v-model="layout.navigation"
              :label="t('settings.layout.navigation')"
              :options="panelOptions"
              :enable-search="false"
              hide-clearable-button
            />
            <mt-select
              v-model="layout.sidebar"
              :label="t('settings.layout.sidebar')"
              :options="panelOptions"
              :enable-search="false"
              hide-clearable-button
            />
          </div>
        </mt-card>

        <mt-card
          :title="t('settings.layout.thisPage')"
          :subtitle="t('settings.layout.thisPageHint')"
        >
          <div class="settings-fields">
            <mt-switch
              v-model="layout.settingsInPage"
              :label="t('settings.layout.inPage')"
            />
            <mt-switch
              v-model="layout.settingsPanelTriggers"
              :label="t('settings.layout.panelTriggers')"
              :disabled="layout.settingsInPage"
            />
            <mt-switch
              v-model="layout.settingsHideHeader"
              :label="t('settings.layout.hideHeader')"
            />
          </div>
        </mt-card>
      </template>
    </mt-layout>
  </component>
</template>

<style scoped>
.settings-fields {
  display: grid;
  gap: var(--scale-size-16);
}

.settings-without-page {
  padding: var(--scale-size-24);
}

.settings-triggers {
  display: flex;
  align-items: center;
  margin-block-end: var(--scale-size-16);
}

.settings-triggers__end {
  margin-inline-start: auto;
}
</style>
