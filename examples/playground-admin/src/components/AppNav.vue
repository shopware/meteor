<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtBrand,
  MtNav,
  MtSidebar,
  MtUserMenu,
  type NavSection,
} from "@shopware-ag/meteor-component-library";
import { useCurrentUser } from "../composables/useCurrentUser";

const { t } = useI18n();
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
</script>

<template>
  <mt-sidebar>
    <template #header>
      <mt-brand title="Playground" subtitle="Shopware" />
    </template>

    <mt-nav :sections="sections" />

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
