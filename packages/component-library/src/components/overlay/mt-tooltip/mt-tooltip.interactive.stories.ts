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
    delayDurationInMs: 500,
    hideDelayDurationInMs: 300,
  },
};

export const VisualTestTooltipRight = {
  name: "Tooltip is to the right of the trigger",
  args: {
    placement: "right",
    delayDurationInMs: 500,
    hideDelayDurationInMs: 300,
  },
};

export const VisualTestTooltipBottom = {
  name: "Tooltip is below the trigger",
  args: {
    placement: "bottom",
    delayDurationInMs: 500,
    hideDelayDurationInMs: 300,
  },
};

export const VisualTestTooltipLeft = {
  name: "Tooltip is to the left of the trigger",
  args: {
    placement: "left",
    delayDurationInMs: 500,
    hideDelayDurationInMs: 300,
  },
};

export const VisualTestWrapText = {
  name: "Tooltip wraps text",
  args: {
    maxWidth: 300,
    delayDurationInMs: 500,
    hideDelayDurationInMs: 300,
    content:
      'This is a long tooltip. [THISISAVERYVERYVERYLONGTOOLTIPTHATSHOULDWRAP]. If you can\'t see the "[" and "]" then the tooltip is not wrapping correctly',
  },
};

export const VisualTestTextWithFormat = {
  name: "Tooltip with some formatting",
  args: {
    maxWidth: 300,
    delayDurationInMs: 500,
    hideDelayDurationInMs: 300,
    content:
      '<b>Bold</b> <i>Italic</i> <u>Underline</u> <s>Strikethrough</s> <a href="https://www.mendix.com">Link</a>',
  },
};

export const VisualTestTextWithList = {
  name: "Tooltip with a list",
  args: {
    maxWidth: 300,
    delayDurationInMs: 500,
    hideDelayDurationInMs: 300,
    content: "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li><li>Item 4</li></ul>",
  },
};
