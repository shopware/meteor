import { waitUntil } from "../../../_internal/test-helper";
import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtPopoverMeta, type MtPopoverStory } from "./mt-popover.stories";

export default {
  ...meta,
  title: "Interaction Tests/Overlay/mt-popover",
} as MtPopoverMeta;

export const VisualTestRenderPopoverTrigger: MtPopoverStory = {
  name: "Should render only the popover trigger",
};

export const VisualTestRenderPopover: MtPopoverStory = {
  name: "Should render the popover",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitUntil(() => document.body.textContent?.includes("Toggle popover"));

    const popoverToggle = canvas.getByText("Toggle popover");
    await userEvent.click(popoverToggle);

    const popover = within(document.querySelector(".mt-floating-ui__content") as HTMLElement);
    expect(popover.getByText("Popover example")).toBeInTheDocument();
  },
};

export const VisualTestRenderChildView: MtPopoverStory = {
  name: "Should render the popover with child view",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitUntil(() => document.body.textContent?.includes("Toggle popover"));

    const popoverToggle = canvas.getByText("Toggle popover");
    await userEvent.click(popoverToggle);

    const popover = within(document.querySelector(".mt-floating-ui__content") as HTMLElement);
    expect(popover.getByText("Popover example")).toBeInTheDocument();

    const columnsItem = popover.getByText("Columns");

    await userEvent.click(columnsItem);
  },
};

export const VisualTestRenderWithoutFloat: MtPopoverStory = {
  name: "Should render the popover with disabled float and without trigger",
  args: {
    disableFloat: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitUntil(() => document.body.textContent?.includes("Popover example"));

    expect(canvas.getByText("Popover example")).toBeInTheDocument();
  },
};
