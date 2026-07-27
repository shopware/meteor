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

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

export const Line: MtChartStory = {
  args: {
    type: "line",
    options: {
      stroke: { curve: "smooth" },
      xaxis: { categories: months },
    },
  },
};

export const Bar: MtChartStory = {
  args: {
    type: "bar",
    series: [{ name: "Revenue", data: [44, 55, 41, 67, 22, 43, 21, 49] }],
    options: {
      xaxis: { categories: months },
    },
  },
};

export const Donut: MtChartStory = {
  args: {
    type: "donut",
    series: [44, 25, 18, 13],
    options: {
      labels: ["Direct", "Organic", "Referral", "Social"],
      colors: ["#0870ff", "#ff7008", "#00b894", "#a29bfe"],
    },
  },
};

export const MultipleSeries: MtChartStory = {
  args: {
    type: "area",
    series: [
      { name: "This year", data: [30, 55, 65, 60, 45, 40, 55, 80] },
      { name: "Last year", data: [20, 35, 40, 50, 40, 30, 45, 60] },
    ],
    options: {
      stroke: { curve: "smooth" },
      colors: ["#0870ff", "#ff7008"],
      xaxis: { categories: months },
    },
  },
};
