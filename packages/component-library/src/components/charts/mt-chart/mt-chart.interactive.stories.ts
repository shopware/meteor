import { within } from "@storybook/test";
import { expect } from "@storybook/test";
import { waitUntil } from "@/_internal/test-helper";

import meta, { type MtChartStory, type MtChartMeta } from "./mt-chart.stories";

export default {
  ...meta,
  title: "Interaction Tests/Charts/mt-chart",
} as MtChartMeta;

export const VisualTestRenderChart: MtChartStory = {
  name: "Render chart",
  args: {
    options: {
      chart: {
        animations: {
          enabled: false,
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until chart is loaded and rendered
    await waitUntil(() => document.querySelector(".apexcharts-canvas"));

    expect(canvas.findByTestId("mt-chart")).toBeDefined();
  },
};

export const VisualTestRenderChartWithCorrectSize: MtChartStory = {
  name: "Render chart",
  args: {
    width: "300px",
    height: "200px",
    options: {
      chart: {
        animations: {
          enabled: false,
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until chart is loaded and rendered
    await waitUntil(() => document.querySelector(".apexcharts-canvas"));

    expect(canvas.findByTestId("mt-chart")).toBeDefined();
  },
};

export const VisualTestRenderChartWithSeries: MtChartStory = {
  name: "Render chart",
  args: {
    series: [
      {
        name: "Sample Series",
        data: [10, 20, 30, 40, 50],
      },
    ],
    options: {
      chart: {
        animations: {
          enabled: false,
        },
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until chart is loaded and rendered
    await waitUntil(() => document.querySelector(".apexcharts-canvas"));

    expect(canvas.findByTestId("mt-chart")).toBeDefined();
  },
};

export const VisualTestRenderChartWithMergedOptions: MtChartStory = {
  name: "Render chart",
  args: {
    options: {
      chart: {
        animations: {
          enabled: false,
        },
      },
      stroke: {
        curve: "smooth",
      },
      colors: ["#ff7008"],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until chart is loaded and rendered
    await waitUntil(() => document.querySelector(".apexcharts-canvas"));

    expect(canvas.findByTestId("mt-chart")).toBeDefined();
  },
};
