import MtProgressBar from "./mt-progress-bar.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtProgressBarMeta = SlottedMeta<typeof MtProgressBar, "error">;

export default {
  title: "Components/mt-progress-bar",
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
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-progress-bar
  v-model="value"
  :max-value="100"
  label="Upload progress"
/>`,
      },
    },
  },
};

export const Extended: MtProgressBarStory = {
  name: "Custom units and error",
  args: {
    modelValue: 277,
    error: {
      code: 500,
      detail: "Error while loading",
    },
    progressLabelType: "kb",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-progress-bar
  v-model="uploadedSize"
  :max-value="356"
  label="Upload progress"
  progress-label-type="kb"
  :error="{ code: 500, detail: 'Error while loading' }"
/>`,
      },
    },
  },
};
