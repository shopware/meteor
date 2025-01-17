import { expect, userEvent, within } from "@storybook/test";

import meta, { type MtLinkMeta, type MtLinkStory } from "./mt-link.stories";

export default {
  ...meta,
  title: "Interaction Tests/Navigation/mt-link",
} as MtLinkMeta;

export const VisualTestRenderLink: MtLinkStory = {
  name: "Render link",
  args: {
    to: "/",
  },
};

export const VisualTestRenderLinkCritical: MtLinkStory = {
  name: "Link critical",
  args: {
    variant: "critical",
  },
};

export const VisualTestRenderExternalLinkDisabled: MtLinkStory = {
  name: "Render disabled link",
  args: {
    disabled: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("link"));

    expect(args.click).not.toHaveBeenCalled();
  },
};

export const VisualTestRenderExternalLink: MtLinkStory = {
  name: "Render external link",
  args: {
    type: "external",
  },
};

export const VisualTestRenderInternalLink: MtLinkStory = {
  name: "Render internal link",
  args: {
    type: "internal",
  },
};
