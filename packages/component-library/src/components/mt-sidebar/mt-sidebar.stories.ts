import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import MtSidebar from "./mt-sidebar.vue";
import MtText from "../mt-text/mt-text.vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import MtAvatar from "../mt-avatar/mt-avatar.vue";
import MtButton from "../mt-button/mt-button.vue";
import { navigationItems, demoNavigationTemplate } from "./_mocks/demo-navigation";

export type MtSidebarMeta = SlottedMeta<typeof MtSidebar, "header" | "default" | "footer">;

const meta: MtSidebarMeta = {
  title: "Components/Sidebar",
  component: MtSidebar,
  args: {
    ariaLabel: "Sidebar",
    width: "16rem",
    header: "",
    default: "",
    footer: "",
  },
  argTypes: {
    header: { control: { type: "text" } },
    default: { control: { type: "text" } },
    footer: { control: { type: "text" } },
  },
  render: (args) => ({
    components: { MtSidebar, MtText, MtIcon, MtAvatar, MtButton },
    setup: () => ({ args, items: navigationItems }),
    template: `
<div style="height: 480px; display: flex;">
  <mt-sidebar v-bind="args">
    <template v-if="args.header" #header>
      <div v-html="args.header"></div>
    </template>

    <template v-if="args.default" #default>
      <div v-html="args.default"></div>
    </template>
    <template v-else #default>
      ${demoNavigationTemplate}
    </template>

    <template v-if="args.footer" #footer>
      <div v-html="args.footer"></div>
    </template>
  </mt-sidebar>
</div>`,
  }),
};

export default meta;
export type MtSidebarStory = StoryObj<MtSidebarMeta>;

export const Default: MtSidebarStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-sidebar>
  <nav aria-label="Main">
    <!-- your navigation -->
  </nav>
</mt-sidebar>`,
      },
    },
  },
};

export const WithHeaderAndFooter: MtSidebarStory = {
  name: "With header and footer",
  render: () => ({
    components: { MtSidebar, MtText, MtIcon, MtAvatar, MtButton },
    setup: () => ({ items: navigationItems }),
    template: `
<div style="height: 480px; display: flex;">
  <mt-sidebar>
    <template #header>
      <mt-text as="span" size="m" weight="semibold">Administration</mt-text>
    </template>

    ${demoNavigationTemplate}

    <template #footer>
      <div style="display: flex; align-items: center; gap: var(--scale-size-12);">
        <mt-avatar size="s" first-name="Max" last-name="Mustermann" />
        <mt-text as="span" size="s" style="flex: 1;">Max Mustermann</mt-text>
        <mt-button variant="secondary" size="small" square aria-label="Log out">
          <mt-icon name="regular-sign-out" size="var(--scale-size-16)" aria-hidden="true" />
        </mt-button>
      </div>
    </template>
  </mt-sidebar>
</div>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-sidebar>
  <template #header>
    <mt-text size="m" weight="semibold">Administration</mt-text>
  </template>

  <nav aria-label="Main">
    <!-- your navigation -->
  </nav>

  <template #footer>
    <!-- user menu, logout, ... -->
  </template>
</mt-sidebar>`,
      },
    },
  },
};

export const ShortNavigation: MtSidebarStory = {
  name: "Short navigation",
  render: () => ({
    components: { MtSidebar, MtText, MtIcon },
    setup: () => ({ items: navigationItems.slice(0, 4) }),
    template: `
<div style="height: 480px; display: flex;">
  <mt-sidebar>
    <template #header>
      <mt-text as="span" size="m" weight="semibold">Administration</mt-text>
    </template>

    ${demoNavigationTemplate}

    <template #footer>
      <mt-text as="span" size="xs" color="color-text-secondary-default">Version 6.7</mt-text>
    </template>
  </mt-sidebar>
</div>`,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "When the navigation fits, nothing scrolls and no scroll shadows are shown. The footer still sits at the bottom of the sidebar.",
      },
    },
  },
};

export const CustomWidth: MtSidebarStory = {
  name: "Custom width",
  args: {
    width: "20rem",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-sidebar width="20rem">
  <nav aria-label="Main">
    <!-- your navigation -->
  </nav>
</mt-sidebar>`,
      },
    },
  },
};
