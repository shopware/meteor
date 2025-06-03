import { userEvent, within } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, {
  type MtSegmentedControlMeta,
  type MtSegmentedControlStory,
} from "./mt-segmented-control.stories";

export default {
  ...meta,
  title: "Interaction Tests/Navigation/mt-segmented-control",
} as MtSegmentedControlMeta;

export const VisualTestRenderSegmentedControl: MtSegmentedControlStory = {
  name: "Render segmented controls",
};

export const VisualTestRenderSegmentedControlWithContext: MtSegmentedControlStory = {
  name: "Render segmented controls with context",
  args: {
    disableContext: false,
  },
};

export const VisualTestRenderSegmentedControlWithPopoverBase: MtSegmentedControlStory = {
  name: "Render segmented controls with popover base",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.getByText("Label F");

    await userEvent.click(button);

    const popoverContent = document.getElementsByClassName("mt-popover__content")[0];
    if (!popoverContent) {
      throw new Error("Popover content not found");
    }

    // Look inside the popover
    const popover = within(popoverContent as HTMLElement);

    const firstLevel = await popover.getByText("First level");
    await expect(firstLevel).toBeInTheDocument();
  },
};

export const VisualTestRenderSegmentedControlWithPopoverSecondLevel: MtSegmentedControlStory = {
  name: "Render segmented controls with popover second level",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.getByText("Label F");

    await userEvent.click(button);

    const popoverContent = document.getElementsByClassName("mt-popover__content")[0];
    if (!popoverContent) {
      throw new Error("Popover content not found");
    }

    // Look inside the popover
    const popover = within(popoverContent as HTMLElement);

    const goToSecondLevel = await popover.getByText("Go to second level");
    await userEvent.click(goToSecondLevel);

    const secondLevel = await popover.findByText("Second level");
    await expect(secondLevel).toBeInTheDocument();

    const goToThirdLevel = await popover.getByText("Go to third level");
    await expect(goToThirdLevel).toBeInTheDocument();
  },
};
