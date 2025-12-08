import type { StoryObj } from "@storybook/vue3";
import MtLoaderWebComponent from "./mt-loader.webc";

const meta = {
  title: "Components/Feedback Indicator/mt-loader (Web Component)",
  component: MtLoaderWebComponent,
  args: {
    size: "50px",
  },
  argTypes: {
    size: {
      control: { type: "text" },
    },
  },
  render: (args: any) => ({
    setup() {
      return {
        args,
      };
    },
    template: '<mt-loader :size="args.size"></mt-loader>',
  }),
};

export default meta;
export type MtLoaderWebComponentStory = StoryObj<typeof meta>;

export const Default: MtLoaderWebComponentStory = {
  name: "mt-loader (Web Component)",
};
