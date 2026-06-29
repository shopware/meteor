import { expect, userEvent, within } from "@storybook/test";
import type { StoryObj } from "@storybook/vue3";
import meta from "./tooltip.stories";
import { waitUntil } from "../_internal/test-helper";

type Story = StoryObj<typeof meta>;

export default {
  ...meta,
  title: "Directives/Tooltip/Interaction tests",
  tags: ["!autodocs"],
} as typeof meta;

export const VisualTestRenderIcon: Story = {
  name: "Render icon",
};

export const VisualTestRenderTooltip: Story = {
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

    const tooltip = within(document.getElementsByClassName("mt-tooltip")[0] as HTMLElement);
    const helpText = tooltip.getByText("This is the help text");

    expect(helpText).toBeDefined();
  },
};

export const VisualTestRenderTooltipInWide: Story = {
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

    const tooltip = within(document.getElementsByClassName("mt-tooltip")[0] as HTMLElement);
    const helpText = tooltip.getByText("This is the help text");

    expect(helpText).toBeDefined();
  },
};
