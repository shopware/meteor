import type { StoryObj } from "@storybook/vue3";
import MtBadgeWebComponent from "./mt-badge.webc";

const meta = {
  title: "Components/Feedback Indicator/mt-badge (Web Component)",
  component: MtBadgeWebComponent,
  args: {
    variant: "neutral",
    size: "s",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["neutral", "info", "attention", "critical", "positive"],
    },
    size: {
      control: { type: "select" },
      options: ["s", "m", "l"],
    },
    statusIndicator: {
      control: { type: "boolean" },
    },
    icon: {
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
      <mt-badge
        :variant="args.variant"
        :size="args.size"
        :status-indicator="args.statusIndicator"
        :icon="args.icon"
      >
        Badge
      </mt-badge>`,
  }),
};

export default meta;
export type MtBadgeWebComponentStory = StoryObj<typeof meta>;

export const Default: MtBadgeWebComponentStory = {
  name: "mt-badge (Web Component)",
};
