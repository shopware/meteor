import { userEvent, within } from "@storybook/test";
import type { MtTooltipMeta } from "./mt-tooltip.stories";
import MtTooltipStory from "./mt-tooltip.stories";

export default {
  ...MtTooltipStory,
  title: "Interaction Tests/Overlay/mt-tooltip",
  decorators: [
    () => ({
      template: `<div style="height: calc(100vh - 1rem * 2); width: 100%; display: grid; place-items: center;"><story/></div>`,
    }),
  ],
  async play() {
    await userEvent.tab();
  },
} as MtTooltipMeta;

export const VisualTestTooltipTop = {
  name: "Tooltip is above the trigger",
  args: {
    placement: "top",
  },
};

export const VisualTestTooltipRight = {
  name: "Tooltip is to the right of the trigger",
  args: {
    placement: "right",
  },
};

export const VisualTestTooltipBottom = {
  name: "Tooltip is below the trigger",
  args: {
    placement: "bottom",
  },
};

export const VisualTestTooltipLeft = {
  name: "Tooltip is to the left of the trigger",
  args: {
    placement: "left",
  },
};

export const VisualTestTooltipCustomHTML = {
  name: "Tooltip with custom HTML",
  args: {
    content: "<p style='text-decoration: underline;'>This is a custom tooltip</p>",
  },
};
