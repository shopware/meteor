import type { StoryObj } from "@storybook/vue3";
import MtBannerWebComponent from "./mt-banner.webc";

const meta = {
  title: "Components/Feedback Indicator/mt-banner (Web Component)",
  component: MtBannerWebComponent,
  args: {
    variant: "neutral",
    title: "Banner Title",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["neutral", "info", "attention", "critical", "positive", "inherited"],
    },
    title: {
      control: { type: "text" },
    },
    hideIcon: {
      control: { type: "boolean" },
    },
    closable: {
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
      <mt-banner
        :variant="args.variant"
        :title="args.title"
        :hide-icon="args.hideIcon"
        :closable="args.closable"
        :icon="args.icon"
      >
        This is a banner message.
      </mt-banner>`,
  }),
};

export default meta;
export type MtBannerWebComponentStory = StoryObj<typeof meta>;

export const Default: MtBannerWebComponentStory = {
  name: "mt-banner (Web Component)",
};
