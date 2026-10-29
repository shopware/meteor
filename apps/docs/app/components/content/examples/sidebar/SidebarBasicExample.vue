<script setup lang="ts">
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtBrand,
  MtNav,
  MtSidebar,
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
  <div style="height: 480px">
    <mt-sidebar>
      <template #header>
        <mt-brand title="Demo shop" subtitle="Shopware" />
      </template>

      <mt-nav :sections="sections" />

      <template #footer> 
        <mt-user-menu
          first-name="Max"
          last-name="Mustermann"
          subtitle="Administrator"
        >
          <mt-action-menu-group>
            <mt-action-menu-item icon="regular-sign-out" variant="critical">
              Log out
            </mt-action-menu-item>
          </mt-action-menu-group>
        </mt-user-menu>
      </template>
    </mt-sidebar>
  </div>
</template>
