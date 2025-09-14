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
      options: ["small", "medium", "large"],
      description: "The size of the badge",
    },
  },
  args: {
    variant: "new",
    size: "medium",
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

export const AllVariants: Story = {
  render: () => ({
    components: { MtPromoBadge },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <mt-promo-badge variant="new">New</mt-promo-badge>
        <mt-promo-badge variant="beta">Beta</mt-promo-badge>
        <mt-promo-badge variant="shopware-ai">Shopware AI</mt-promo-badge>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    components: { MtPromoBadge },
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <mt-promo-badge size="small">Small</mt-promo-badge>
        <mt-promo-badge size="medium">Medium</mt-promo-badge>
        <mt-promo-badge size="large">Large</mt-promo-badge>
      </div>
    `,
  }),
};

export const WithLongText: Story = {
  render: () => ({
    components: { MtPromoBadge },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <mt-promo-badge variant="new">New Feature Available</mt-promo-badge>
        <mt-promo-badge variant="beta">Beta Testing Phase</mt-promo-badge>
        <mt-promo-badge variant="shopware-ai">AI-Powered Feature</mt-promo-badge>
      </div>
    `,
  }),
};

export const Interactive: Story = {
  render: () => ({
    components: { MtPromoBadge },
    template: `
      <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">
        <mt-promo-badge variant="new" style="cursor: pointer;">Clickable Badge</mt-promo-badge>
        <mt-promo-badge variant="beta" style="cursor: pointer;">Hover Me</mt-promo-badge>
        <mt-promo-badge variant="shopware-ai" style="cursor: pointer;">Interactive</mt-promo-badge>
      </div>
    `,
  }),
};
