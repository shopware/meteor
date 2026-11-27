<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView, useRoute } from "vue-router";
import {
  MtContentHeader,
  MtLayout,
  MtNav,
  MtPage,
  type NavSection,
} from "@shopware-ag/meteor-component-library";
import { settingsSections } from "../data/settings";

const { t } = useI18n();
const route = useRoute();

// Each section is a route of its own, which the page shows next to the navigation.
const navigation = computed<NavSection[]>(() => [
  {
    items: settingsSections.map(({ id, icon }) => ({
      id,
      label: t(`settings.sections.${id}`),
      icon,
      to: { name: "settings-section", params: { section: id } },
      active: route.params.section === id,
    })),
  },
]);
</script>

<template>
  <mt-page width="m">
    <div class="settings">
      <mt-content-header :title="t('settings.title')" />

      <mt-layout>
        <!-- Next to the settings on a wide page, above them on a narrow one. -->
        <template #start>
          <mt-nav :sections="navigation" :label="t('settings.title')" />
        </template>

        <RouterView />
      </mt-layout>
    </div>
  </mt-page>
</template>

<style scoped>
.settings {
  display: grid;
  gap: var(--scale-size-40);
}
</style>
