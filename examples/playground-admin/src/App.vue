<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";
import {
  MtAnnouncement,
  MtApp,
  MtPanel,
} from "@shopware-ag/meteor-component-library";
import AppConfirmModal from "./components/AppConfirmModal.vue";
import AppNav from "./components/AppNav.vue";
import AppProtoColorsToggle from "./components/AppProtoColorsToggle.vue";
import AppSidebar from "./components/AppSidebar.vue";
import { useClosedAnnouncements } from "./composables/useClosedAnnouncements";
import { useThemeShortcut } from "./composables/useThemeShortcut";
import {
  useLayoutSettings,
  type AnnouncementVariant,
} from "./composables/useLayoutSettings";

const { t } = useI18n();
useThemeShortcut();
const layout = useLayoutSettings();
const { isClosed, close } = useClosedAnnouncements();

const announcementIcons: Record<AnnouncementVariant, string> = {
  neutral: "solid-calendar",
  info: "solid-megaphone",
  attention: "solid-tools",
  critical: "solid-exclamation-circle",
  positive: "solid-check-circle",
};

// Changing the variant or the appearance in the settings shows a closed announcement again.
const announcementId = computed(
  () => `${layout.announcementVariant}-${layout.announcementAppearance}`,
);
</script>

<template>
  <mt-app loading-bar>
    <template #announcement>
      <mt-announcement
        v-if="layout.announcementShown && !isClosed(announcementId)"
        :variant="layout.announcementVariant"
        :appearance="layout.announcementAppearance"
        :icon="announcementIcons[layout.announcementVariant]"
        :closable="layout.announcementVariant !== 'critical'"
        @close="close(announcementId)"
      >
        {{ t(`announcement.${layout.announcementVariant}`) }}
      </mt-announcement>
    </template>

    <template #navigation>
      <mt-panel
        :label="t('nav.label')"
        :closable="layout.navigationClosable"
        resizable
      >
        <AppNav />
      </mt-panel>
    </template>

    <RouterView />
    <AppConfirmModal />
    <AppProtoColorsToggle />

    <template #sidebar>
      <mt-panel
        :label="t('sidebar.label')"
        icon="regular-shopware-copilot"
        :closable="layout.sidebarClosable"
        resizable
        :max-width="560"
      >
        <AppSidebar />
      </mt-panel>
    </template>
  </mt-app>
</template>
