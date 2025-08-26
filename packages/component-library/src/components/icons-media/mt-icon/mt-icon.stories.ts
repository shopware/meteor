import MtIcon from "./mt-icon.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtIconMeta = SlottedMeta<typeof MtIcon, "default">;

const meta: MtIconMeta = {
  title: "Components/Icons & Media/mt-icon",
  component: MtIcon,
  render: (args) => ({
    components: { MtIcon },
    template: '<mt-icon v-bind="args"></mt-icon>',
    setup: () => {
      return {
        args,
      };
    },
  }),
  args: {
    name: "regular-products",
    color: "#3498db",
    decorative: false,
  },
  argTypes: {
    style: {
      control: "object",
    },
  },
};

export default meta;
export type MtIconStory = StoryObj<MtIconMeta>;

export const Default: MtIconStory = {
  name: "mt-icon",
};
