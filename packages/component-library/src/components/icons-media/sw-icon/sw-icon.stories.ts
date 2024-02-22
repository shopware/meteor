import SwIcon from "./sw-icon.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type SwIconMeta = SlottedMeta<typeof SwIcon, "default">;

const meta: SwIconMeta = {
  title: "Components/Icons & Media/sw-icon",
  component: SwIcon,
  render: (args) => ({
    components: { SwIcon },
    template: '<sw-icon v-bind="args"></sw-icon>',
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
};

export default meta;
export type SwIconStory = StoryObj<SwIconMeta>;

export const Default: SwIconStory = {
  name: "sw-icon",
};
