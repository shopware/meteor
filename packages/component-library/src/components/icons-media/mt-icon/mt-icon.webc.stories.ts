import type { StoryObj } from "@storybook/vue3";
import MtIconWebComponent from "./mt-icon.webc";

const meta = {
  title: "Components/Icons & Media/mt-icon (Web Component)",
  component: MtIconWebComponent,
  args: {
    name: "regular-products",
    color: "#3498db",
    decorative: false,
  },
  argTypes: {
    name: {
      control: { type: "text" },
      description: "Icon name (e.g., 'regular-products', 'solid-3d', or 'products' with mode prop)",
    },
    color: {
      control: { type: "color" },
      description: "Icon color",
    },
    decorative: {
      control: { type: "boolean" },
      description: "Whether the icon is decorative (hidden from screen readers)",
    },
    size: {
      control: { type: "text" },
      description: "Icon size (e.g., '16px', '1rem', '20')",
    },
    mode: {
      control: { type: "select" },
      options: ["regular", "solid"],
      description: "Icon mode (only used if mode is not in the name)",
    },
  },
  render: (args: any) => ({
    setup() {
      return {
        args,
      };
    },
    template: `
      <mt-icon
        :name="args.name"
        :color="args.color"
        :decorative="args.decorative"
        :size="args.size"
        :mode="args.mode"
      ></mt-icon>`,
  }),
};

export default meta;
export type MtIconWebComponentStory = StoryObj<typeof meta>;

export const Default: MtIconWebComponentStory = {
  name: "mt-icon (Web Component)",
};
