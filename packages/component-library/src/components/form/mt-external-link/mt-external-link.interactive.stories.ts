import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import meta, {
  type MtExternalLinkMeta,
  type MtExternalLinkStory,
} from "./mt-external-link.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-external-link",
} as MtExternalLinkMeta;

export const VisualTestRenderExternalLink: MtExternalLinkStory = {
  name: "Render external link",
  args: {
    href: "https://developers.shopware.com/",
  },
};

export const VisualTestRenderExternalLinkSmall: MtExternalLinkStory = {
  name: "Render external link in small",
  args: {
    small: true,
    href: "https://developers.shopware.com/",
  },
};

export const VisualTestRenderExternalLinkDisabled: MtExternalLinkStory = {
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

export const TestExternalLinkWithoutHref: MtExternalLinkStory = {
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
