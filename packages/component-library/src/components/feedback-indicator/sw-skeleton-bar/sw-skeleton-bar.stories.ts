import SwSkeletonBar from "./sw-skeleton-bar.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type SwSkeletonBarMeta = SlottedMeta<typeof SwSkeletonBar, "default">;

export default {
  title: "Components/Feedback Indicator/sw-skeleton-bar",
  component: SwSkeletonBar,
  render: (args) => ({
    components: { SwSkeletonBar },
    template: `
          <div style="width: 500px; margin-top: 50px; margin-left: 50px;">
            <sw-skeleton-bar v-bind="args"></sw-skeleton-bar>
          </div>
        `,
    setup: () => {
      return {
        args,
      };
    },
  }),
} as SwSkeletonBarMeta;

export type SwSkeletonBarStory = StoryObj<SwSkeletonBarMeta>;

export const Default: SwSkeletonBarStory = {
  name: "sw-skeleton-bar",
};
