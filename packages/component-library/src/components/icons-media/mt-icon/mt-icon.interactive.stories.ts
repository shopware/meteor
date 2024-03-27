import { within } from "@storybook/test";
import { expect } from "@storybook/test";
import { waitUntilRendered } from "@/_internal/test-helper";

import meta, { type MtIconStory, type MtIconMeta } from "./mt-icon.stories";

export default {
  ...meta,
  title: "Interaction Tests/Icons & Media/mt-icon",
} as MtIconMeta;

export const VisualTestRenderIcon: MtIconStory = {
  name: "Render icon",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until icon is loaded and rendered
    await waitUntilRendered(() => document.getElementById("meteor-icon-kit__regular-products"));

    expect(canvas.findByTestId("mt-icon__regular-products")).toBeDefined();
  },
};

export const VisualTestRenderCalendarIcon: MtIconStory = {
  name: "Render calendar icon",
  args: {
    name: "regular-calendar",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until icon is loaded and rendered
    await waitUntilRendered(() => document.getElementById("meteor-icon-kit__regular-calendar"));

    expect(canvas.findByTestId("mt-icon__regular-calendar")).toBeDefined();
  },
};

export const VisualTestRenderIconInYellow: MtIconStory = {
  name: "Render icon in yellow",
  args: {
    color: "yellow",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until icon is loaded and rendered
    await waitUntilRendered(() => document.getElementById("meteor-icon-kit__regular-products"));

    expect(canvas.findByTestId("mt-icon__regular-products")).toBeDefined();
    expect((await canvas.findByTestId("mt-icon__regular-products")).style.color).toBe("yellow");
  },
};

export const VisualTestRenderIconInHidden: MtIconStory = {
  name: "Render icon in hidden",
  args: {
    decorative: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until icon is loaded and rendered
    await waitUntilRendered(() => document.getElementById("meteor-icon-kit__regular-products"));

    expect(canvas.findByTestId("mt-icon__regular-products")).toBeDefined();
    expect((await canvas.findByTestId("mt-icon__regular-products")).ariaHidden).toBe("true");
  },
};

export const VisualTestRenderIconInCustomSizeLarge: MtIconStory = {
  name: "Render icon in custom size large",
  args: {
    size: "120px",
    name: "regular-fingerprint",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until icon is loaded and rendered
    await waitUntilRendered(() => document.getElementById("meteor-icon-kit__regular-fingerprint"));

    expect(canvas.findByTestId("mt-icon__regular-fingerprint")).toBeDefined();
  },
};

export const VisualTestRenderIconInCustomSizeSmall: MtIconStory = {
  name: "Render icon in custom size small",
  args: {
    size: "10px",
    name: "regular-fingerprint",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // wait until icon is loaded and rendered
    await waitUntilRendered(() => document.getElementById("meteor-icon-kit__regular-fingerprint"));

    expect(canvas.findByTestId("mt-icon__regular-fingerprint")).toBeDefined();
  },
};
