import type { SlottedMeta } from "@/_internal/story-helper";
import MtAvatar from "./mt-avatar.vue";
import type { StoryObj } from "@storybook/vue3";

export type MtAvatarMeta = SlottedMeta<typeof MtAvatar, "default">;

const meta: MtAvatarMeta = {
  title: "Components/Icons & Media/mt-avatar",
  component: MtAvatar,
  render: (args) => ({
    components: { MtAvatar },
    template: '<mt-avatar v-bind="args"></mt-avatar>',
    setup: () => {
      return {
        args,
      };
    },
  }),
  args: {
    firstName: "John",
    lastName: "Doe",
    size: "m",
    variant: "circle",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["2xs", "xs", "s", "m", "l"],
    },
    variant: {
      control: "select",
      options: ["circle", "square"],
    },
  },
};

export default meta;
export type MtAvatarStory = StoryObj<MtAvatarMeta>;

export const Default: MtAvatarStory = {
  name: "mt-avatar",
};
