import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";
import MtSidebarFooter from "./mt-sidebar-footer.vue";
import MtActionMenuItem from "../mt-action-menu-item/mt-action-menu-item.vue";

export type MtSidebarFooterMeta = Meta<typeof MtSidebarFooter>;

// Mimics the footer area of mt-sidebar, with room above it for the menu, which opens upwards
const frameStyle =
  "display: flex; align-items: flex-end; width: 300px; height: 320px; padding: var(--scale-size-8) var(--scale-size-12); background: var(--color-elevation-surface-sunken);";

const meta: MtSidebarFooterMeta = {
  title: "Components/Sidebar/Footer",
  component: MtSidebarFooter,
  args: {
    firstName: "Max",
    lastName: "Mustermann",
    role: "Administrator",
    version: "6.7.0.0",
    onLogout: fn(),
  },
  render: (args) => ({
    components: { MtSidebarFooter },
    setup: () => ({ args, frameStyle }),
    template: `
<div :style="frameStyle">
  <mt-sidebar-footer v-bind="args" />
</div>`,
  }),
};

export default meta;
export type MtSidebarFooterStory = StoryObj<MtSidebarFooterMeta>;

export const Default: MtSidebarFooterStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-sidebar>
  <mt-nav :sections="sections" />

  <template #footer>
    <mt-sidebar-footer
      first-name="Max"
      last-name="Mustermann"
      role="Administrator"
      version="6.7.0.0"
      @logout="onLogout"
    />
  </template>
</mt-sidebar>`,
      },
    },
  },
};

export const WithoutRole: MtSidebarFooterStory = {
  name: "Without role",
  args: {
    role: undefined,
  },
};

export const LongName: MtSidebarFooterStory = {
  name: "Long name",
  args: {
    firstName: "Maximilian Alexander",
    lastName: "Mustermann-Musterfrau",
    role: "Administrator of the demo shop",
  },
  parameters: {
    docs: {
      description: {
        story: "A name or role that does not fit is cut off with an ellipsis.",
      },
    },
  },
};

export const WithFurtherEntries: MtSidebarFooterStory = {
  name: "With further menu entries",
  render: (args) => ({
    components: { MtSidebarFooter, MtActionMenuItem },
    setup: () => ({ args, frameStyle }),
    template: `
<div :style="frameStyle">
  <mt-sidebar-footer v-bind="args">
    <mt-action-menu-item icon="regular-user">Your profile</mt-action-menu-item>
    <mt-action-menu-item icon="regular-cog">Settings</mt-action-menu-item>
  </mt-sidebar-footer>
</div>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-sidebar-footer first-name="Max" last-name="Mustermann" @logout="onLogout">
  <mt-action-menu-item icon="regular-user">Your profile</mt-action-menu-item>
  <mt-action-menu-item icon="regular-cog">Settings</mt-action-menu-item>
</mt-sidebar-footer>`,
      },
    },
  },
};
