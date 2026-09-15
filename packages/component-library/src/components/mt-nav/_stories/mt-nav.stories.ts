import type { Meta, StoryObj } from "@storybook/vue3";
import { markRaw, ref, watch } from "vue";
import MtNav from "../mt-nav.vue";
import type { NavEntry, NavRoute } from "../mt-nav.types";
import { routeFor, sections } from "./entries";
import { StoryLink } from "./story-link";

export type MtNavMeta = Meta<typeof MtNav>;

const meta: MtNavMeta = {
  title: "Components/Nav",
  component: MtNav,
  args: {
    sections,
    route: routeFor("product.index"),
    // markRaw: a component object stored in reactive args would be made reactive otherwise
    linkComponent: markRaw(StoryLink),
    expanded: true,
  },
  argTypes: {
    sections: {
      description:
        "Sections with an optional `header` and a tree of translated entries, nested via `children`. Pass only entries the user may see.",
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
    expanded: {
      control: { type: "boolean" },
      description:
        "Whether the navigation is expanded. Collapsed, it shows the top level icons only and opens branches in a flyout.",
    },
  },
  // Follows the clicked entry with a fake route so the active state changes like in an application
  render: (args) => ({
    components: { MtNav },
    setup() {
      const route = ref<NavRoute | undefined>(args.route);

      watch(
        () => args.route,
        (value) => (route.value = value),
      );

      function onNavigate(entry: NavEntry) {
        if (entry.path) {
          route.value = { ...routeFor(entry.path), params: entry.params ?? {} };
        }
      }

      return { args, route, onNavigate };
    },
    template: `<mt-nav v-bind="args" :route="route" @navigate="onNavigate" />`,
  }),
};

export default meta;

export type MtNavStory = StoryObj<MtNavMeta>;

export const Default: MtNavStory = {};

export const Collapsed: MtNavStory = {
  args: {
    expanded: false,
  },
};
