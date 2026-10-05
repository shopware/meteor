import type { Meta, StoryObj } from "@storybook/vue3";
import MtContextUsage from "./mt-context-usage.vue";

export type MtContextUsageMeta = Meta<typeof MtContextUsage>;

const meta: MtContextUsageMeta = {
  title: "Components/Context Usage",
  component: MtContextUsage,
  args: {
    used: 84_000,
    total: 200_000,
  },
  render: (args) => ({
    components: { MtContextUsage },
    setup: () => ({ args }),
    template: `<mt-context-usage v-bind="args" />`,
  }),
};

export default meta;
export type MtContextUsageStory = StoryObj<MtContextUsageMeta>;

export const Default: MtContextUsageStory = {};
