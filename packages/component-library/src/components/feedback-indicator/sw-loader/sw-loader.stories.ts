import SwLoader from "./sw-loader.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type SwLoaderMeta = SlottedMeta<typeof SwLoader, "default">;

const meta: SwLoaderMeta = {
  title: "Components/Feedback Indicator/sw-loader",
  component: SwLoader,
  render: (args) => ({
    setup: () => {
      return {
        args,
      };
    },
    components: { SwLoader },
    template: '<sw-loader v-bind="args"></sw-loader>',
  }),
  args: {
    size: "50px",
  },
};

export default meta;

export type SwLoaderStory = StoryObj<SwLoaderMeta>;

export const Default: SwLoaderStory = {
  name: "sw-loader",
};
