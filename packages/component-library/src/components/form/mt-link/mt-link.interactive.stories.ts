import { within } from "@storybook/test";
import { expect } from "@storybook/test";

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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = canvas.getByText("Link");

    expect(getComputedStyle(link).pointerEvents).toEqual("none");
  },
};
