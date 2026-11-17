<script setup lang="ts">
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtAppHeader,
  MtBrand,
  MtButton,
  MtIcon,
  MtUserMenu,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

const sections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: "regular-home", href: "#", active: true },
      { label: "Orders", icon: "regular-shopping-bag", href: "#" },
      {
        label: "Catalogues",
        icon: "regular-products",
        children: [
          { label: "Products", href: "#" },
          { label: "Categories", href: "#" },
        ],
      },
      { label: "Customers", icon: "regular-users", href: "#" },
    ],
  },
];
</script>

<template>
  <div style="background-color: var(--color-elevation-surface-sunken)">
    <mt-app-header :sections="sections">
      <template #start="{ isMobile }">
        <mt-brand title="Demo shop" subtitle="Shopware" :size="isMobile ? 's' : 'xs'" />
      </template>

      <template #actions>
        <mt-button
          variant="tertiary"
          size="default"
          square
          aria-label="Notifications"
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
          name="Max Mustermann"
          subtitle="Administrator"
          :compact="!isMobile"
        >
          <mt-action-menu-group>
            <mt-action-menu-item icon="regular-sign-out" variant="critical">
              Log out
            </mt-action-menu-item>
          </mt-action-menu-group>
        </mt-user-menu>
      </template>
    </mt-app-header>
  </div>
</template>
