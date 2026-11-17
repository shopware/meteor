<script setup lang="ts">
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtAppSidebar,
  MtBrand,
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
      { label: "Settings", icon: "regular-cog", href: "#" },
    ],
  },
];
</script>

<template>
  <div
    style="height: 480px; background-color: var(--color-elevation-surface-sunken)"
  >
    <mt-app-sidebar :sections="sections">
      <template #start>
        <mt-brand title="Demo shop" subtitle="Shopware" />
      </template>

      <template #end>
        <mt-user-menu name="Max Mustermann" subtitle="Administrator">
          <mt-action-menu-group>
            <mt-action-menu-item icon="regular-sign-out" variant="critical">
              Log out
            </mt-action-menu-item>
          </mt-action-menu-group>
        </mt-user-menu>
      </template>
    </mt-app-sidebar>
  </div>
</template>
