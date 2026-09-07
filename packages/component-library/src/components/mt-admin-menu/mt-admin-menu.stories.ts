import type { Meta, StoryObj } from "@storybook/vue3";
import { defineComponent, h, ref } from "vue";
import MtAdminMenu from "./mt-admin-menu.vue";
import type { MenuEntry, MenuRoute, MenuTreeEntry } from "./mt-admin-menu.types";

export type MtAdminMenuMeta = Meta<typeof MtAdminMenu>;

/**
 * Storybook has no router, so the links only prevent the default navigation. Consumers pass
 * `router-link` (the default) or their own link component instead.
 */
const StoryLink = defineComponent({
  name: "StoryLink",
  props: {
    to: { type: Object, required: true },
    activeClass: { type: String, default: "" },
    exactActiveClass: { type: String, default: "" },
  },
  setup(props, { slots }) {
    return () =>
      h(
        "a",
        {
          href: `#${(props.to as { name: string }).name}`,
          onClick: (event: MouseEvent) => event.preventDefault(),
        },
        slots.default?.(),
      );
  },
});

const entries: MenuEntry[] = [
  {
    id: "sw-dashboard",
    path: "sw.dashboard.index",
    label: "Dashboard",
    icon: "regular-home",
    color: "#6ad6f0",
    position: 10,
  },
  {
    id: "sw-catalogue",
    label: "Catalogues",
    icon: "regular-products",
    color: "#57d9a3",
    position: 20,
  },
  {
    id: "sw-product",
    path: "sw.product.index",
    label: "Products",
    parent: "sw-catalogue",
    position: 10,
  },
  {
    id: "sw-review",
    path: "sw.review.index",
    label: "Reviews",
    parent: "sw-product",
    position: 10,
  },
  {
    id: "sw-category",
    path: "sw.category.index",
    label: "Categories",
    parent: "sw-catalogue",
    position: 20,
  },
  {
    id: "sw-manufacturer",
    path: "sw.manufacturer.index",
    label: "Manufacturers",
    parent: "sw-catalogue",
    position: 30,
  },
  {
    id: "sw-order",
    path: "sw.order.index",
    label: "Orders",
    icon: "regular-shopping-bag",
    color: "#a092f0",
    position: 30,
  },
  {
    id: "sw-customer",
    path: "sw.customer.index",
    label: "Customers",
    icon: "regular-users",
    color: "#f88962",
    position: 40,
  },
  { id: "sw-content", label: "Content", icon: "regular-content", color: "#ff85c2", position: 50 },
  {
    id: "sw-cms",
    path: "sw.cms.index",
    label: "Shopping Experiences",
    parent: "sw-content",
    position: 10,
  },
  { id: "sw-media", path: "sw.media.index", label: "Media", parent: "sw-content", position: 20 },
  {
    id: "sw-marketing",
    label: "Marketing",
    icon: "regular-megaphone",
    color: "#ffd700",
    position: 60,
  },
  {
    id: "sw-promotion",
    path: "sw.promotion.index",
    label: "Promotions",
    parent: "sw-marketing",
    position: 10,
  },
  {
    id: "sw-newsletter",
    path: "sw.newsletter.index",
    label: "Newsletter recipients",
    parent: "sw-marketing",
    position: 20,
  },
  { id: "sw-extension", label: "Extensions", icon: "regular-plug", position: 70 },
  {
    id: "sw-extension-my-extensions",
    path: "sw.extension.my-extensions",
    label: "My extensions",
    parent: "sw-extension",
    position: 10,
  },
  {
    id: "sw-extension-store",
    path: "sw.extension.store",
    label: "Store",
    parent: "sw-extension",
    position: 20,
  },
  {
    id: "sw-settings",
    path: "sw.settings.index",
    label: "Settings",
    icon: "regular-cog",
    position: 80,
  },
  {
    id: "sw-docs",
    link: "https://docs.shopware.com",
    target: "_blank",
    label: "Documentation",
    icon: "regular-book",
    position: 90,
  },
];

function routeFor(name: string): MenuRoute {
  return { name, path: `/${name.replace(/\./g, "/")}`, matched: [{ name }], params: {} };
}

const meta: MtAdminMenuMeta = {
  title: "Components/Admin Menu",
  component: MtAdminMenu,
  args: {
    entries,
    linkComponent: StoryLink,
    user: { firstName: "Max", lastName: "Mustermann", title: "Administrator" },
    shopName: "Demo store",
    version: "6.7.0.0",
    moduleIconColors: false,
    isUserLoading: false,
  },
  argTypes: {
    entries: {
      description:
        "Flat list of translated navigation entries, nested via `parent` and sorted via `position`. Pass only entries the user may see.",
    },
    route: {
      description:
        "The current route (`name`, `path`, `params`, `matched`, `meta`). Highlights the active entry and opens its branch.",
    },
    router: {
      description: "Router with `getRoutes()`, used to follow `meta.parentPath` of detail routes.",
    },
    linkComponent: {
      control: false,
      description:
        "Component rendering the links. Receives the route location as `to`. Defaults to `router-link`.",
    },
    moduleIconColors: {
      control: { type: "boolean" },
      description: "Paints the top level icons in the `color` of their entry.",
    },
    expanded: {
      control: { type: "boolean" },
      description: "Sidebar expanded state. Use with `v-model:expanded`.",
    },
    offCanvasOpen: {
      control: { type: "boolean" },
      description: "Mobile off-canvas panel state. Use with `v-model:offCanvasOpen`.",
    },
  },
  render: (args) => ({
    components: { MtAdminMenu },
    setup() {
      const route = ref<MenuRoute>(routeFor("sw.product.index"));
      const expanded = ref(args.expanded ?? true);

      function onNavigate(entry: MenuTreeEntry) {
        if (entry.path) {
          route.value = { ...routeFor(entry.path), params: entry.params ?? {} };
        }
      }

      return { args, route, expanded, onNavigate };
    },
    template: `
      <div style="height: 100vh; display: flex; background: var(--color-elevation-surface-default);">
        <mt-admin-menu
          v-bind="args"
          v-model:expanded="expanded"
          :route="route"
          @navigate="onNavigate"
        />
        <main style="flex: 1; padding: var(--scale-size-32); font-size: var(--font-size-xs); color: var(--color-text-primary-default);">
          Current route: <code>{{ route.name }}</code>
        </main>
      </div>
    `,
  }),
};

export default meta;

type MtAdminMenuStory = StoryObj<MtAdminMenuMeta>;

export const Default: MtAdminMenuStory = {};

export const Collapsed: MtAdminMenuStory = {
  args: {
    expanded: false,
  },
};

export const ModuleIconColors: MtAdminMenuStory = {
  args: {
    moduleIconColors: true,
  },
};

export const LoadingUser: MtAdminMenuStory = {
  args: {
    isUserLoading: true,
    user: undefined,
  },
};
