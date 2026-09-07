import type { Meta, StoryObj } from "@storybook/vue3";
import { ref } from "vue";
import MtSidebar from "../mt-sidebar.vue";
import MtBadge from "../../mt-badge/mt-badge.vue";
import type { SidebarRoute, SidebarTreeEntry } from "../mt-sidebar.types";
import { entries, routeFor, user } from "./entries";
import { StoryLink } from "./story-link";
import { StoryLogo } from "./story-logo";
import { StoryLayout } from "./story-layout";
import { StoryUserActions } from "./story-user-actions";
import { StoryFooter } from "./story-footer";

export type MtSidebarMeta = Meta<typeof MtSidebar>;

const components = { MtSidebar, MtBadge, StoryLogo, StoryLayout, StoryUserActions, StoryFooter };

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

      return { args, route, expanded, onNavigate, onAction };
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

  <template #user-actions>
    <story-user-actions @action="onAction" />
  </template>
</mt-sidebar>`;

const meta: MtSidebarMeta = {
  title: "Components/Sidebar",
  component: MtSidebar,
  args: {
    entries,
    linkComponent: StoryLink,
    title: "Demo store",
    subtitle: "Administration",
    user,
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
    title: {
      control: { type: "text" },
      description: "Heading next to the logo.",
    },
    subtitle: {
      control: { type: "text" },
      description: "Secondary line below the title.",
    },
    user: {
      description:
        "Renders the default footer with avatar, name and title. Combine with the `user-actions` slot or `version` to get a menu.",
    },
    version: {
      control: { type: "text" },
      description: "Version shown at the bottom of the user menu.",
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
  ...createStory(defaultTemplate),
};

export default meta;

type MtSidebarStory = StoryObj<MtSidebarMeta>;

export const Default: MtSidebarStory = {};

export const Collapsed: MtSidebarStory = {
  args: {
    expanded: false,
  },
};

export const ModuleIconColors: MtSidebarStory = {
  args: {
    moduleIconColors: true,
  },
};

export const LoadingUser: MtSidebarStory = {
  args: {
    isUserLoading: true,
    user: undefined,
  },
};

/**
 * Nothing is branded by default: no logo, no heading, no footer. The expand button is shown
 * permanently in the collapsed state because there is no logo to crossfade with.
 */
export const WithoutBranding: MtSidebarStory = {
  args: {
    title: undefined,
    subtitle: undefined,
    user: undefined,
    version: undefined,
  },
  ...createStory(`
${sidebarOpenTag}
</mt-sidebar>`),
};

/**
 * With a `user` but neither `user-actions` nor `version`, the footer shows the user without a menu.
 */
export const UserWithoutMenu: MtSidebarStory = {
  args: {
    version: undefined,
  },
  ...createStory(`
${sidebarOpenTag}
  <template #logo>
    <story-logo />
  </template>
</mt-sidebar>`),
};

/**
 * The scoped `entry-suffix` slot renders after the label of every entry, including nested ones and
 * the flyout of the collapsed sidebar.
 */
export const EntrySuffix: MtSidebarStory = createStory(`
${sidebarOpenTag}
  <template #logo>
    <story-logo />
  </template>

  <template #entry-suffix="{ entry }">
    <mt-badge v-if="entry.id === 'order'" variant="critical" size="s">12</mt-badge>
    <mt-badge v-else-if="entry.id === 'review'" variant="info" size="s">3</mt-badge>
  </template>

  <template #user-actions>
    <story-user-actions @action="onAction" />
  </template>
</mt-sidebar>`);

/**
 * The `footer` slot replaces the default user block entirely.
 */
export const CustomFooter: MtSidebarStory = createStory(`
${sidebarOpenTag}
  <template #logo>
    <story-logo />
  </template>

  <template #footer>
    <story-footer :user-name="args.user.firstName" @logout="onAction('Logout')" />
  </template>
</mt-sidebar>`);

/**
 * The `version` slot replaces the plain version text in the user menu, e.g. with a release link.
 */
export const CustomVersion: MtSidebarStory = createStory(`
${sidebarOpenTag}
  <template #logo>
    <story-logo />
  </template>

  <template #user-actions>
    <story-user-actions @action="onAction" />
  </template>

  <template #version>
    <a href="https://github.com/shopware/shopware/releases" target="_blank">6.7.0.0</a>
  </template>
</mt-sidebar>`);
