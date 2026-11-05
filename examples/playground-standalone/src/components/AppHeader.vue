<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtBrand,
  MtButton,
  MtIcon,
  MtNav,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";
import AppHeaderPrototype from "../prototypes/AppHeaderPrototype.vue";
import UserMenuPrototype from "../prototypes/UserMenuPrototype.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const sections = computed<NavSection[]>(() => [
  {
    items: [
      { id: "home", label: t("nav.home"), icon: "regular-home", to: "/" },
      {
        id: "editor",
        label: t("nav.editor"),
        icon: "regular-file-edit",
        to: "/editor",
      },
      {
        id: "docs",
        label: t("nav.docs"),
        icon: "regular-books",
        to: "/pages/getting-started",
      },
      {
        id: "release-notes",
        label: t("nav.releaseNotes"),
        icon: "regular-megaphone",
        to: "/pages/release-notes",
      },
      {
        id: "settings",
        label: t("nav.settings"),
        icon: "regular-cog",
        children: ["general", "account", "notifications"].map((section) => ({
          id: section,
          label: t(`settings.sections.${section}`),
          to: `/settings/${section}`,
        })),
      },
    ],
  },
]);

/** A row is active on its own page and on the pages below it, such as a section of the settings. */
function isActive(item: NavItem) {
  if (typeof item.to !== "string") return false;
  return route.path === item.to || route.path.startsWith(`${item.to}/`);
}
</script>

<template>
  <AppHeaderPrototype>
    <template #brand="{ compact }">
      <mt-brand title="Playground" subtitle="Shopware" :compact="compact" />
    </template>

    <template #navigation="{ orientation }">
      <mt-nav
        :orientation="orientation"
        :sections="sections"
        :is-active="isActive"
      />
    </template>

    <template #actions>
      <!-- Placeholders: there is no search and there are no notifications yet. -->
      <mt-button
        variant="tertiary"
        size="default"
        square
        :aria-label="t('nav.search')"
      >
        <mt-icon name="regular-search" size="var(--scale-size-16)" decorative />
      </mt-button>

      <mt-button
        variant="tertiary"
        size="default"
        square
        :aria-label="t('nav.notifications')"
      >
        <mt-icon name="regular-bell" size="var(--scale-size-16)" decorative />
      </mt-button>

      <UserMenuPrototype name="Jane Doe" subtitle="jane.doe@example.com">
        <mt-action-menu-group>
          <mt-action-menu-item
            icon="regular-cog"
            @select="router.push('/settings/general')"
          >
            {{ t("nav.settings") }}
          </mt-action-menu-item>
          <mt-action-menu-item
            icon="regular-user"
            @select="router.push('/settings/account')"
          >
            {{ t("settings.sections.account") }}
          </mt-action-menu-item>
        </mt-action-menu-group>

        <mt-action-menu-group>
          <mt-action-menu-item icon="regular-sign-out" variant="critical">
            {{ t("nav.logout") }}
          </mt-action-menu-item>
        </mt-action-menu-group>
      </UserMenuPrototype>
    </template>
  </AppHeaderPrototype>
</template>
