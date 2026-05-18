import MtLoader from "./mt-loader.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

export type MtLoaderMeta = Meta<typeof MtLoader>;

const meta: MtLoaderMeta = {
  title: "Components/Loader",
  component: MtLoader,
  argTypes: {
    size: {
      control: "text",
      description: "The size of the loader spinner.",
    },
    headline: {
      control: "text",
      description: "Optional headline shown below the spinner.",
    },
    description: {
      control: "text",
      description: "Optional description shown below the headline.",
    },
  },
  render: (args) => ({
    setup: () => {
      return {
        args,
      };
    },
    components: { MtLoader },
    template: '<mt-loader v-bind="args" />',
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

export const WithText: MtLoaderStory = {
  name: "With text",
  args: {
    headline: "Loading data",
    description: "This may take a few seconds.",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-loader
  headline="Loading data"
  description="This may take a few seconds."
/>`,
      },
    },
  },
};
