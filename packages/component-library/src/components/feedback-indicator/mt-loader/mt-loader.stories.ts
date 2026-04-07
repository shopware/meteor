import MtLoader from "./mt-loader.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtLoaderMeta = SlottedMeta<typeof MtLoader, "default">;

const meta: MtLoaderMeta = {
  title: "Components/mt-loader",
  component: MtLoader,
  render: (args) => ({
    setup: () => {
      return {
        args,
      };
    },
    components: { MtLoader },
    template: '<mt-loader v-bind="args"></mt-loader>',
  }),
  args: {
    size: "50px",
  },
};

export default meta;

export type MtLoaderStory = StoryObj<MtLoaderMeta>;

export const Default: MtLoaderStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-loader />`,
      },
    },
  },
};
