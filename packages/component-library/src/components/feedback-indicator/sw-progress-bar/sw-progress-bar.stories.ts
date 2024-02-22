import SwProgressBar from "./sw-progress-bar.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type SwProgressBarMeta = SlottedMeta<typeof SwProgressBar, "error">;

export default {
  title: "Components/Feedback Indicator/sw-progress-bar",
  component: SwProgressBar,
  render: (args) => ({
    setup() {
      return {
        args,
      };
    },
    components: { SwProgressBar },
    template: '<sw-progress-bar v-bind="args"></sw-progress-bar>',
  }),
  args: {
    modelValue: 121,
    maxValue: 356,
    label: "Example progress bar",
    error: undefined,
    progressLabelType: "",
  },
} as SwProgressBarMeta;

export type SwProgressBarStory = StoryObj<SwProgressBarMeta>;

export const Default: SwProgressBarStory = {
  name: "Minimal",
};

export const Extended: SwProgressBarStory = {
  args: {
    modelValue: 277,
    error: {
      code: 500,
      detail: "Error while loading",
    },
    progressLabelType: "kb",
  },
};
