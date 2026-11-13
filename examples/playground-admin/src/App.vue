<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";
import {
  MtAnnouncement,
  MtApp,
  MtPanel,
} from "@shopware-ag/meteor-component-library";
import AppConfirmModal from "./components/AppConfirmModal.vue";
import AppNav from "./components/AppNav.vue";
import AppSidebar from "./components/AppSidebar.vue";
import { useClosedAnnouncement } from "./composables/useClosedAnnouncement";
import { useLayoutSettings } from "./composables/useLayoutSettings";

const { t } = useI18n();
const layout = useLayoutSettings();
const { isClosed: isAnnouncementClosed, close: closeAnnouncement } =
  useClosedAnnouncement("maintenance-2026-11-16");
</script>

<template>
  <mt-app loading-bar>
    <template #banner>
      <mt-announcement
        v-if="!isAnnouncementClosed"
        variant="critical"
        icon="solid-exclamation-triangle"
        closable
        @close="closeAnnouncement"
      >
        {{ t("banner.maintenance") }}
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
