import { within } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtBadgeMeta, type MtBadgeStory } from "./mt-badge.stories";

export default {
  ...meta,
  title: "Interaction Tests/Feedback Indicator/mt-badge",
} as MtBadgeMeta;

export const VisualTestNeutralVariant: MtBadgeStory = {
  name: "Render neutral variant",
  args: {
    default: "Neutral",
    variant: "neutral",
  },
};

export const VisualTestInfoVariant: MtBadgeStory = {
  name: "Render info variant",
  args: {
    default: "Info",
    variant: "info",
  },
};

export const VisualTestAttentionVariant: MtBadgeStory = {
  name: "Render attention variant",
  args: {
    default: "Attention",
    variant: "attention",
  },
};

export const VisualTestCriticalVariant: MtBadgeStory = {
  name: "Render critical variant",
  args: {
    default: "Critical",
    variant: "critical",
  },
};

export const VisualTestPositiveVariant: MtBadgeStory = {
  name: "Render positive variant",
  args: {
    default: "Positive",
    variant: "positive",
  },
};

export const VisualTestSmallSize: MtBadgeStory = {
  name: "Render small size",
  args: {
    default: "Small",
    size: "s",
  },
};

export const VisualTestMediumSize: MtBadgeStory = {
  name: "Render medium size",
  args: {
    default: "Medium",
    size: "m",
  },
};

export const VisualTestLargeSize: MtBadgeStory = {
  name: "Render large size",
  args: {
    default: "Large",
    size: "l",
  },
};

export const TestStatusIndicatorVisibility: MtBadgeStory = {
  name: "Status indicator is visible when enabled",
  args: {
    default: "Test Status",
    statusIndicator: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByTestId("mt-badge__indicator")).toBeVisible();
  },
};

export const TestIconVisibility: MtBadgeStory = {
  name: "Icon is visible when provided",
  args: {
    default: "Test Icon",
    icon: "regular-party-horn",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByTestId("mt-icon__regular-party-horn")).toBeVisible();
  },
};
