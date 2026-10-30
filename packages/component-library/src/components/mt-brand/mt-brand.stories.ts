import type { Meta, StoryObj } from "@storybook/vue3";
import MtBrand from "./mt-brand.vue";

export type MtBrandMeta = Meta<typeof MtBrand>;

const meta: MtBrandMeta = {
  title: "Components/Brand",
  component: MtBrand,
  parameters: {
    docs: {
      description: {
        component: "**Experimental.** The API may still change in a future release.",
      },
    },
  },
  args: {
    title: "Meteor",
    subtitle: "Shopware",
    variant: "shopware",
    appearance: "dark",
    compact: false,
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["shopware", "copilot", "intelligence", "nexus", "payments"],
    },
    appearance: {
      control: { type: "select" },
      options: ["dark", "light"],
    },
  },
  render: (args) => ({
    components: { MtBrand },
    setup: () => ({ args }),
    template: `
<div style="width: 300px;">
  <mt-brand v-bind="args" />
</div>`,
  }),
};

export default meta;
export type MtBrandStory = StoryObj<MtBrandMeta>;

export const Default: MtBrandStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-brand />`,
      },
    },
  },
};

export const WithoutSubtitle: MtBrandStory = {
  name: "Without subtitle",
  args: {
    subtitle: undefined,
  },
};

export const LongTitle: MtBrandStory = {
  name: "Long title",
  args: {
    title: "The demo shop with a very long name that does not fit",
  },
  parameters: {
    docs: {
      description: {
        story: "A title that does not fit is cut off with an ellipsis and shown in full on hover.",
      },
    },
  },
};

export const Variants: MtBrandStory = {
  args: {
    subtitle: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: "Each variant shows the logo of one Shopware product.",
      },
      source: {
        language: "html",
        code: `<mt-brand title="Shopware Copilot" variant="copilot" />`,
      },
    },
  },
  render: (args) => ({
    components: { MtBrand },
    setup: () => ({ args }),
    template: `
<div style="display: flex; flex-direction: column; gap: 16px; width: 300px;">
  <mt-brand v-bind="args" variant="shopware" title="Shopware" />
  <mt-brand v-bind="args" variant="copilot" title="Shopware Copilot" />
  <mt-brand v-bind="args" variant="intelligence" title="Shopware Intelligence" />
  <mt-brand v-bind="args" variant="nexus" title="Shopware Nexus" />
  <mt-brand v-bind="args" variant="payments" title="Shopware Payments" />
</div>`,
  }),
};

export const Appearances: MtBrandStory = {
  args: {
    title: "Shopware Payments",
    subtitle: undefined,
    variant: "payments",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The dark appearance shows a white mark on a brand box, the light appearance a brand mark on a white box.",
      },
      source: {
        language: "html",
        code: `<mt-brand title="Shopware Payments" variant="payments" appearance="light" />`,
      },
    },
  },
  render: (args) => ({
    components: { MtBrand },
    setup: () => ({ args }),
    template: `
<div style="display: flex; flex-direction: column; gap: 16px; width: 300px;">
  <mt-brand v-bind="args" appearance="dark" />
  <div style="padding: 16px; background: var(--color-background-tertiary-default);">
    <mt-brand v-bind="args" appearance="light" />
  </div>
</div>`,
  }),
};

export const Compact: MtBrandStory = {
  args: {
    compact: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows only the logo. The title shows on hover and stays available to screen readers.",
      },
      source: {
        language: "html",
        code: `<mt-brand title="Demo shop" compact />`,
      },
    },
  },
};
