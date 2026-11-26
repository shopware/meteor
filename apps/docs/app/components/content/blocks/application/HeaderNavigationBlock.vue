<script setup lang="ts">
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtApp,
  MtAppHeader,
  MtBrand,
  MtButton,
  MtIcon,
  MtPage,
  MtUserMenu,
  type BreadcrumbItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

// The main navigation of the application. Mark the current page with `active`.
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
    ],
  },
];

const breadcrumb: BreadcrumbItem[] = [{ label: "Dashboard", icon: "dashboard" }];
</script>

<template>
  <mt-app>
    <template #header>
      <mt-app-header :sections="sections">
        <template #start>
          <mt-brand title="Shopware" subtitle="Meteor" />
        </template>

        <template #actions>
          <mt-button variant="tertiary" size="default" square aria-label="Help">
            <template #iconFront>
              <mt-icon name="regular-question-circle" size="var(--scale-size-16)" decorative />
            </template>
          </mt-button>

          <mt-button variant="tertiary" size="default" square aria-label="Notifications">
            <template #iconFront>
              <mt-icon name="regular-bell" size="var(--scale-size-16)" decorative />
            </template>
          </mt-button>
        </template>

        <template #end="{ isMobile }">
          <mt-user-menu name="Max Mustermann" subtitle="Administrator" :compact="!isMobile">
            <mt-action-menu-group>
              <mt-action-menu-item icon="regular-sign-out" variant="critical">
                Log out
              </mt-action-menu-item>
            </mt-action-menu-group>
          </mt-user-menu>
        </template>
      </mt-app-header>
    </template>

    <mt-page width="l" :breadcrumb="breadcrumb">
      <placeholder-slot style="height: 24rem" />
    </mt-page>
  </mt-app>
</template>
