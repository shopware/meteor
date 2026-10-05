import type { Meta, StoryObj } from "@storybook/vue3";
import MtTextShimmer from "./mt-text-shimmer.vue";

export type MtTextShimmerMeta = Meta<typeof MtTextShimmer>;

const meta: MtTextShimmerMeta = {
  title: "Components/Text Shimmer",
  component: MtTextShimmer,
  render: (args) => ({
    components: { MtTextShimmer },
    setup: () => ({ args }),
    template: `<mt-text-shimmer v-bind="args">Generating response...</mt-text-shimmer>`,
  }),
};

export default meta;
export type MtTextShimmerStory = StoryObj<MtTextShimmerMeta>;

export const Default: MtTextShimmerStory = {};
