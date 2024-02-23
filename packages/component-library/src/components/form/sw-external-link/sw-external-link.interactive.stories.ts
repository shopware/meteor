import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import meta, {
  type SwExternalLinkMeta,
  type SwExternalLinkStory,
} from "./sw-external-link.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/sw-external-link",
} as SwExternalLinkMeta;

export const VisualTestRenderExternalLink: SwExternalLinkStory = {
  name: "Render external link",
  args: {
    href: "https://developers.shopware.com/",
  },
};

export const VisualTestRenderExternalLinkSmall: SwExternalLinkStory = {
  name: "Render external link in small",
  args: {
    small: true,
    href: "https://developers.shopware.com/",
  },
};

export const VisualTestRenderExternalLinkDisabled: SwExternalLinkStory = {
  name: "Render disabled external link",
  args: {
    disabled: true,
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = canvas.getByRole("link");

    expect(getComputedStyle(link).pointerEvents).toEqual("none");
  },
};

export const TestExternalLinkWithoutHref: SwExternalLinkStory = {
  name: "Render external link without href attribute",
  args: {
    href: undefined,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("link"));

    expect(args.click).toHaveBeenCalled();
  },
};
