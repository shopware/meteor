import type { StoryObj } from "@storybook/vue3";
import MtChart from "./mt-chart.vue";
import { type SlottedMeta } from "@/_internal/story-helper";

export type MtChartMeta = SlottedMeta<typeof MtChart, "default" | "click">;

const meta = {
  title: "Components/Chart",
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

export default meta;

export type MtChartStory = StoryObj<MtChartMeta>;

export const Default: MtChartStory = {
  args: {
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      },
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<mt-chart
  type="area"
  :series="[
    {
      name: 'Sample Data',
      data: [30, 55, 65, 60, 45, 40, 55, 80],
    },
  ]"
  :options="{
    chart: {
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    },
  }"
  width="100%"
  :height="300"
/>`,
      },
    },
  },
};
