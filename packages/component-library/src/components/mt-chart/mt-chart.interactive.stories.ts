import { expect } from "@storybook/test";
import { waitUntil } from "@/_internal/test-helper";

import meta, { type MtChartStory, type MtChartMeta } from "./mt-chart.stories";

export default {
  ...meta,
  title: "Components/Chart/Interaction tests",
  tags: ["!autodocs"],
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
    // wait until chart is loaded and rendered
    await waitUntil(() => canvasElement.querySelector(".apexcharts-canvas"));

    expect(canvasElement.querySelector(".apexcharts-canvas")).not.toBeNull();
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
    // wait until chart is loaded and rendered
    await waitUntil(() => canvasElement.querySelector(".apexcharts-canvas"));

    expect(canvasElement.querySelector(".apexcharts-canvas")).not.toBeNull();
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
    // wait until chart is loaded and rendered
    await waitUntil(() => canvasElement.querySelector(".apexcharts-canvas"));

    expect(canvasElement.querySelector(".apexcharts-canvas")).not.toBeNull();
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
    // wait until chart is loaded and rendered
    await waitUntil(() => canvasElement.querySelector(".apexcharts-canvas"));

    expect(canvasElement.querySelector(".apexcharts-canvas")).not.toBeNull();
  },
};
