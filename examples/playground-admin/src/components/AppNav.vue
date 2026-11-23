<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtAppSidebar,
  MtBrand,
  MtUserMenu,
  type NavSection,
} from "@shopware-ag/meteor-component-library";
import { useCurrentUser } from "../composables/useCurrentUser";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const user = useCurrentUser();

/** A row is active on its own page and on the pages below it, such as a product's detail page. */
function isActive(path: string) {
  if (path === "/") return route.path === "/";

  return route.path === path || route.path.startsWith(`${path}/`);
}

/** The menu of the Shopware Administration, with the modules this playground has. */
const sections = computed<NavSection[]>(() => [
  {
    items: [
      {
        id: "dashboard",
        label: t("nav.dashboard"),
        icon: "regular-dashboard",
        to: "/",
        active: isActive("/"),
      },
      {
        id: "catalogues",
        label: t("nav.catalogues"),
        icon: "regular-products",
        children: [
          {
            id: "products",
            label: t("nav.products"),
            to: "/products",
            active: isActive("/products"),
          },
          {
            id: "categories",
            label: t("nav.categories"),
            to: "/categories",
            active: isActive("/categories"),
          },
        ],
      },
      {
        id: "orders",
        label: t("nav.orders"),
        icon: "regular-shopping-bag",
        children: [
          {
            id: "order-overview",
            label: t("nav.overview"),
            to: "/orders",
            active: isActive("/orders"),
          },
        ],
      },
      {
        id: "content",
        label: t("nav.content"),
        icon: "regular-image-text",
        children: [
          {
            id: "shopping-experiences",
            label: t("nav.cms"),
            to: "/cms",
            active: isActive("/cms"),
          },
        ],
      },
      {
        id: "settings",
        label: t("nav.settings"),
        icon: "regular-cog",
        to: "/settings",
        active: isActive("/settings"),
      },
    ],
  },
]);
</script>

<template>
  <mt-app-sidebar :sections="sections">
    <template #start>
      <mt-brand title="Playground" subtitle="Shopware" />
    </template>

    <template #end>
      <mt-user-menu
        :name="`${user.firstName} ${user.lastName}`"
        :subtitle="user.email"
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
    </template>
  </mt-app-sidebar>
</template>
