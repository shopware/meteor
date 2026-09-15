import type { Meta, StoryObj } from "@storybook/vue3";
import { markRaw, ref, watch } from "vue";
import MtNav from "../mt-nav.vue";
import MtNavSection from "../mt-nav-section.vue";
import MtNavItem from "../mt-nav-item.vue";
import type { NavItem, NavRoute } from "../mt-nav.types";
import { items, routeFor, shopItems, systemItems } from "./entries";
import { StoryLink } from "./story-link";

export type MtNavMeta = Meta<typeof MtNav>;

/**
 * Renders the given template with the sample items and follows the clicked item with a fake
 * route, so the active state changes like in an application.
 */
function createStory(template: string): MtNavStory {
  return {
    render: (args) => ({
      components: { MtNav, MtNavSection, MtNavItem },
      setup() {
        const route = ref<NavRoute | undefined>(args.route);

        watch(
          () => args.route,
          (value) => (route.value = value),
        );

        function onNavigate(item: NavItem) {
          if (item.path) {
            route.value = { ...routeFor(item.path), params: item.params ?? {} };
          }
        }

        return { args, route, onNavigate, items, shopItems, systemItems };
      },
      template,
    }),
    parameters: {
      docs: {
        source: {
          code: template.trim(),
        },
      },
    },
  };
}

const defaultTemplate = `
<mt-nav v-bind="args" :route="route" @navigate="onNavigate">
  <mt-nav-section>
    <mt-nav-item v-for="item in items" :key="item.id" :item="item" />
  </mt-nav-section>
</mt-nav>`;

const sectionsTemplate = `
<mt-nav v-bind="args" :route="route" @navigate="onNavigate">
  <mt-nav-section header="Shop">
    <mt-nav-item v-for="item in shopItems" :key="item.id" :item="item" />
  </mt-nav-section>

  <mt-nav-section header="System">
    <mt-nav-item v-for="item in systemItems" :key="item.id" :item="item" />
  </mt-nav-section>
</mt-nav>`;

const meta: MtNavMeta = {
  title: "Components/Nav",
  component: MtNav,
  subcomponents: { MtNavSection, MtNavItem },
  args: {
    route: routeFor("product.index"),
    // markRaw: a component object stored in reactive args would be made reactive otherwise
    linkComponent: markRaw(StoryLink),
    expanded: true,
  },
  argTypes: {
    route: {
      description:
        "The current route (`name`, `path`, `params`, `matched`, `meta`). Highlights the active item and opens its branch.",
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
        "Whether the navigation is expanded. Collapsed, it shows the top level icons only.",
    },
  },
  ...createStory(defaultTemplate),
};

export default meta;

export type MtNavStory = StoryObj<MtNavMeta>;

/**
 * A single `mt-nav-section` without a header holds the `mt-nav-item` rows.
 */
export const Default: MtNavStory = {};

/**
 * Several sections, each with a `header` above its items.
 */
export const Sections: MtNavStory = createStory(sectionsTemplate);

export const Collapsed: MtNavStory = {
  args: {
    expanded: false,
  },
};
