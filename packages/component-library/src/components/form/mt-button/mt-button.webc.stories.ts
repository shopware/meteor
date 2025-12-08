import type { StoryObj } from "@storybook/vue3";
import MtButtonWebComponent from "./mt-button.webc";
// Import needed to register the mt-icon custom element
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.webc";

const meta = {
  title: "Components/Form/mt-button (Web Component)",
  component: MtButtonWebComponent,
  args: {
    variant: "primary",
    size: "small",
    disabled: false,
    square: false,
    block: false,
    "is-loading": false,
    ghost: false,
    link: undefined,
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "tertiary", "critical", "action"],
    },
    size: {
      control: { type: "select" },
      options: ["x-small", "small", "default", "large"],
    },
    disabled: {
      control: { type: "boolean" },
    },
    square: {
      control: { type: "boolean" },
    },
    block: {
      control: { type: "boolean" },
    },
    "is-loading": {
      control: { type: "boolean" },
    },
    ghost: {
      control: { type: "boolean" },
    },
    link: {
      control: { type: "text" },
    },
    showFrontIcon: {
      control: "boolean",
      description: "Show/hide front icon",
      defaultValue: false,
    },
    showBackIcon: {
      control: "boolean",
      description: "Show/hide back icon",
      defaultValue: false,
    },
  },
  render: (args: any) => ({
    setup() {
      return {
        args,
      };
    },
    template: `
      <mt-button
        :variant="args.variant"
        :size="args.size"
        :disabled="args.disabled ? true : null"
        :square="args.square ? true : null"
        :block="args.block ? true : null"
        :is-loading="args['is-loading'] ? true : null"
        :ghost="args.ghost ? true : null"
        :link="args.link"
      >
        Button
      </mt-button>`,
  }),
};

export default meta;
export type MtButtonWebComponentStory = StoryObj<typeof meta>;

export const Default: MtButtonWebComponentStory = {
  name: "mt-button (Web Component)",
  args: {
    variant: "primary",
    size: "small",
    disabled: false,
    square: false,
    block: false,
    "is-loading": false,
    ghost: false,
    link: undefined,
  },
};
