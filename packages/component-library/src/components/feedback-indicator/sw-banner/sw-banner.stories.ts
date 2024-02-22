import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import SwBanner from "./sw-banner.vue";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type SwBannerMeta = SlottedMeta<typeof SwBanner, "default" | "close">;

const meta: SwBannerMeta = {
  title: "Components/Feedback Indicator/sw-banner",
  component: SwBanner,
  args: {
    title: "This is a banner",
    default: "I am in the default slot of the banner",
    variant: "neutral",
    close: fn(action("close")),
  },
  render: (args) => ({
    components: { SwBanner },
    setup() {
      return {
        args,
      };
    },
    template: `
      <sw-banner
        v-bind="args"
        @close="args.close"
      >
        <div v-html="args.default"></div>
      </sw-banner>`,
  }),
};

export default meta;
export type SwBannerStory = StoryObj<SwBannerMeta>;

export const DefaultStory: SwBannerStory = {
  name: "sw-banner",
};
