import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import * as test from "@storybook/test";

import meta, { type MtSearchMeta, type MtSearchStory } from "./mt-search.stories";

export default {
  ...meta,
  title: "Interaction Tests/Navigation/mt-search",
} as MtSearchMeta;

export const TestInputValue: MtSearchStory = {
  name: "Should keep input value",
  args: {
    change: test.fn(),
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

export const VisualTestDefaultSize: MtSearchStory = {
  name: "Render the default sized search",
  args: {
    size: "default",
  },
};

export const VisualTestSmallSize: MtSearchStory = {
  name: "Render the small sized search",
  args: {
    size: "small",
  },
};

export const VisualTestDefaultSizeDisabled: MtSearchStory = {
  name: "Render the default sized search disabled",
  args: {
    size: "default",
    disabled: true,
  },
};

export const VisualTestSmallSizeDisabled: MtSearchStory = {
  name: "Render the small sized search disabled",
  args: {
    size: "small",
    disabled: true,
  },
};
