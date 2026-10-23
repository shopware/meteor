import type { Meta, StoryObj } from "@storybook/vue3";
import MtLogo from "./mt-logo.vue";

export type MtLogoMeta = Meta<typeof MtLogo>;

const meta: MtLogoMeta = {
  title: "Components/Logo",
  component: MtLogo,
  args: {
    title: "Demo shop",
    subtitle: "Shopware",
  },
  render: (args) => ({
    components: { MtLogo },
    setup: () => ({ args }),
    template: `
<div style="width: 300px;">
  <mt-logo v-bind="args" />
</div>`,
  }),
};

export default meta;
export type MtLogoStory = StoryObj<MtLogoMeta>;

export const Default: MtLogoStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-logo title="Demo shop" subtitle="Shopware" />`,
      },
    },
  },
};

export const WithoutSubtitle: MtLogoStory = {
  name: "Without subtitle",
  args: {
    subtitle: undefined,
  },
};

export const LongTitle: MtLogoStory = {
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
