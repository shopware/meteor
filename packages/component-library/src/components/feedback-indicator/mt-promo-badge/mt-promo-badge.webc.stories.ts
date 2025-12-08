import type { StoryObj } from "@storybook/vue3";
import MtPromoBadgeWebComponent from "./mt-promo-badge.webc";

const meta = {
  title: "Components/Feedback Indicator/mt-promo-badge (Web Component)",
  component: MtPromoBadgeWebComponent,
  args: {
    variant: "new",
    size: "s",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["new", "beta", "shopware-ai"],
    },
    size: {
      control: { type: "select" },
      options: ["s", "m", "l"],
    },
  },
  render: (args: any) => ({
    setup() {
      return {
        args,
      };
    },
    template: `
      <mt-promo-badge
        :variant="args.variant"
        :size="args.size"
      ></mt-promo-badge>`,
  }),
};

export default meta;
export type MtPromoBadgeWebComponentStory = StoryObj<typeof meta>;

export const Default: MtPromoBadgeWebComponentStory = {
  name: "mt-promo-badge (Web Component)",
};
