import meta from "./tooltip.stories";
import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";
import { waitUntil } from "../_internal/test-helper";

export default {
  ...meta,
  title: "Interaction Tests/Directives/Tooltip",
};

export const VisualTestRenderIcon = {
  name: "Render icon",
};

export const VisualTestRenderTooltip = {
  name: "Render tooltip",
  args: {
    message: "This is the help text",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const icon = await canvas.getByTestId("mt-icon__regular-question-circle");

    await userEvent.hover(icon);

    // wait until tooltip is loaded
    await waitUntil(() => document.querySelector(".mt-tooltip"));

    const tooltip = within(document.getElementsByClassName("mt-tooltip")[0]);
    const helpText = tooltip.getByText("This is the help text");

    expect(helpText).toBeDefined();
  },
};

export const VisualTestRenderTooltipInWide = {
  name: "Render tooltip in wide",
  args: {
    message: "This is the help text",
    width: 300,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const icon = canvas.getByTestId("mt-icon__regular-question-circle");

    await userEvent.hover(icon);

    // wait until tooltip is loaded
    await waitUntil(() => document.querySelector(".mt-tooltip"));
    await waitUntil(() => document.querySelector(".mt-tooltip"));

    const tooltip = within(document.getElementsByClassName("mt-tooltip")[0]);
    const helpText = tooltip.getByText("This is the help text");

    expect(helpText).toBeDefined();
  },
};
