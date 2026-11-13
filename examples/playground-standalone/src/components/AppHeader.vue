<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtBrand,
  MtNav,
  MtUserMenu,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

defineProps<{
  /** Whether the shell shows its mobile layout, from the header slot of `mt-app`. */
  isMobile: boolean;
}>();

const { t } = useI18n();
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
</script>

<template>
  <div class="app-header">
    <mt-brand title="Playground" subtitle="Shopware" :compact="isMobile" />

    <mt-nav orientation="horizontal" :sections="sections" />

    <mt-user-menu
      class="app-header__user"
      name="Jane Doe"
      subtitle="jane.doe@example.com"
      compact
    >
      <mt-action-menu-group>
        <mt-action-menu-item
          icon="regular-cog"
          @select="router.push('/settings')"
        >
          {{ t("nav.settings") }}
        </mt-action-menu-item>
      </mt-action-menu-group>

      <mt-action-menu-group>
        <mt-action-menu-item icon="regular-sign-out" variant="critical">
          {{ t("nav.logout") }}
        </mt-action-menu-item>
      </mt-action-menu-group>
    </mt-user-menu>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: var(--scale-size-24);
  padding-block: var(--scale-size-8);
  margin-inline: var(--scale-size-8);
}

.app-header__user {
  margin-inline-start: auto;
}
</style>
