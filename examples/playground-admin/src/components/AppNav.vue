<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtBrand,
  MtNav,
  MtSidebar,
  MtUserMenu,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";
import { useCurrentUser } from "../composables/useCurrentUser";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const user = useCurrentUser();

/** The menu of the Shopware Administration, with the modules this playground has. */
const sections = computed<NavSection[]>(() => [
  {
    items: [
      {
        id: "dashboard",
        label: t("nav.dashboard"),
        icon: "regular-dashboard",
        to: "/",
      },
      {
        id: "catalogues",
        label: t("nav.catalogues"),
        icon: "regular-products",
        children: [
          { id: "products", label: t("nav.products"), to: "/products" },
          { id: "categories", label: t("nav.categories"), to: "/categories" },
        ],
      },
      {
        id: "orders",
        label: t("nav.orders"),
        icon: "regular-shopping-bag",
        children: [
          { id: "order-overview", label: t("nav.overview"), to: "/orders" },
        ],
      },
      {
        id: "content",
        label: t("nav.content"),
        icon: "regular-image-text",
        children: [
          { id: "shopping-experiences", label: t("nav.cms"), to: "/cms" },
        ],
      },
      {
        id: "settings",
        label: t("nav.settings"),
        icon: "regular-cog",
        to: "/settings",
      },
    ],
  },
]);

/** A row is active on its own page and on the pages below it, such as a product's detail page. */
function isActive(item: NavItem) {
  if (typeof item.to !== "string") return false;
  if (item.to === "/") return route.path === "/";

  return route.path === item.to || route.path.startsWith(`${item.to}/`);
}
</script>

<template>
  <mt-sidebar>
    <template #header>
      <mt-brand title="Playground" subtitle="Shopware" />
    </template>

    <mt-nav :sections="sections" :is-active="isActive" />

    <template #footer>
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
  </mt-sidebar>
</template>
