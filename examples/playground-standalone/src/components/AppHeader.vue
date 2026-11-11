<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  MtActionMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
  MtBrand,
  MtButton,
  MtDropdownMenuPortal,
  MtDropdownMenuRoot,
  MtDropdownMenuTrigger,
  MtIcon,
  MtNav,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";
import AppHeaderPrototype from "../prototypes/AppHeaderPrototype.vue";
import ContextSwitcherPrototype, {
  type ContextSwitcherTeam,
} from "../prototypes/ContextSwitcherPrototype.vue";
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

// Placeholders: the playground has no teams to switch between.
const teams = computed<ContextSwitcherTeam[]>(() => [
  {
    id: "design",
    name: "Design",
    description: t("context.plan", { plan: "Pro" }),
    icon: "regular-sparkles",
    color: "--color-purple-600",
  },
  {
    id: "marketing",
    name: "Marketing",
    description: t("context.plan", { plan: "Pro" }),
    icon: "regular-megaphone",
    color: "--color-pumpkin-500",
  },
  {
    id: "development",
    name: "Development",
    description: t("context.plan", { plan: "Free" }),
    icon: "regular-code",
    color: "--color-brand-500",
  },
]);
const team = ref("marketing");
const currentTeam = computed(() =>
  teams.value.find((option) => option.id === team.value),
);

/** A row is active on its own page and on the pages below it, such as a section of the settings. */
function isActive(item: NavItem) {
  if (typeof item.to !== "string") return false;
  return route.path === item.to || route.path.startsWith(`${item.to}/`);
}
</script>

<template>
  <AppHeaderPrototype>
    <!-- The switcher opens from the bar. In the compact layout it moves into the drawer and the bar
         shows only the logo; otherwise the drawer shows the plain brand. -->
    <template #brand="{ orientation, compact }">
      <ContextSwitcherPrototype
        v-if="(orientation === 'vertical') === compact"
        v-model="team"
        :label="t('context.switch')"
        :teams="teams"
        :create-label="t('context.create')"
        :actions="[
          { id: 'manage', label: t('context.manage'), icon: 'regular-cog' },
          {
            id: 'invite',
            label: t('context.invite'),
            icon: 'regular-user-plus',
          },
        ]"
        :orientation="orientation"
        @action="router.push('/settings/general')"
      />
      <mt-brand
        v-else
        :title="currentTeam?.name ?? ''"
        :subtitle="currentTeam?.description"
        :compact="orientation === 'horizontal'"
      />
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

      <mt-dropdown-menu-root>
        <mt-dropdown-menu-trigger as-child>
          <mt-button
            variant="tertiary"
            size="default"
            square
            :aria-label="t('help.label')"
          >
            <mt-icon
              name="regular-question-circle"
              size="var(--scale-size-16)"
              decorative
            />
          </mt-button>
        </mt-dropdown-menu-trigger>

        <mt-dropdown-menu-portal>
          <!-- Opens at the same height as the user menu. The shortcuts link is a placeholder: the
               docs have no page for the keyboard shortcuts, so it searches them. -->
          <mt-action-menu side="bottom" align="end" :side-offset="4">
            <mt-action-menu-group>
              <mt-action-menu-item
                icon="regular-books"
                link="https://docs.shopware.com/en"
              >
                {{ t("help.documentation") }}
              </mt-action-menu-item>
              <mt-action-menu-item
                icon="regular-headset"
                link="https://account.shopware.com"
              >
                {{ t("help.support") }}
              </mt-action-menu-item>
              <mt-action-menu-item
                icon="regular-keyboard"
                link="https://docs.shopware.com/en/search?q=keyboard+shortcuts"
              >
                {{ t("help.shortcuts") }}
              </mt-action-menu-item>
              <mt-action-menu-item
                icon="regular-gift"
                link="https://www.shopware.com/en/changelog/"
              >
                {{ t("help.whatsNew") }}
              </mt-action-menu-item>
            </mt-action-menu-group>
          </mt-action-menu>
        </mt-dropdown-menu-portal>
      </mt-dropdown-menu-root>
    </template>

    <template #user="{ orientation }">
      <UserMenuPrototype
        name="Jane Doe"
        subtitle="jane.doe@example.com"
        :orientation="orientation"
      >
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
