import type { Meta, StoryObj } from "@storybook/vue3";
import { markRaw, ref } from "vue";
import MtNav from "./mt-nav.vue";
import MtBadge from "../mt-badge/mt-badge.vue";
import type { NavItem, NavSection } from "./mt-nav.vue";
import { StoryLink } from "./mt-nav.story-helper";

export type MtNavMeta = Meta<typeof MtNav>;

/**
 * Sample navigation resembling a shop administration.
 */
const shopItems: NavItem[] = [
  { label: "Dashboard", icon: "regular-home", to: { name: "dashboard.index" } },
  {
    label: "Products",
    icon: "regular-products",
    children: [
      {
        label: "Overview",
        to: { name: "product.index" },
        children: [{ label: "Reviews", to: { name: "review.index" } }],
      },
      { label: "Categories", to: { name: "category.index" } },
      { label: "Manufacturers", to: { name: "manufacturer.index" } },
    ],
  },
  { label: "Orders", icon: "regular-shopping-bag", to: { name: "order.index" } },
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
  { label: "Docs", href: "https://docs.shopware.com", target: "_blank" },
];

/**
 * Sample navigation whose submenus hold submenus of their own, using all three levels.
 */
const nestedItems: NavItem[] = [
  { label: "Dashboard", icon: "regular-home", to: { name: "dashboard.index" } },
  {
    label: "Products",
    icon: "regular-products",
    children: [
      {
        label: "Overview",
        to: { name: "product.index" },
        children: [{ label: "Reviews", to: { name: "review.index" } }],
      },
      {
        label: "Categories",
        to: { name: "category.index" },
        children: [{ label: "Dynamic product groups", to: { name: "product-stream.index" } }],
      },
      { label: "Manufacturers", to: { name: "manufacturer.index" } },
    ],
  },
  {
    label: "Settings",
    icon: "regular-cog",
    children: [
      {
        label: "Shop",
        children: [
          { label: "Basic information", to: { name: "basic-information.index" } },
          { label: "Languages", to: { name: "language.index" } },
          { label: "Currencies", to: { name: "currency.index" } },
        ],
      },
      {
        label: "System",
        children: [
          { label: "Users & permissions", to: { name: "user.index" } },
          { label: "Integrations", to: { name: "integration.index" } },
        ],
      },
    ],
  },
];

function routeName(item: NavItem) {
  // Reads the route name of a row, if it links to a route
  return (item.to as { name?: string } | undefined)?.name;
}

/**
 * Renders the navigation with a fake current route that follows the clicked row, so the active
 * state changes like in an application. `sourceCode` is what the docs show, `slotContent` is
 * rendered inside the navigation and `initialRoute` is the route the story starts on.
 */
function createStory(
  sections: NavSection[],
  sourceCode: string,
  slotContent = "",
  initialRoute = "product.index",
) {
  // Builds a story matching the static sections against the fake current route
  return {
    render: (args) => ({
      components: { MtNav, MtBadge },
      setup() {
        const current = ref(initialRoute);

        function isActive(item: NavItem) {
          // Matches the row against the fake current route, like an application would
          return routeName(item) === current.value;
        }

        function onNavigate(item: NavItem) {
          // Moves the fake current route to the clicked row
          const name = routeName(item);

          if (name) {
            current.value = name;
          }
        }

        return { args, sections, isActive, onNavigate, badges };
      },
      template: `<mt-nav v-bind="args" :sections="sections" :is-active="isActive" @navigate="onNavigate">${slotContent}</mt-nav>`,
    }),
    parameters: {
      docs: {
        source: {
          code: sourceCode.trim(),
        },
      },
    },
  } satisfies MtNavStory;
}

const defaultSource = `
<mt-nav :sections="sections" :is-active="isActive" @navigate="onNavigate" />

<script setup lang="ts">
import { useRoute, type RouteLocationNamedRaw } from "vue-router";
import type { NavItem, NavSection } from "@shopware-ag/meteor-component-library";

const route = useRoute();

function isActive(item: NavItem) {
  return (item.to as RouteLocationNamedRaw | undefined)?.name === route.name;
}

const sections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: "regular-home", to: { name: "dashboard.index" } },
      {
        label: "Products",
        icon: "regular-products",
        children: [
          {
            label: "Overview",
            to: { name: "product.index" },
            children: [{ label: "Reviews", to: { name: "review.index" } }],
          },
          { label: "Categories", to: { name: "category.index" } },
        ],
      },
      { label: "Docs", href: "https://docs.shopware.com", target: "_blank" },
    ],
  },
];
</script>`;

const sectionsSource = `
<mt-nav :sections="sections" :is-active="isActive" @navigate="onNavigate" />

<script setup lang="ts">
import { useRoute, type RouteLocationNamedRaw } from "vue-router";
import type { NavItem, NavSection } from "@shopware-ag/meteor-component-library";

const route = useRoute();

function isActive(item: NavItem) {
  return (item.to as RouteLocationNamedRaw | undefined)?.name === route.name;
}

const sections: NavSection[] = [
  {
    header: "Shop",
    items: [
      { label: "Dashboard", icon: "regular-home", to: { name: "dashboard.index" } },
      { label: "Orders", icon: "regular-shopping-bag", to: { name: "order.index" } },
    ],
  },
  {
    header: "System",
    items: [
      { label: "Settings", icon: "regular-cog", to: { name: "settings.index" } },
    ],
  },
];
</script>`;

const nestedSource = `
<mt-nav :sections="sections" :is-active="isActive" @navigate="onNavigate" />

<script setup lang="ts">
import { useRoute, type RouteLocationNamedRaw } from "vue-router";
import type { NavItem, NavSection } from "@shopware-ag/meteor-component-library";

const route = useRoute();

function isActive(item: NavItem) {
  return (item.to as RouteLocationNamedRaw | undefined)?.name === route.name;
}

const sections: NavSection[] = [
  {
    items: [
      {
        label: "Settings",
        icon: "regular-cog",
        children: [
          {
            label: "Shop",
            children: [
              { label: "Basic information", to: { name: "basic-information.index" } },
              { label: "Languages", to: { name: "language.index" } },
            ],
          },
          {
            label: "System",
            children: [
              { label: "Users & permissions", to: { name: "user.index" } },
            ],
          },
        ],
      },
    ],
  },
];
</script>`;

const badgesSource = `
<mt-nav :sections="sections" :is-active="isActive" @navigate="onNavigate">
  <template #suffix="{ item }">
    <mt-badge v-if="badges[item.label]" :variant="badges[item.label].variant">
      {{ badges[item.label].text }}
    </mt-badge>
  </template>
</mt-nav>

<script setup lang="ts">
const badges = {
  Orders: { text: "12", variant: "critical" },
  Reviews: { text: "3", variant: "attention" },
  Marketing: { text: "2", variant: "info" },
  Promotions: { text: "New", variant: "info" },
};
</script>`;

/**
 * Badges shown in the `suffix` slot of the badge story, keyed by row label.
 */
const badges: Record<string, { text: string; variant: "critical" | "attention" | "info" }> = {
  Orders: { text: "12", variant: "critical" },
  Reviews: { text: "3", variant: "attention" },
  Marketing: { text: "2", variant: "info" },
  Promotions: { text: "New", variant: "info" },
};

const meta: MtNavMeta = {
  title: "Components/Nav",
  component: MtNav,
  args: {
    // markRaw: a component object stored in reactive args would be made reactive otherwise
    linkComponent: markRaw(StoryLink),
  },
  argTypes: {
    sections: { control: false },
    linkComponent: { control: false },
    isActive: { control: false },
  },
  ...createStory([{ items: [...shopItems, ...systemItems] }], defaultSource),
};

export default meta;

export type MtNavStory = StoryObj<MtNavMeta>;

/**
 * A single section without a header holds all rows. The row matched by `isActive` opens its ancestors.
 */
export const Default: MtNavStory = {};

/**
 * Several sections, each with a `header` above its rows.
 */
export const Sections: MtNavStory = createStory(
  [
    { header: "Shop", items: shopItems },
    { header: "System", items: systemItems },
  ],
  sectionsSource,
);

/**
 * The `suffix` slot renders after the label of every row and receives the row as `item`, e.g. to
 * show an `mt-badge` with a counter or a hint on chosen rows.
 */
export const Badges: MtNavStory = createStory(
  [
    { header: "Shop", items: shopItems },
    { header: "System", items: systemItems },
  ],
  badgesSource,
  `<template #suffix="{ item }">
    <mt-badge v-if="badges[item.label]" :variant="badges[item.label].variant">
      {{ badges[item.label].text }}
    </mt-badge>
  </template>`,
);

/**
 * Submenus can hold submenus of their own, up to three levels in total. A nested row without a
 * `to` only toggles its rows; one with a `to` is a link and opens its rows when clicked.
 */
export const NestedSubmenus: MtNavStory = createStory(
  [{ items: nestedItems }],
  nestedSource,
  "",
  "language.index",
);
