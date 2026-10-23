import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";
import MtUserMenu from "./mt-user-menu.vue";
import MtActionMenuItem from "../mt-action-menu-item/mt-action-menu-item.vue";

export type MtUserMenuMeta = Meta<typeof MtUserMenu>;

// Leaves room above the button for the menu, which opens upwards
const frameStyle = "display: flex; align-items: flex-end; width: 300px; height: 320px;";

const meta: MtUserMenuMeta = {
  title: "Components/User menu",
  component: MtUserMenu,
  args: {
    firstName: "Max",
    lastName: "Mustermann",
    role: "Administrator",
    version: "6.7.0.0",
    onLogout: fn(),
  },
  render: (args) => ({
    components: { MtUserMenu },
    setup: () => ({ args, frameStyle }),
    template: `
<div :style="frameStyle">
  <mt-user-menu v-bind="args" />
</div>`,
  }),
};

export default meta;
export type MtUserMenuStory = StoryObj<MtUserMenuMeta>;

export const Default: MtUserMenuStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-user-menu
  first-name="Max"
  last-name="Mustermann"
  role="Administrator"
  version="6.7.0.0"
  @logout="onLogout"
/>`,
      },
    },
  },
};

export const WithoutRole: MtUserMenuStory = {
  name: "Without role",
  args: {
    role: undefined,
  },
};

export const LongName: MtUserMenuStory = {
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

export const WithFurtherEntries: MtUserMenuStory = {
  name: "With further menu entries",
  render: (args) => ({
    components: { MtUserMenu, MtActionMenuItem },
    setup: () => ({ args, frameStyle }),
    template: `
<div :style="frameStyle">
  <mt-user-menu v-bind="args">
    <mt-action-menu-item icon="regular-user">Your profile</mt-action-menu-item>
    <mt-action-menu-item icon="regular-cog">Settings</mt-action-menu-item>
  </mt-user-menu>
</div>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-user-menu first-name="Max" last-name="Mustermann" @logout="onLogout">
  <mt-action-menu-item icon="regular-user">Your profile</mt-action-menu-item>
  <mt-action-menu-item icon="regular-cog">Settings</mt-action-menu-item>
</mt-user-menu>`,
      },
    },
  },
};
