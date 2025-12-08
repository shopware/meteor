import type { StoryObj } from "@storybook/vue3";
import MtProgressBarWebComponent from "./mt-progress-bar.webc";

const meta = {
  title: "Components/Feedback Indicator/mt-progress-bar (Web Component)",
  component: MtProgressBarWebComponent,
  args: {
    label: "Progress",
    maxValue: 100,
    value: 50,
    progressLabelType: "percent",
  },
  argTypes: {
    label: {
      control: { type: "text" },
    },
    maxValue: {
      control: { type: "number" },
    },
    value: {
      control: { type: "number" },
    },
    progressLabelType: {
      control: { type: "text" },
    },
  },
  render: (args: any) => ({
    setup() {
      return {
        args,
      };
    },
    template: `
      <mt-progress-bar
        :label="args.label"
        :max-value="args.maxValue"
        :value="args.value"
        :progress-label-type="args.progressLabelType"
      ></mt-progress-bar>`,
  }),
};

export default meta;
export type MtProgressBarWebComponentStory = StoryObj<typeof meta>;

export const Default: MtProgressBarWebComponentStory = {
  name: "mt-progress-bar (Web Component)",
};
