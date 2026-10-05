import type { Meta, StoryObj } from "@storybook/vue3";
import { computed, markRaw, ref } from "vue";
import MtNav from "./mt-nav.vue";
import type { NavItem, NavSection } from "./mt-nav.vue";
import { StoryLink } from "./_internal/story-link";

export type MtNavMeta = Meta<typeof MtNav>;

/**
 * Sample navigation resembling a shop administration.
 */
const shopItems: NavItem[] = [
  { label: "Dashboard", icon: "regular-home", to: { name: "dashboard.index" } },
  {
    label: "Catalogues",
    icon: "regular-products",
    children: [
      {
        label: "Products",
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

function withActive(items: NavItem[], current: string): NavItem[] {
  // Marks the row whose route is the current one as active, like an application would
  return items.map((item) => ({
    ...item,
    active: (item.to as { name?: string } | undefined)?.name === current,
    children: item.children && withActive(item.children, current),
  }));
}

/**
 * Renders the navigation with a fake current route that follows the clicked row, so the active
 * state changes like in an application. `sourceCode` is what the docs show.
 */
function createStory(buildSections: (current: string) => NavSection[], sourceCode: string) {
  // Builds a story deriving the sections from the fake current route
  return {
    render: (args) => ({
      components: { MtNav },
      setup() {
        const current = ref("product.index");
        const sections = computed(() => buildSections(current.value));

        function onNavigate(item: NavItem) {
          // Moves the fake current route to the clicked row
          const name = (item.to as { name?: string } | undefined)?.name;

          if (name) {
            current.value = name;
          }
        }

        return { args, sections, onNavigate };
      },
      template: `<mt-nav v-bind="args" :sections="sections" @navigate="onNavigate" />`,
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
<mt-nav :sections="sections" @navigate="onNavigate" />

<script setup lang="ts">
import type { NavSection } from "@shopware-ag/meteor-component-library";

const sections: NavSection[] = [
  {
    items: [
      { label: "Dashboard", icon: "regular-home", to: { name: "dashboard.index" }, active: isCurrent("dashboard.index") },
      {
        label: "Catalogues",
        icon: "regular-products",
        children: [
          {
            label: "Products",
            to: { name: "product.index" },
            active: isCurrent("product.index"),
            children: [{ label: "Reviews", to: { name: "review.index" }, active: isCurrent("review.index") }],
          },
          { label: "Categories", to: { name: "category.index" }, active: isCurrent("category.index") },
        ],
      },
      { label: "Docs", href: "https://docs.shopware.com", target: "_blank" },
    ],
  },
];
</script>`;

const sectionsSource = `
<mt-nav :sections="sections" @navigate="onNavigate" />

<script setup lang="ts">
import type { NavSection } from "@shopware-ag/meteor-component-library";

const sections: NavSection[] = [
  {
    header: "Shop",
    items: [
      { label: "Dashboard", icon: "regular-home", to: { name: "dashboard.index" }, active: isCurrent("dashboard.index") },
      { label: "Orders", icon: "regular-shopping-bag", to: { name: "order.index" }, active: isCurrent("order.index") },
    ],
  },
  {
    header: "System",
    items: [
      { label: "Settings", icon: "regular-cog", to: { name: "settings.index" }, active: isCurrent("settings.index") },
    ],
  },
];
</script>`;

const meta: MtNavMeta = {
  title: "Components/Nav",
  component: MtNav,
  args: {
    // markRaw: a component object stored in reactive args would be made reactive otherwise
    linkComponent: markRaw(StoryLink),
  },
  argTypes: {
    sections: {
      control: false,
      description:
        "The sections of the navigation, each holding its rows. Rows nest through `children`.",
    },
    linkComponent: {
      control: false,
      description:
        "Component rendering the links. Receives the `to` of a row. Defaults to `router-link`.",
    },
  },
  ...createStory(
    (current) => [{ items: withActive([...shopItems, ...systemItems], current) }],
    defaultSource,
  ),
};

meta.parameters = {
  ...meta.parameters,
  docs: {
    ...meta.parameters?.docs,
    description: {
      component: `
The main navigation of an application. It takes its structure as data: \`sections\` holds groups
of rows below an optional header, and rows nest through \`children\` up to three levels deep.
The root fills its container and scrolls its content, fading it out at the edges.

The application decides which row is current and sets \`active\` on it, typically by comparing the
row's route with the current route. The ancestors of the active row open and, while closed, take
over its highlight. When the active row moves, the branch holding it opens and branches holding
nothing active close. Only one top-level branch is open at a time; nested rows remember their own
toggle. Arrow, Home and End keys move focus between the visible links.
`.trim(),
    },
  },
};

export default meta;

export type MtNavStory = StoryObj<MtNavMeta>;

/**
 * A single section without a header holds all rows. The row marked `active` opens its ancestors.
 */
export const Default: MtNavStory = {};

/**
 * Several sections, each with a `header` above its rows.
 */
export const Sections: MtNavStory = createStory(
  (current) => [
    { header: "Shop", items: withActive(shopItems, current) },
    { header: "System", items: withActive(systemItems, current) },
  ],
  sectionsSource,
);
