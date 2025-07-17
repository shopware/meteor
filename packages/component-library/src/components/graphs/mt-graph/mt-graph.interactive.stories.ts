import { within } from "@storybook/test";
import { expect } from "@storybook/test";
import { waitUntil } from "@/_internal/test-helper";

import meta, { type MtGraphStory, type MtGraphMeta } from "./mt-graph.stories";

export default {
  ...meta,
  title: "Interaction Tests/Graphs/mt-graph",
  tags: ["mt-graph"],
} as MtGraphMeta;

export const VisualTestRenderGraph: MtGraphStory = {
  name: "Render graph",
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

    // wait until graph is loaded and rendered
    await waitUntil(() => document.querySelector(".apexcharts-canvas"));

    expect(canvas.findByTestId("mt-graph")).toBeDefined();
  },
};

export const VisualTestRenderGraphWithCorrectSize: MtGraphStory = {
  name: "Render graph",
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

    // wait until graph is loaded and rendered
    await waitUntil(() => document.querySelector(".apexcharts-canvas"));

    expect(canvas.findByTestId("mt-graph")).toBeDefined();
  },
};

export const VisualTestRenderGraphWithSeries: MtGraphStory = {
  name: "Render graph",
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

    // wait until graph is loaded and rendered
    await waitUntil(() => document.querySelector(".apexcharts-canvas"));

    expect(canvas.findByTestId("mt-graph")).toBeDefined();
  },
};

export const VisualTestRenderGraphWithMergedOptions: MtGraphStory = {
  name: "Render graph",
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

    // wait until graph is loaded and rendered
    await waitUntil(() => document.querySelector(".apexcharts-canvas"));

    expect(canvas.findByTestId("mt-graph")).toBeDefined();
  },
};
