import { within, userEvent, expect } from "@storybook/test";

import meta, {
  type MtShopwareSsoButtonMeta,
  type MtShopwareSsoButtonStory,
} from "./mt-shopware-sso-button.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-shopware-sso-button",
} as MtShopwareSsoButtonMeta;

export const VisualTestClicks: MtShopwareSsoButtonStory = {
  name: "Should emit click",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button"));

    expect(args.click).toHaveBeenCalled();
  },
};

export const VisualTestDisabled: MtShopwareSsoButtonStory = {
  name: "Should be disabled",
  args: {
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button")).toBeDisabled();
  },
};

export const VisualTestAsLink: MtShopwareSsoButtonStory = {
  name: "Should render as link",
  args: {
    is: "a",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link")).toBeVisible();
  },
};


