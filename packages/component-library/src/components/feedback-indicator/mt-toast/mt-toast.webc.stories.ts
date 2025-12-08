import type { StoryObj } from "@storybook/vue3";
import MtToastWebComponent from "./mt-toast.webc";
import type { Toast } from "./mt-toast.vue";

const meta = {
  title: "Components/Feedback Indicator/mt-toast (Web Component)",
  component: MtToastWebComponent,
  args: {
    toasts: [
      {
        id: 1,
        msg: "Toast message",
        type: "informal",
      },
    ] as Toast[],
  },
  argTypes: {
    toasts: {
      control: { type: "object" },
    },
  },
  render: (args: any) => ({
    setup() {
      return {
        args,
      };
    },
    template: '<mt-toast :toasts="args.toasts"></mt-toast>',
  }),
};

export default meta;
export type MtToastWebComponentStory = StoryObj<typeof meta>;

export const Default: MtToastWebComponentStory = {
  name: "mt-toast (Web Component)",
};
