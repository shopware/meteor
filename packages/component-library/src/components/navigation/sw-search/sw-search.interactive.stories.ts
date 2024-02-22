import { within, userEvent } from "@storybook/testing-library";
import { expect, jest } from "@storybook/jest";

import meta, { type SwSearchMeta, type SwSearchStory } from "./sw-search.stories";

export default {
  ...meta,
  title: "Interaction Tests/Navigation/sw-search",
} as SwSearchMeta;

export const TestInputValue: SwSearchStory = {
  name: "Should keep input value",
  args: {
    change: jest.fn(),
  },
  play: async ({ args, canvasElement }) => {
    // we can't use canvasElement because it is not available anymore
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole("textbox"), "Shopware");
    await userEvent.click(canvas.getByText("hidden"));

    await expect((canvas.getByRole("textbox") as HTMLInputElement).value).toBe("Shopware");
    await expect(args.change).toHaveBeenCalledWith("Shopware");
  },
};

export const VisualTestDefaultSize: SwSearchStory = {
  name: "Render the default sized search",
  args: {
    size: "default",
  },
};

export const VisualTestSmallSize: SwSearchStory = {
  name: "Render the small sized search",
  args: {
    size: "small",
  },
};

export const VisualTestDefaultSizeDisabled: SwSearchStory = {
  name: "Render the default sized search disabled",
  args: {
    size: "default",
    disabled: true,
  },
};

export const VisualTestSmallSizeDisabled: SwSearchStory = {
  name: "Render the small sized search disabled",
  args: {
    size: "small",
    disabled: true,
  },
};
