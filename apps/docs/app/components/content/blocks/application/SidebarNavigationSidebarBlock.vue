<script setup lang="ts">
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtApp,
  MtAppSidebar,
  MtBrand,
  MtPage,
  MtPanel,
  MtUserMenu,
  type BreadcrumbItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

// The main navigation of the application. With Vue Router, leave out `active`: the navigation
// finds the current page from the route on its own.
const sections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: "regular-dashboard", to: "/", active: true },
      { label: "Orders", icon: "regular-shopping-bag", to: "/orders" },
      {
        label: "Products",
        icon: "regular-products",
        children: [
          { label: "Overview", to: "/products" },
          { label: "Categories", to: "/categories" },
        ],
      },
      { label: "Customers", icon: "regular-users", to: "/customers" },
      { label: "Settings", icon: "regular-cog", to: "/settings" },
    ],
  },
];

const breadcrumb: BreadcrumbItem[] = [{ label: "Dashboard", icon: "dashboard" }];
</script>

<template>
  <mt-app>
    <template #navigation>
      <mt-panel label="Navigation" resizable :min-width="200" :max-width="320">
        <mt-app-sidebar :sections="sections">
          <template #start>
            <mt-brand title="Shopware" subtitle="Meteor" />
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
      </mt-panel>
    </template>

    <mt-page width="l" :breadcrumb="breadcrumb">
      <placeholder-slot style="height: 24rem" />
    </mt-page>

    <template #sidebar>
      <mt-panel label="Sidebar" closable resizable>
        <placeholder-slot name="sidebar" inset />
      </mt-panel>
    </template>
  </mt-app>
</template>

