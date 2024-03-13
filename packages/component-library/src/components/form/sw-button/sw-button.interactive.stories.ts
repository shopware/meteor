import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import meta from "./sw-button.stories";
import type { SwButtonMeta, SwButtonStory } from "./sw-button.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/sw-button",
} as SwButtonMeta;

export const TestDefaultSlot: SwButtonStory = {
  name: "Change the default slot",
  args: {
    default: "The new button text",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = canvas.getByRole("button");

    await expect(button).toHaveTextContent("The new button text");
  },
};

export const VisualTestPrimaryVariant: SwButtonStory = {
  name: "Render the primary variant",
  args: {
    default: "Primary button",
    variant: "primary",
  },
};

export const VisualTestGhostVariant: SwButtonStory = {
  name: "Render primary ghost variant",
  args: {
    default: "Primary ghost button",
    variant: "primary",
    ghost: true,
  },
};

export const VisualTestSecondaryVariant: SwButtonStory = {
  name: "Render secondary variant",
  args: {
    default: "Secondary button",
    variant: "secondary",
  },
};

export const VisualTestSecondaryGhostVariant: SwButtonStory = {
  name: "Render secondary ghost variant",
  args: {
    default: "Secondary ghost button",
    variant: "secondary",
    ghost: true,
  },
};

export const VisualTestCriticalVariant: SwButtonStory = {
  name: "Render the critical variant",
  args: {
    default: "Critical button",
    variant: "critical",
  },
};

export const VisualTestCriticalGhostVariant: SwButtonStory = {
  name: "Render the critical ghost variant",
  args: {
    default: "Critical ghost button",
    variant: "critical",
    ghost: true,
  },
};

export const VisualTestActionVariant: SwButtonStory = {
  name: "Render the action variant",
  args: {
    default: "Action button",
    variant: "action",
  },
};

export const VisualTestSmallSize: SwButtonStory = {
  name: "Render the small size",
  args: {
    default: "Small button",
    size: "small",
  },
};

export const VisualTestDefaultSize: SwButtonStory = {
  name: "Render the default size",
  args: {
    default: "Default button",
    size: "default",
  },
};

export const VisualTestLargeSize: SwButtonStory = {
  name: "Render the large size",
  args: {
    default: "Large button",
    size: "large",
  },
};

export const TestButtonClick: SwButtonStory = {
  name: "Click the button",
  args: {
    default: "Test button",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button"));

    expect(args.click).toHaveBeenCalled();
  },
};

export const TestDisabledButtonClick: SwButtonStory = {
  name: "Unable to click on disabled button",
  args: {
    default: "Disabled test button",
    disabled: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button"));

    expect(args.click).not.toHaveBeenCalled();
  },
};

export const VisualTestDisabledButton: SwButtonStory = {
  name: "Render the disabled button",
  args: {
    default: "Disabled button",
    disabled: true,
  },
};

export const VisualTestSquareButton: SwButtonStory = {
  name: "Render the square button",
  args: {
    default: "X",
    square: true,
  },
};

export const VisualTestBlockButton: SwButtonStory = {
  name: "Render the block button",
  args: {
    default: "This should go to full width",
    block: true,
  },
};

export const VisualTestIsLoading: SwButtonStory = {
  name: "Render the isLoading state",
  args: {
    default: "Is loading",
    isLoading: true,
  },
};

export const IsLoadingButton: SwButtonStory = {
  name: "Unable to click on isLoading button",
  args: {
    default: "Is loading",
    isLoading: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button"));

    expect(args.click).not.toHaveBeenCalled();
  },
};

export const LinkButton: SwButtonStory = {
  name: "Redirect to the link",
  args: {
    default: "Go to Shopware",
    link: "https://www.shopware.com",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("link"));

    // TODO: check redirects is currently not supported
  },
};
