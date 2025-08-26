import { within, userEvent } from "@storybook/test";
import { expect } from "@storybook/test";

import meta, { type MtBannerMeta, type MtBannerStory } from "./mt-banner.stories";

export default {
  ...meta,
  title: "Interaction Tests/Feedback Indicator/mt-banner",
} as MtBannerMeta;

export const VisualTestBannerNeutral: MtBannerStory = {
  name: "Banner neutral",
};

export const VisualTestBannerInfo: MtBannerStory = {
  name: "Banner info",
  args: {
    variant: "info",
  },
};

export const VisualTestBannerAttention: MtBannerStory = {
  name: "Banner attention",
  args: {
    variant: "attention",
  },
};

export const VisualTestBannerCritical: MtBannerStory = {
  name: "Banner critical",
  args: {
    variant: "critical",
  },
};

export const VisualTestBannerPositive: MtBannerStory = {
  name: "Banner positive",
  args: {
    variant: "positive",
  },
};

export const VisualTestBannerInherited: MtBannerStory = {
  name: "Banner inherited",
  args: {
    variant: "inherited",
  },
};

export const VisualTestRenderWithoutIcon: MtBannerStory = {
  name: "Render banner without icon",
  args: {
    hideIcon: true,
  },
};

export const VisualTestCloseBannerBox: MtBannerStory = {
  name: "Close the banner",
  args: {
    closable: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(args.close).not.toHaveBeenCalled();

    await userEvent.click(canvas.getByRole("button"));

    expect(args.close).toHaveBeenCalledOnce();
  },
};
