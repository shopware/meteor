import type { Meta, StoryObj } from "@storybook/vue3";
import { markRaw, ref } from "vue";
import MtSidebar from "../mt-sidebar.vue";
import type { SidebarRoute, SidebarTreeEntry } from "../mt-sidebar.types";
import { entries, routeFor, user } from "./entries";
import { StoryLink } from "./story-link";
import { StoryLogo } from "./story-logo";
import { StoryLayout } from "./story-layout";
import { StoryUserFooter } from "./story-user-footer";

export type MtSidebarMeta = Meta<typeof MtSidebar>;

const components = { MtSidebar, StoryLogo, StoryLayout, StoryUserFooter };

/**
 * Renders the sidebar inside `StoryLayout` and wires the `navigate` event to a fake route so the
 * active state follows the clicks.
 */
function createRender(sidebarTemplate: string) {
  return (args: Record<string, unknown>) => ({
    components,
    setup() {
      const route = ref<SidebarRoute>(routeFor("product.index"));
      const expanded = ref((args.expanded as boolean | undefined) ?? true);

      function onNavigate(entry: SidebarTreeEntry) {
        if (entry.path) {
          route.value = { ...routeFor(entry.path), params: entry.params ?? {} };
        }
      }

      function onAction(name: string) {
        alert(`${name} clicked`);
      }

      return { args, route, expanded, user, onNavigate, onAction };
    },
    template: `
      <story-layout :route="route">
        ${sidebarTemplate}
      </story-layout>
    `,
  });
}

function createStory(template: string): MtSidebarStory {
  return {
    render: createRender(template),
    parameters: {
      docs: {
        source: {
          code: template.trim(),
        },
      },
    },
  };
}

const sidebarOpenTag = `<mt-sidebar
  v-bind="args"
  v-model:expanded="expanded"
  :route="route"
  @navigate="onNavigate"
>`;

const defaultTemplate = `
${sidebarOpenTag}
  <template #logo>
    <story-logo />
  </template>

  <template #footer>
    <story-user-footer :user="user" version="6.7.0.0" @action="onAction" />
  </template>
</mt-sidebar>`;

const meta: MtSidebarMeta = {
  title: "Components/Sidebar",
  component: MtSidebar,
  args: {
    entries,
    // markRaw: a component object stored in reactive args would be made reactive otherwise
    linkComponent: markRaw(StoryLink),
    title: "Demo store",
    subtitle: "Administration",
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
    title: {
      control: { type: "text" },
      description: "Heading next to the logo.",
    },
    subtitle: {
      control: { type: "text" },
      description: "Secondary line below the title.",
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
  ...createStory(defaultTemplate),
};

export default meta;

export type MtSidebarStory = StoryObj<MtSidebarMeta>;

/**
 * The `footer` slot holds a user block with an action menu, built from `mt-avatar`, `mt-action-menu`
 * and reka-ui's dropdown primitives. See `StoryUserFooter` for the implementation.
 */
export const Default: MtSidebarStory = {};

export const Collapsed: MtSidebarStory = {
  args: {
    expanded: false,
  },
};
