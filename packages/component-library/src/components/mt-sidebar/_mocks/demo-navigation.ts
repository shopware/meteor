import { markRaw } from "vue";
import MtSidebar from "../mt-sidebar.vue";
import MtSidebarFooter from "../../mt-sidebar-footer/mt-sidebar-footer.vue";
import MtNav from "../../mt-nav/mt-nav.vue";
import type { NavItem, NavSection } from "../../mt-nav/mt-nav.vue";
import { StoryLink } from "../../mt-nav/mt-nav.story-helper";
import MtText from "../../mt-text/mt-text.vue";
import MtIcon from "../../mt-icon/mt-icon.vue";
import MtButton from "../../mt-button/mt-button.vue";

/**
 * Everything the demo templates below need to render.
 */
export const demoComponents = {
  MtSidebar,
  MtSidebarFooter,
  MtNav,
  MtText,
  MtIcon,
  MtButton,
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

/**
 * The navigation used to demonstrate the sidebar. Any navigation can be placed
 * into the default slot instead.
 */
export const demoNavigationTemplate = `
<mt-nav :sections="sections" :link-component="linkComponent" />`;

/**
 * Header as used by the Shopware administration: logo box, shop name,
 * product name and a button to collapse the sidebar.
 */
export const demoHeaderTemplate = `
<div
  style="
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--scale-size-40);
    height: var(--scale-size-40);
    background: var(--color-icon-brand-default);
    border-radius: var(--border-radius-m);
  "
>
  <mt-icon
    name="solid-shopware"
    size="var(--scale-size-26)"
    color="var(--color-static-white)"
    aria-label="Shopware"
  />
</div>

<div style="flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; justify-content: center;">
  <mt-text
    as="div"
    size="s"
    weight="semibold"
    style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; line-height: 1.4;"
    title="Demo shop"
  >
    Demo shop
  </mt-text>
  <mt-text
    as="div"
    size="2xs"
    color="color-text-secondary-default"
    style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; line-height: 1.4;"
  >
    Shopware
  </mt-text>
</div>

<mt-button variant="tertiary" size="default" square aria-label="Minimize menu" style="flex-shrink: 0;">
  <template #iconFront>
    <mt-icon name="regular-panel-left" size="var(--scale-size-16)" aria-hidden="true" />
  </template>
</mt-button>`;

/**
 * Footer as used by the Shopware administration.
 */
export const demoFooterTemplate = `
<mt-sidebar-footer first-name="Max" last-name="Mustermann" role="Administrator" version="6.7.0.0" />`;
