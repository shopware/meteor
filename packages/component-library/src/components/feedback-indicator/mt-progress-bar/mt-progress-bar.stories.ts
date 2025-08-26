import MtProgressBar from "./mt-progress-bar.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtProgressBarMeta = SlottedMeta<typeof MtProgressBar, "error">;

export default {
  title: "Components/Feedback Indicator/mt-progress-bar",
  component: MtProgressBar,
  render: (args) => ({
    setup() {
      return {
        args,
      };
    },
    components: { MtProgressBar },
    template: '<mt-progress-bar v-bind="args"></mt-progress-bar>',
  }),
  args: {
    modelValue: 121,
    maxValue: 356,
    label: "Example progress bar",
    error: undefined,
    progressLabelType: undefined,
  },
} as MtProgressBarMeta;

export type MtProgressBarStory = StoryObj<MtProgressBarMeta>;

export const Default: MtProgressBarStory = {
  name: "Minimal",
};

export const Extended: MtProgressBarStory = {
  args: {
    modelValue: 277,
    error: {
      code: 500,
      detail: "Error while loading",
    },
    progressLabelType: "kb",
  },
};
