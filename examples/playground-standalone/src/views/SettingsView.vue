<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  MtCard,
  MtLayout,
  MtNav,
  MtPage,
  MtSelect,
  MtSwitch,
  MtTextField,
  MtThemeSelect,
  useTheme,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

const sectionIds = ["general", "account", "notifications"] as const;
type SectionId = (typeof sectionIds)[number];

const props = defineProps<{
  /** The section in the URL. Without one, the page shows the first. */
  section?: string;
}>();

const { t, locale } = useI18n();
const { theme } = useTheme();

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

// Placeholder content: these settings aren't saved anywhere.
const name = ref("Jane Doe");
const email = ref("jane.doe@example.com");
const notifications = ref({ orders: true, report: true, news: false });
</script>

<template>
  <mt-page width="m" :breadcrumb="breadcrumb">
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

      <mt-card v-else>
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
    </mt-layout>
  </mt-page>
</template>

<style scoped>
.settings-fields {
  display: grid;
  gap: var(--scale-size-16);
}
</style>
