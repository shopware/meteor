import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import MtBanner from "./mt-banner.vue";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";
import MtText from "@/components/content/mt-text/mt-text.vue";

export type MtBannerMeta = SlottedMeta<typeof MtBanner, "default" | "close">;

const meta: MtBannerMeta = {
  title: "Components/Feedback Indicator/mt-banner",
  component: MtBanner,
  args: {
    title: "This is a banner",
    default: "I am in the default slot of the banner",
    variant: "neutral",
    close: fn(action("close")),
  },
  render: (args) => ({
    components: { MtBanner, MtText },
    setup() {
      return {
        args,
      };
    },
    template: `
      <mt-banner
        v-bind="args"
        @close="args.close"
      >
        <mt-text size="xs" v-html="args.default"></mt-text>
      </mt-banner>`,
  }),
};

export default meta;
export type MtBannerStory = StoryObj<MtBannerMeta>;

export const DefaultStory: MtBannerStory = {
  name: "mt-banner",
};
