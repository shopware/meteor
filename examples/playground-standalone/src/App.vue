<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView, useRoute } from "vue-router";
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtApp,
  MtAppHeader,
  MtBrand,
  MtButton,
  MtIcon,
  MtPanel,
  MtUserMenu,
  type NavSection,
} from "@shopware-ag/meteor-component-library";
import AppChat from "./components/AppChat.vue";

const { t } = useI18n();
const route = useRoute();

const sections = computed<NavSection[]>(() => [
  {
    items: [
      {
        label: t("nav.home"),
        icon: "regular-home",
        to: "/",
        active: route.path === "/",
      },
      {
        label: t("nav.editor"),
        icon: "regular-file-edit",
        to: "/editor",
        active: route.path === "/editor",
      },
      {
        label: t("nav.docs"),
        icon: "regular-books",
        to: "/pages/getting-started",
        active: route.path === "/pages/getting-started",
      },
      {
        label: t("nav.releaseNotes"),
        icon: "regular-megaphone",
        to: "/pages/release-notes",
        active: route.path === "/pages/release-notes",
      },
      {
        label: t("nav.settings"),
        icon: "regular-cog",
        children: ["general", "account", "notifications"].map((section) => ({
          label: t(`settings.sections.${section}`),
          to: `/settings/${section}`,
          active: route.path === `/settings/${section}`,
        })),
      },
    ],
  },
]);
</script>

<template>
  <mt-app loading-bar>
    <template #header>
      <mt-app-header :sections="sections">
        <template #start="{ isMobile }">
          <mt-brand
            title="Playground"
            subtitle="Shopware"
            :size="isMobile ? 's' : 'xs'"
          />
        </template>

        <template #actions>
          <mt-button
            variant="tertiary"
            size="default"
            square
            :aria-label="t('nav.help')"
          >
            <template #iconFront>
              <mt-icon
                name="regular-question-circle"
                size="var(--scale-size-16)"
                decorative
              />
            </template>
          </mt-button>

          <mt-button
            variant="tertiary"
            size="default"
            square
            :aria-label="t('nav.notifications')"
          >
            <template #iconFront>
              <mt-icon
                name="regular-bell"
                size="var(--scale-size-16)"
                decorative
              />
            </template>
          </mt-button>
        </template>

        <template #end="{ isMobile }">
          <mt-user-menu
            name="Jane Doe"
            subtitle="jane.doe@example.com"
            :compact="!isMobile"
          >
            <mt-action-menu-group>
              <mt-action-menu-item icon="regular-sign-out" variant="critical">
                {{ t("nav.logout") }}
              </mt-action-menu-item>
            </mt-action-menu-group>
          </mt-user-menu>
        </template>
      </mt-app-header>
    </template>

    <RouterView />

    <template #sidebar>
      <mt-panel
        :label="t('copilot.title')"
        icon="regular-shopware-copilot"
        closable
        resizable
      >
        <AppChat />
      </mt-panel>
    </template>
  </mt-app>
</template>
