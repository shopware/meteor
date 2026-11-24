<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import {
  MtActionMenuGroup,
  MtActionMenuItem,
  MtAppSidebar,
  MtBrand,
  MtText,
  MtUserMenu,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";
import { useCurrentUser } from "../composables/useCurrentUser";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const user = useCurrentUser();

/** The menu of the Shopware Administration, in its order. */
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
        label: t("nav.products"),
        icon: "regular-products",
        children: [
          { id: "products", label: t("nav.overview"), to: "/products" },
          { id: "reviews", label: t("nav.reviews"), to: "/reviews" },
          { id: "categories", label: t("nav.categories"), to: "/categories" },
          {
            id: "product-streams",
            label: t("nav.productStreams"),
            to: "/product-streams",
          },
          { id: "properties", label: t("nav.properties"), to: "/properties" },
          {
            id: "manufacturers",
            label: t("nav.manufacturers"),
            to: "/manufacturers",
          },
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
        id: "customers",
        label: t("nav.customers"),
        icon: "regular-users",
        children: [
          {
            id: "customer-overview",
            label: t("nav.overview"),
            to: "/customers",
          },
        ],
      },
      {
        id: "content",
        label: t("nav.content"),
        icon: "regular-image-text",
        children: [
          { id: "shopping-experiences", label: t("nav.cms"), to: "/cms" },
          { id: "media", label: t("nav.media"), to: "/media" },
          { id: "themes", label: t("nav.themes"), to: "/themes" },
        ],
      },
      {
        id: "marketing",
        label: t("nav.marketing"),
        icon: "regular-megaphone",
        children: [
          { id: "promotions", label: t("nav.promotions"), to: "/promotions" },
          {
            id: "newsletter",
            label: t("nav.newsletter"),
            to: "/newsletter-recipients",
          },
        ],
      },
      {
        id: "automation",
        label: t("nav.automation"),
        icon: "regular-rule",
        children: [
          { id: "rules", label: t("nav.rules"), to: "/rules" },
          { id: "flows", label: t("nav.flows"), to: "/flows" },
        ],
      },
      {
        id: "extensions",
        label: t("nav.extensions"),
        icon: "regular-plug",
        children: [
          {
            id: "my-extensions",
            label: t("nav.myExtensions"),
            to: "/extensions",
          },
          { id: "store", label: t("nav.store"), to: "/store" },
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
  {
    header: t("nav.salesChannels"),
    items: [
      {
        id: "headless",
        label: "Headless",
        icon: "regular-shopping-basket",
        to: "/sales-channels/headless",
      },
      {
        id: "storefront",
        label: "Storefront",
        icon: "regular-storefront",
        to: "/sales-channels/storefront",
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
  <mt-app-sidebar :sections="sections" :is-active="isActive">
    <template #start>
      <mt-brand title="Demostore" :subtitle="t('nav.administration')" />
    </template>

    <template #end>
      <mt-user-menu
        :name="`${user.firstName} ${user.lastName}`"
        :subtitle="t('nav.administrator')"
      >
        <mt-action-menu-group>
          <mt-action-menu-item
            icon="regular-user"
            @select="router.push({ name: 'profile' })"
          >
            {{ t("nav.profile") }}
          </mt-action-menu-item>
          <mt-action-menu-item icon="regular-sign-out" variant="critical">
            {{ t("nav.logout") }}
          </mt-action-menu-item>
        </mt-action-menu-group>

        <mt-action-menu-group>
          <mt-text
            class="app-nav__version"
            size="2xs"
            color="color-text-secondary-default"
          >
            {{ t("nav.version", { version: "6.7.13.0" }) }}
          </mt-text>
        </mt-action-menu-group>
      </mt-user-menu>
    </template>
  </mt-app-sidebar>
</template>

<style scoped>
.app-nav__version {
  padding: var(--scale-size-4) var(--scale-size-8);
}
</style>
