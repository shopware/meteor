import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { waitUntilRendered } from "@/_internal/test-helper";

import meta, { type SwIconStory, type SwIconMeta } from "./sw-icon.stories";

export default {
  ...meta,
  title: "Interaction Tests/Icons & Media/sw-icon",
} as SwIconMeta;

export const VisualTestRenderIcon: SwIconStory = {
  name: "Render icon",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until tab bar is loaded and context button gets rendered
    await waitUntilRendered(() => document.getElementById("meteor-icon-kit__regular-products"));

    expect(canvas.findByTestId("sw-icon__regular-products")).toBeDefined();
  },
};

export const VisualTestRenderCalendarIcon: SwIconStory = {
  name: "Render calendar icon",
  args: {
    name: "regular-calendar",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until tab bar is loaded and context button gets rendered
    await waitUntilRendered(() => document.getElementById("meteor-icon-kit__regular-calendar"));

    expect(canvas.findByTestId("sw-icon__regular-calendar")).toBeDefined();
  },
};

export const VisualTestRenderIconInYellow: SwIconStory = {
  name: "Render icon in yellow",
  args: {
    color: "yellow",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until tab bar is loaded and context button gets rendered
    await waitUntilRendered(() => document.getElementById("meteor-icon-kit__regular-products"));

    expect(canvas.findByTestId("sw-icon__regular-products")).toBeDefined();
    expect((await canvas.findByTestId("sw-icon__regular-products")).style.color).toBe("yellow");
  },
};

export const VisualTestRenderIconInHidden: SwIconStory = {
  name: "Render icon in hidden",
  args: {
    decorative: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until tab bar is loaded and context button gets rendered
    await waitUntilRendered(() => document.getElementById("meteor-icon-kit__regular-products"));

    expect(canvas.findByTestId("sw-icon__regular-products")).toBeDefined();
    expect((await canvas.findByTestId("sw-icon__regular-products")).ariaHidden).toBe("true");
  },
};
