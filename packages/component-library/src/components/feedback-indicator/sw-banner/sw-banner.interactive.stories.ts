import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

import meta, { type SwBannerMeta, type SwBannerStory } from "./sw-banner.stories";

export default {
  ...meta,
  title: "Interaction Tests/Feedback Indicator/sw-banner",
} as SwBannerMeta;

export const VisualTestBannerNeutral: SwBannerStory = {
  name: "Banner neutral",
};

export const VisualTestBannerInfo: SwBannerStory = {
  name: "Banner info",
  args: {
    variant: "info",
  },
};

export const VisualTestBannerAttention: SwBannerStory = {
  name: "Banner attention",
  args: {
    variant: "attention",
  },
};

export const VisualTestBannerCritical: SwBannerStory = {
  name: "Banner critical",
  args: {
    variant: "critical",
  },
};

export const VisualTestBannerPositive: SwBannerStory = {
  name: "Banner positive",
  args: {
    variant: "positive",
  },
};

export const VisualTestBannerInherited: SwBannerStory = {
  name: "Banner inherited",
  args: {
    variant: "inherited",
  },
};

export const VisualTestRenderWithoutIcon: SwBannerStory = {
  name: "Render banner without icon",
  args: {
    hideIcon: true,
  },
};

export const VisualTestCloseBannerBox: SwBannerStory = {
  name: "Close the banner",
  args: {
    closable: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(args.close).not.toHaveBeenCalled();

    await userEvent.click(canvas.getByRole("button"));

    expect(args.close).toHaveBeenCalledWith(null);
  },
};
