import type { Meta, StoryObj } from "@storybook/vue3";
import { markRaw } from "vue";
import MtNav from "../mt-nav.vue";
import { entries, routeFor } from "./entries";
import { StoryLink } from "./story-link";

export type MtNavMeta = Meta<typeof MtNav>;

const meta: MtNavMeta = {
  title: "Components/Nav",
  component: MtNav,
  args: {
    entries,
    route: routeFor("product.index"),
    // markRaw: a component object stored in reactive args would be made reactive otherwise
    linkComponent: markRaw(StoryLink),
    expanded: true,
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
    expanded: {
      control: { type: "boolean" },
      description:
        "Whether the navigation is expanded. Collapsed, it shows the top level icons only and opens branches in a flyout.",
    },
  },
  render: (args) => ({
    components: { MtNav },
    setup() {
      return { args };
    },
    template: `<mt-nav v-bind="args" />`,
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
