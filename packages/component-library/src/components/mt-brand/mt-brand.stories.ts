import type { Meta, StoryObj } from "@storybook/vue3";
import MtBrand from "./mt-brand.vue";

export type MtBrandMeta = Meta<typeof MtBrand>;

const meta: MtBrandMeta = {
  title: "Components/Brand",
  component: MtBrand,
  args: {
    title: "Demo shop",
    subtitle: "Shopware",
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
        code: `<mt-brand title="Demo shop" subtitle="Shopware" />`,
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
