import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import meta from "./mt-button.stories";
import type { MtButtonMeta, MtButtonStory } from "./mt-button.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-button",
} as MtButtonMeta;

export const VisualTestPrimaryVariant: MtButtonStory = {
  name: "Render the primary variant",
  args: {
    default: "Primary button",
    variant: "primary",
  },
};

export const VisualTestGhostVariant: MtButtonStory = {
  name: "Render primary ghost variant",
  args: {
    default: "Primary ghost button",
    variant: "primary",
    ghost: true,
  },
};

export const VisualTestSecondaryVariant: MtButtonStory = {
  name: "Render secondary variant",
  args: {
    default: "Secondary button",
    variant: "secondary",
  },
};

export const VisualTestSecondaryGhostVariant: MtButtonStory = {
  name: "Render secondary ghost variant",
  args: {
    default: "Secondary ghost button",
    variant: "secondary",
    ghost: true,
  },
};

export const VisualTestCriticalVariant: MtButtonStory = {
  name: "Render the critical variant",
  args: {
    default: "Critical button",
    variant: "critical",
  },
};

export const VisualTestCriticalGhostVariant: MtButtonStory = {
  name: "Render the critical ghost variant",
  args: {
    default: "Critical ghost button",
    variant: "critical",
    ghost: true,
  },
};

export const VisualTestActionVariant: MtButtonStory = {
  name: "Render the action variant",
  args: {
    default: "Action button",
    variant: "action",
  },
};

export const VisualTestSmallSize: MtButtonStory = {
  name: "Render the small size",
  args: {
    default: "Small button",
    size: "small",
  },
};

export const VisualTestXSmallSize: MtButtonStory = {
  name: "Render the x-small size",
  args: {
    default: "X-Small button",
    size: "x-small",
  },
};

export const VisualTestDefaultSize: MtButtonStory = {
  name: "Render the default size",
  args: {
    default: "Default button",
    size: "default",
  },
};

export const VisualTestLargeSize: MtButtonStory = {
  name: "Render the large size",
  args: {
    default: "Large button",
    size: "large",
  },
};

export const TestDisabledButtonClick: MtButtonStory = {
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

export const VisualTestDisabledButton: MtButtonStory = {
  name: "Render the disabled button",
  args: {
    default: "Disabled button",
    disabled: true,
  },
};

export const VisualTestSquareButton: MtButtonStory = {
  name: "Render the square button",
  args: {
    default: "X",
    square: true,
  },
};

export const VisualTestBlockButton: MtButtonStory = {
  name: "Render the block button",
  args: {
    default: "This should go to full width",
    block: true,
  },
};

export const VisualTestIsLoading: MtButtonStory = {
  name: "Render the isLoading state",
  args: {
    default: "Is loading",
    isLoading: true,
  },
};

export const VisualTestLinkButton: MtButtonStory = {
  name: "Redirect to the link",
  args: {
    default: "Go to Shopware",
    link: "https://www.shopware.com",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("link")).toHaveAttribute("href", "https://www.shopware.com");
  },
};
