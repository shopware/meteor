import { within } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtLinkMeta, type MtLinkStory } from "./mt-link.stories";

export default {
  ...meta,
  title: "Interaction Tests/Form/mt-link",
} as MtLinkMeta;

export const VisualTestRenderLink: MtLinkStory = {
  name: "Render link",
  args: {
    to: "/",
  },
};

export const VisualTestRenderLinkPrimary: MtLinkStory = {
  name: "Link primary",
  args: {
    variant: "primary",
  },
};

export const VisualTestRenderLinkSecondary: MtLinkStory = {
  name: "Link secondary",
  args: {
    variant: "secondary",
  },
};

export const VisualTestRenderLinkCritical: MtLinkStory = {
  name: "Link critical",
  args: {
    variant: "critical",
  },
};

export const VisualTestRenderLinkSmall: MtLinkStory = {
  name: "Link positive",
  args: {
    size: "small",
  },
};

export const VisualTestRenderLinkLarge: MtLinkStory = {
  name: "Link large",
  args: {
    size: "large",
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