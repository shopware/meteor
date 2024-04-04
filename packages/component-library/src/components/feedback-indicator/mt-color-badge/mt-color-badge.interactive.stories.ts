import meta, { type MtColorBadgeMeta, type MtColorBadgeStory } from "./mt-color-badge.stories";

export default {
  ...meta,
  title: "Interaction Tests/Feedback Indicator/mt-color-badge",
} as MtColorBadgeMeta;

export const VisualTestColorBadgeNeutral: MtColorBadgeStory = {
  name: "Color badge neutral",
};

export const VisualTestColorBadgeInfo: MtColorBadgeStory = {
  name: "Color badge info",
  args: {
    variant: "info",
  },
};

export const VisualTestColorBadgePositive: MtColorBadgeStory = {
  name: "Color badge positive",
  args: {
    variant: "positive",
  },
};

export const VisualTestColorBadgeCritical: MtColorBadgeStory = {
  name: "Color badge critical",
  args: {
    variant: "critical",
  },
};

export const VisualTestColorBadgeWarning: MtColorBadgeStory = {
  name: "Color badge warning",
  args: {
    variant: "warning",
  },
};

export const VisualTestColorBadgeRound: MtColorBadgeStory = {
  name: "Color badge with round shape",
  args: {
    rounded: true,
  },
};

export const VisualTestRenderWithoutIcon: MtColorBadgeStory = {
  name: "Render color badge with text",
  args: {
    hasText: true,
    default: "100%",
  },
};
