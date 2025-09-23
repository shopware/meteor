import type { Meta, StoryObj } from "@storybook/vue3";
import MtPromoBadge from "./mt-promo-badge.vue";

const meta: Meta<typeof MtPromoBadge> = {
  title: "Components/Feedback Indicator/mt-promo-badge",
  component: MtPromoBadge,
  parameters: {
    docs: {
      description: {
        component:
          "A promotional badge component for highlighting special offers, discounts, or important information.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["new", "beta", "shopware-ai"],
      description: "The visual variant of the badge",
    },
    size: {
      control: { type: "select" },
      options: ["s", "m", "l"],
      description: "The size of the badge",
    },
  },
  args: {
    variant: "new",
    size: "s",
  },
};

export default meta;
type Story = StoryObj<typeof MtPromoBadge>;

export const Default: Story = {
  render: (args) => ({
    components: { MtPromoBadge },
    setup() {
      return { args };
    },
    template: '<mt-promo-badge v-bind="args">New</mt-promo-badge>',
  }),
};
