<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView, useRoute } from "vue-router";
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtApp,
  MtActionMenu,
  MtAppHeader,
  MtButton,
  MtDivider,
  MtDropdownMenuPortal,
  MtDropdownMenuSub,
  MtIcon,
  MtUserMenu,
  useTheme,
  type NavSection,
  type Theme,
} from "@shopware-ag/meteor-component-library";
import CompanySwitcher from "./components/CompanySwitcher.vue";

const { t } = useI18n();
const route = useRoute();

// mt-app-header takes no active matcher, so each page tells whether it is the current one.
function page(name: string, icon?: string) {
  return {
    id: name,
    label: t(`${name}.title`),
    icon,
    to: { name },
    active: route.matched.some((record) => record.name === name),
  };
}

// The marketplace opens its pages in a dropdown, and is active while one of them is.
const sections = computed<NavSection[]>(() => [
  {
    items: [
      page("overview", "regular-home"),
      {
        id: "marketplace",
        label: t("marketplace.title"),
        icon: "regular-marketplace-stall",
        children: [page("integrations"), page("templates")],
      },
      page("settings", "regular-cog"),
    ],
  },
]);

// Placeholders without a function yet.
const actions = computed(() => [
  { label: t("header.search"), icon: "regular-search" },
  { label: t("header.notifications"), icon: "regular-bell" },
  { label: t("header.help"), icon: "regular-question-circle" },
]);

// Shares the stored preference with the shell, which applies it.
const { theme, setTheme } = useTheme();

const themes = computed(() =>
  (
    [
      { value: "light", icon: "regular-sun" },
      { value: "dark", icon: "regular-moon" },
      { value: "system", icon: "regular-desktop" },
    ] satisfies { value: Theme; icon: string }[]
  ).map((option) => ({
    ...option,
    label: t(`header.themes.${option.value}`),
  })),
);

const themeIcon = computed(
  () => themes.value.find((option) => option.value === theme.value)?.icon,
);
</script>

<template>
  <mt-app loading-bar>
    <template #header>
      <mt-app-header class="app-header" :sections="sections">
        <template #start="{ isMobile }">
          <div class="app-brand">
            <CompanySwitcher />
            <!-- Sets the brand off from the navigation, as mt-page does with its close button. Only
                 in the header: the mobile drawer stacks the brand above the navigation. -->
            <span v-if="!isMobile" class="app-brand__divider">
              <mt-divider orientation="vertical" decorative />
            </span>
          </div>
        </template>

        <template #actions>
          <mt-button
            v-for="action in actions"
            :key="action.icon"
            variant="tertiary"
            size="default"
            square
            :aria-label="action.label"
          >
            <template #iconFront>
              <mt-icon
                :name="action.icon"
                size="var(--scale-size-16)"
                decorative
              />
            </template>
          </mt-button>
        </template>

        <template #end="{ isMobile }">
          <mt-user-menu
            name="Alastair Fraser"
            subtitle="alastair.fraser@example.com"
            :compact="!isMobile"
          >
            <mt-action-menu-group>
              <mt-dropdown-menu-sub>
                <mt-action-menu-item is-sub-trigger :icon="themeIcon">
                  {{ t("header.theme") }}
                </mt-action-menu-item>

                <mt-dropdown-menu-portal>
                  <mt-action-menu is-sub-menu>
                    <mt-action-menu-item
                      v-for="option in themes"
                      :key="option.value"
                      :icon="option.icon"
                      role="menuitemradio"
                      :aria-checked="option.value === theme"
                      @select="setTheme(option.value)"
                    >
                      {{ option.label }}
                      <mt-icon
                        v-if="option.value === theme"
                        name="regular-checkmark-xs"
                        size="var(--scale-size-12)"
                        class="theme-check"
                        decorative
                      />
                    </mt-action-menu-item>
                  </mt-action-menu>
                </mt-dropdown-menu-portal>
              </mt-dropdown-menu-sub>
            </mt-action-menu-group>

            <mt-action-menu-group>
              <mt-action-menu-item icon="regular-sign-out" variant="critical">
                {{ t("header.logout") }}
              </mt-action-menu-item>
            </mt-action-menu-group>
          </mt-user-menu>
        </template>
      </mt-app-header>
    </template>

    <RouterView />
  </mt-app>
</template>

<style scoped>
/* A taller header than mt-app-header's default. */
.app-header {
  min-height: var(--scale-size-64);
}

/* The gap matches the header's gap to the navigation, so the divider sits in the middle. */
.app-brand {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
}

/* As high as the divider next to the close button of mt-page, which fills it. */
.app-brand__divider {
  display: flex;
  height: var(--scale-size-40);
}

.theme-check {
  margin-inline-start: auto;
  color: var(--color-icon-primary-default);
}
</style>
