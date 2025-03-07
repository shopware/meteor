import { userEvent } from "@storybook/test";
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

export const VisualTestWrapText = {
  name: "Tooltip wraps text",
  args: {
    maxWidth: 300,
    content:
      'This is a long tooltip. [THISISAVERYVERYVERYLONGTOOLTIPTHATSHOULDWRAP]. If you can\'t see the "[" and "]" then the tooltip is not wrapping correctly',
  },
};
