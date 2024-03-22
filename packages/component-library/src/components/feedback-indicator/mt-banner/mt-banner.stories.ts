import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import MtBanner from "./mt-banner.vue";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

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
    components: { MtBanner },
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
        <div v-html="args.default"></div>
      </mt-banner>`,
  }),
};

export default meta;
export type MtBannerStory = StoryObj<MtBannerMeta>;

export const DefaultStory: MtBannerStory = {
  name: "mt-banner",
};
