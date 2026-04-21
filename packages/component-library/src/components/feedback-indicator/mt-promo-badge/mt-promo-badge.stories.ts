import type { Meta, StoryObj } from "@storybook/vue3";
import MtPromoBadge from "./mt-promo-badge.vue";

const meta: Meta<typeof MtPromoBadge> = {
  title: "Components/mt-promo-badge",
  component: MtPromoBadge,
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
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-promo-badge variant="new" size="s" />`,
      },
    },
  },
  render: (args) => ({
    components: { MtPromoBadge },
    setup() {
      return { args };
    },
    template: '<mt-promo-badge v-bind="args">New</mt-promo-badge>',
  }),
};

export const Variants: Story = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-promo-badge variant="new" />
<mt-promo-badge variant="beta" />
<mt-promo-badge variant="shopware-ai" />`,
      },
    },
  },
  render: () => ({
    components: { MtPromoBadge },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <mt-promo-badge variant="new" />
        <mt-promo-badge variant="beta" />
        <mt-promo-badge variant="shopware-ai" />
      </div>`,
  }),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-promo-badge variant="new" size="s" />
<mt-promo-badge variant="new" size="m" />
<mt-promo-badge variant="new" size="l" />`,
      },
    },
  },
  render: () => ({
    components: { MtPromoBadge },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <mt-promo-badge variant="new" size="s" />
        <mt-promo-badge variant="new" size="m" />
        <mt-promo-badge variant="new" size="l" />
      </div>`,
  }),
};
