<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView, useRoute } from "vue-router";
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtApp,
  MtAppHeader,
  MtAppPanelTrigger,
  MtAppSidebar,
  MtBrand,
  MtButton,
  MtIcon,
  MtNav,
  MtPanel,
  MtScrollArea,
  MtUserMenu,
  type NavSection,
} from "@shopware-ag/meteor-component-library";
import AppChat from "./components/AppChat.vue";
import { useLayoutSettings } from "./composables/useLayoutSettings";

const { t } = useI18n();
const route = useRoute();
const layout = useLayoutSettings();

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
        children: ["general", "account", "notifications", "layout"].map(
          (section) => ({
            label: t(`settings.sections.${section}`),
            to: `/settings/${section}`,
            active: route.path === `/settings/${section}`,
          }),
        ),
      },
    ],
  },
]);
</script>

<template>
  <!-- Settings > Layout picks what fills the shell's slots, to try where it shows the triggers. -->
  <mt-app loading-bar>
    <template v-if="layout.header !== 'off'" #header>
      <mt-app-header v-if="layout.header === 'app-header'" :sections="sections">
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

      <div v-else class="custom-header">
        <mt-app-panel-trigger
          v-if="layout.customHeaderNavigationTrigger"
          panel="navigation"
        />
        <mt-brand title="Playground" subtitle="Shopware" size="xs" />
        <mt-scroll-area orientation="horizontal" class="custom-header__nav">
          <mt-nav orientation="horizontal" :sections="sections" />
        </mt-scroll-area>
        <mt-app-panel-trigger
          v-if="layout.customHeaderSidebarTrigger"
          panel="sidebar"
        />
      </div>
    </template>

    <template v-if="layout.navigation !== 'off'" #navigation>
      <mt-panel
        :label="t('nav.navigation')"
        :closable="layout.navigation === 'closable'"
        resizable
      >
        <mt-app-sidebar :sections="sections">
          <template #start>
            <mt-brand title="Playground" subtitle="Shopware" />
          </template>

          <template #end>
            <mt-user-menu name="Jane Doe" subtitle="jane.doe@example.com">
              <mt-action-menu-group>
                <mt-action-menu-item icon="regular-sign-out" variant="critical">
                  {{ t("nav.logout") }}
                </mt-action-menu-item>
              </mt-action-menu-group>
            </mt-user-menu>
          </template>
        </mt-app-sidebar>
      </mt-panel>
    </template>

    <RouterView />

    <template v-if="layout.sidebar !== 'off'" #sidebar>
      <mt-panel
        :label="t('copilot.title')"
        icon="regular-shopware-copilot"
        :closable="layout.sidebar === 'closable'"
        resizable
      >
        <AppChat />
      </mt-panel>
    </template>
  </mt-app>
</template>

<style scoped>
.custom-header {
  display: flex;
  align-items: center;
  gap: var(--scale-size-16);
  min-height: var(--scale-size-64);
  padding-inline: var(--scale-size-10);
}

.custom-header__nav {
  flex: 1 1 auto;
  min-width: 0;
}
</style>
