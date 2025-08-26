import MtSkeletonBar from "./mt-skeleton-bar.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtSkeletonBarMeta = SlottedMeta<typeof MtSkeletonBar, "default">;

export default {
  title: "Components/Feedback Indicator/mt-skeleton-bar",
  component: MtSkeletonBar,
  render: (args) => ({
    components: { MtSkeletonBar },
    template: `
          <div style="width: 500px; margin-top: 50px; margin-left: 50px;">
            <mt-skeleton-bar v-bind="args"></mt-skeleton-bar>
          </div>
        `,
    setup: () => {
      return {
        args,
      };
    },
  }),
} as MtSkeletonBarMeta;

export type MtSkeletonBarStory = StoryObj<MtSkeletonBarMeta>;

export const Default: MtSkeletonBarStory = {
  name: "mt-skeleton-bar",
};
