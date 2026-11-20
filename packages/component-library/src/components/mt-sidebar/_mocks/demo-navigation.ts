import { markRaw } from "vue";
import MtSidebar from "../mt-sidebar.vue";
import MtUserMenu from "../../mt-user-menu/mt-user-menu.vue";
import MtBrand from "../../mt-brand/mt-brand.vue";
import MtNav from "../../mt-nav/mt-nav.vue";
import MtActionMenuGroup from "../../mt-action-menu-group/mt-action-menu-group.vue";
import MtActionMenuItem from "../../mt-action-menu-item/mt-action-menu-item.vue";
import type { NavItem, NavSection } from "../../mt-nav/mt-nav.vue";
import { StoryLink } from "../../mt-nav/mt-nav.story-helper";

export const demoComponents = {
  MtSidebar,
  MtBrand,
  MtUserMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
  MtNav,
};

/**
 * Storybook has no router, so the navigation renders its links with this stand-in.
 * markRaw: a component object stored in reactive state would be made reactive otherwise.
 */
export const demoLinkComponent = markRaw(StoryLink);

const shopItems: NavItem[] = [
  { label: "Dashboard", icon: "regular-home", to: { name: "dashboard.index" }, active: true },
  { label: "Orders", icon: "regular-shopping-bag", to: { name: "order.index" } },
  {
    label: "Catalogues",
    icon: "regular-products",
    children: [
      { label: "Products", to: { name: "product.index" } },
      { label: "Categories", to: { name: "category.index" } },
      { label: "Manufacturers", to: { name: "manufacturer.index" } },
    ],
  },
  { label: "Customers", icon: "regular-users", to: { name: "customer.index" } },
  {
    label: "Content",
    icon: "regular-content",
    children: [
      { label: "Shopping Experiences", to: { name: "cms.index" } },
      { label: "Media", to: { name: "media.index" } },
    ],
  },
  {
    label: "Marketing",
    icon: "regular-megaphone",
    children: [
      { label: "Promotions", to: { name: "promotion.index" } },
      { label: "Newsletter recipients", to: { name: "newsletter.index" } },
    ],
  },
  { label: "Analytics", icon: "regular-chart-line", to: { name: "analytics.index" } },
  { label: "Sales channels", icon: "regular-storefront", to: { name: "sales-channel.index" } },
  { label: "Shipping", icon: "regular-truck", to: { name: "shipping.index" } },
  { label: "Payments", icon: "regular-credit-card", to: { name: "payment.index" } },
];

const systemItems: NavItem[] = [
  {
    label: "Extensions",
    icon: "regular-plug",
    children: [
      { label: "My extensions", to: { name: "extension.my-extensions" } },
      { label: "Store", to: { name: "extension.store" } },
    ],
  },
  { label: "Settings", icon: "regular-cog", to: { name: "settings.index" } },
];

/**
 * A navigation tall enough to scroll inside the sidebar of the stories.
 */
export const demoSections: NavSection[] = [
  { items: shopItems },
  { header: "System", items: systemItems },
];

/**
 * A navigation short enough to fit into the sidebar of the stories without scrolling.
 */
export const shortDemoSections: NavSection[] = [{ items: shopItems.slice(0, 4) }];

/** The navigation used to demonstrate the sidebar. */
export const demoNavigationTemplate = `
<mt-nav :sections="sections" :link-component="linkComponent" />`;

/** A brand in the sidebar header. */
export const demoHeaderTemplate = `
<mt-brand title="Demo shop" subtitle="Shopware" />`;

/** A user menu in the sidebar footer. */
export const demoFooterTemplate = `
<mt-user-menu name="Max Mustermann" subtitle="Administrator">
  <mt-action-menu-group>
    <mt-action-menu-item icon="regular-sign-out" variant="critical">Log out</mt-action-menu-item>
  </mt-action-menu-group>
</mt-user-menu>`;
