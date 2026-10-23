import type { Meta, StoryObj } from "@storybook/vue3";
import MtUserMenu from "./mt-user-menu.vue";
import MtActionMenuGroup from "../mt-action-menu-group/mt-action-menu-group.vue";
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
    subtitle: "Administrator",
  },
  render: (args) => ({
    components: { MtUserMenu, MtActionMenuGroup, MtActionMenuItem },
    setup: () => ({ args, frameStyle }),
    template: `
<div :style="frameStyle">
  <mt-user-menu v-bind="args">
    <mt-action-menu-group>
      <mt-action-menu-item icon="regular-user">Your profile</mt-action-menu-item>
      <mt-action-menu-item icon="regular-cog">Settings</mt-action-menu-item>
    </mt-action-menu-group>

    <mt-action-menu-group>
      <mt-action-menu-item icon="regular-sign-out" variant="critical">Log out</mt-action-menu-item>
    </mt-action-menu-group>
  </mt-user-menu>
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
        code: `<mt-user-menu first-name="Max" last-name="Mustermann" subtitle="Administrator">
  <mt-action-menu-group>
    <mt-action-menu-item icon="regular-user">Your profile</mt-action-menu-item>
    <mt-action-menu-item icon="regular-cog">Settings</mt-action-menu-item>
  </mt-action-menu-group>

  <mt-action-menu-group>
    <mt-action-menu-item icon="regular-sign-out" variant="critical" @select="logout">
      Log out
    </mt-action-menu-item>
  </mt-action-menu-group>
</mt-user-menu>`,
      },
    },
  },
};

export const WithoutSubtitle: MtUserMenuStory = {
  name: "Without subtitle",
  args: {
    subtitle: undefined,
  },
};

export const LongName: MtUserMenuStory = {
  name: "Long name",
  args: {
    firstName: "Maximilian Alexander",
    lastName: "Mustermann-Musterfrau",
    subtitle: "Administrator of the demo shop",
  },
  parameters: {
    docs: {
      description: {
        story: "A name or subtitle that does not fit is cut off with an ellipsis.",
      },
    },
  },
};
