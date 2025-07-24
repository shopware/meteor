import type { StoryObj } from "@storybook/vue3";
import MtChart from "./mt-chart.vue";
import { type SlottedMeta } from "@/_internal/story-helper";

export type MtChartMeta = SlottedMeta<typeof MtChart, "default" | "click">;

export default {
  title: "Components/Charts/mt-chart",
  component: MtChart,
  args: {
    type: "area",
    series: [
      {
        name: "Sample Data",
        data: [30, 55, 65, 60, 45, 40, 55, 80],
      },
    ],
    width: "100%",
    height: 300,
  },
  render: (args) => ({
    components: { MtChart },
    setup: () => ({ args }),
    template: `<mt-chart v-bind="args" />`,
  }),
} as MtChartMeta;

export type MtChartStory = StoryObj<MtChartMeta>;

export const DefaultStory: MtChartStory = {
  name: "mt-chart",
};
