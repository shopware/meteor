import { within } from "@storybook/test";
import { expect } from "@storybook/test";

import MtStatusDot from "./mt-status-dot.vue";
import meta, { type MtStatusDotMeta, type MtStatusDotStory } from "./mt-status-dot.stories";

export default {
  ...meta,
  title: "Components/Status Dot/Interaction tests",
  tags: ["!autodocs"],
} as MtStatusDotMeta;

export const VisualTestNeutralVariant: MtStatusDotStory = {
  name: "Render neutral variant",
  args: {
    variant: "neutral",
  },
};

export const VisualTestInfoVariant: MtStatusDotStory = {
  name: "Render info variant",
  args: {
    variant: "info",
  },
};

export const VisualTestAttentionVariant: MtStatusDotStory = {
  name: "Render attention variant",
  args: {
    variant: "attention",
  },
};

export const VisualTestCriticalVariant: MtStatusDotStory = {
  name: "Render critical variant",
  args: {
    variant: "critical",
  },
};

export const VisualTestPositiveVariant: MtStatusDotStory = {
  name: "Render positive variant",
  args: {
    variant: "positive",
  },
};

export const VisualTestSmallSize: MtStatusDotStory = {
  name: "Render small size",
  args: {
    variant: "positive",
    size: "s",
  },
};

export const VisualTestMediumSize: MtStatusDotStory = {
  name: "Render medium size",
  args: {
    variant: "positive",
    size: "m",
  },
};

export const VisualTestLargeSize: MtStatusDotStory = {
  name: "Render large size",
  args: {
    variant: "positive",
    size: "l",
  },
};

export const VisualTestPulse: MtStatusDotStory = {
  name: "Render pulsating dot",
  args: {
    variant: "positive",
    pulse: true,
  },
};

export const VisualTestDisabledVariants: MtStatusDotStory = {
  name: "Render disabled variants",
  render: () => ({
    components: { MtStatusDot },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <mt-status-dot variant="neutral" disabled />
        <mt-status-dot variant="info" disabled />
        <mt-status-dot variant="attention" disabled />
        <mt-status-dot variant="critical" disabled />
        <mt-status-dot variant="positive" disabled />
      </div>`,
  }),
};

export const TestExposesLabelToAssistiveTech: MtStatusDotStory = {
  name: "Exposes its label to assistive technology",
  args: {
    variant: "positive",
    label: "Online",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("img", { name: "Online" })).toBeVisible();
  },
};

export const TestIsDecorativeWithoutLabel: MtStatusDotStory = {
  name: "Is hidden from assistive technology without a label",
  args: {
    variant: "positive",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("img")).toBeNull();
  },
};
