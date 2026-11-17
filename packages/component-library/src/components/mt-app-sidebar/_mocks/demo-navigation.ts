import MtAppSidebar from "../mt-app-sidebar.vue";
import MtUserMenu from "../../mt-user-menu/mt-user-menu.vue";
import MtBrand from "../../mt-brand/mt-brand.vue";
import MtActionMenuGroup from "../../mt-action-menu-group/mt-action-menu-group.vue";
import MtActionMenuItem from "../../mt-action-menu-item/mt-action-menu-item.vue";
import type { NavItem, NavSection } from "../../mt-nav/mt-nav.vue";

export const demoComponents = {
  MtAppSidebar,
  MtBrand,
  MtUserMenu,
  MtActionMenuGroup,
  MtActionMenuItem,
};

const shopItems: NavItem[] = [
  { label: "Dashboard", icon: "regular-home", href: "#dashboard", active: true },
  { label: "Orders", icon: "regular-shopping-bag", href: "#orders" },
  {
    label: "Catalogues",
    icon: "regular-products",
    children: [
      { label: "Products", href: "#products" },
      { label: "Categories", href: "#categories" },
      { label: "Manufacturers", href: "#manufacturers" },
    ],
  },
  { label: "Customers", icon: "regular-users", href: "#customers" },
  {
    label: "Content",
    icon: "regular-content",
    children: [
      { label: "Shopping Experiences", href: "#cms" },
      { label: "Media", href: "#media" },
    ],
  },
  {
    label: "Marketing",
    icon: "regular-megaphone",
    children: [
      { label: "Promotions", href: "#promotions" },
      { label: "Newsletter recipients", href: "#newsletter" },
    ],
  },
  { label: "Analytics", icon: "regular-chart-line", href: "#analytics" },
  { label: "Sales channels", icon: "regular-storefront", href: "#sales-channels" },
  { label: "Shipping", icon: "regular-truck", href: "#shipping" },
  { label: "Payments", icon: "regular-credit-card", href: "#payments" },
];

const systemItems: NavItem[] = [
  {
    label: "Extensions",
    icon: "regular-plug",
    children: [
      { label: "My extensions", href: "#my-extensions" },
      { label: "Store", href: "#store" },
    ],
  },
  { label: "Settings", icon: "regular-cog", href: "#settings" },
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

/** A brand in the start slot. */
export const demoStartTemplate = `
<mt-brand title="Demo shop" subtitle="Shopware" />`;

/** A user menu in the end slot. */
export const demoEndTemplate = `
<mt-user-menu name="Max Mustermann" subtitle="Administrator">
  <mt-action-menu-group>
    <mt-action-menu-item icon="regular-sign-out" variant="critical">Log out</mt-action-menu-item>
  </mt-action-menu-group>
</mt-user-menu>`;
