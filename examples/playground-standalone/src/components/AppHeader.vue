<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  useTheme,
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
import CommandPalettePrototype, {
  type CommandPaletteGroup,
} from "../prototypes/CommandPalettePrototype.vue";
import InboxPrototype from "../prototypes/InboxPrototype.vue";
import { automations } from "../data/automations";
import { integrations } from "../data/integrations";
import { members } from "../data/members";
import { notifications, type Notification } from "../data/notifications";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const sections = computed<NavSection[]>(() => [
  {
    items: [
      { id: "home", label: t("nav.home"), icon: "regular-home", to: "/" },
      {
        id: "automations",
        label: t("nav.automations"),
        icon: "regular-flow",
        to: "/automations",
      },
      {
        id: "integrations",
        label: t("nav.integrations"),
        icon: "regular-plug",
        to: "/integrations",
      },
      {
        id: "members",
        label: t("nav.members"),
        icon: "regular-users",
        to: "/members",
      },
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
    icon: "regular-sparkles",
    color: "--color-purple-600",
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: "regular-megaphone",
    color: "--color-pumpkin-500",
  },
  {
    id: "development",
    name: "Development",
    icon: "regular-code",
    color: "--color-brand-500",
  },
]);
const team = ref("marketing");
const currentTeam = computed(() =>
  teams.value.find((option) => option.id === team.value),
);

// Placeholder: the notifications live only as long as the page.
const inbox = ref<Notification[]>(structuredClone(notifications));

/** The actions of the inbox lead to the automations that need attention. */
function openNotification() {
  router.push({ name: "automations", query: { attention: "1" } });
}

const { resolvedTheme, setTheme } = useTheme();

/** Pages come from the navigation; the other results open their page with a search for them. */
const paletteGroups = computed<CommandPaletteGroup[]>(() => {
  const pages = sections.value.flatMap((section) =>
    section.items.flatMap((item: NavItem): NavItem[] =>
      "children" in item && item.children
        ? item.children.map((child: NavItem) => ({
            ...child,
            label: `${item.label} › ${child.label}`,
            icon: item.icon,
          }))
        : [item],
    ),
  );

  const search = (name: string, q: string) => () =>
    router.push({ name, query: { q } });

  return [
    {
      id: "pages",
      label: t("palette.groups.pages"),
      showWithoutQuery: true,
      items: pages.map((page) => ({
        id: `page-${page.id}`,
        label: page.label,
        icon: page.icon ?? "regular-file-text",
        run: () => router.push(String("to" in page ? page.to : "/")),
      })),
    },
    {
      id: "actions",
      label: t("palette.groups.actions"),
      showWithoutQuery: true,
      items: [
        {
          id: "create-automation",
          label: t("palette.actions.createAutomation"),
          icon: "regular-plus-circle",
          run: () => router.push({ name: "automations" }),
        },
        {
          id: "invite-member",
          label: t("palette.actions.inviteMember"),
          icon: "regular-user-plus",
          run: () => router.push({ name: "members", query: { invite: "1" } }),
        },
        {
          id: "toggle-theme",
          label: t("palette.actions.toggleTheme"),
          icon: resolvedTheme.value === "dark" ? "regular-sun" : "regular-moon",
          run: () =>
            setTheme(resolvedTheme.value === "dark" ? "light" : "dark"),
        },
      ],
    },
    {
      id: "automations",
      label: t("palette.groups.automations"),
      items: automations.map((automation) => ({
        id: automation.id,
        label: automation.name,
        icon: "regular-flow",
        run: search("automations", automation.name),
      })),
    },
    {
      id: "integrations",
      label: t("palette.groups.integrations"),
      items: integrations.map((integration) => ({
        id: integration.id,
        label: integration.name,
        icon: integration.icon,
        run: search("integrations", integration.name),
      })),
    },
    {
      id: "members",
      label: t("palette.groups.members"),
      items: members.map((member) => ({
        id: member.id,
        label: member.name,
        icon: "regular-user",
        run: search("members", member.name),
      })),
    },
  ];
});

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
        @action="
          router.push({
            name: 'members',
            query: $event === 'invite' ? { invite: '1' } : {},
          })
        "
      />
      <mt-brand
        v-else
        :title="currentTeam?.name ?? ''"
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
      <CommandPalettePrototype :groups="paletteGroups" />

      <InboxPrototype v-model="inbox" @open="openNotification" />

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
