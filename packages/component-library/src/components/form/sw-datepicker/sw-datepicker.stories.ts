import { action } from "@storybook/addon-actions";
import SwDatepicker from "./sw-datepicker.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type SwDatepickerMeta = SlottedMeta<
  typeof SwDatepicker,
  "default" | "updateModelValue" | "modelValue"
>;

export default {
  title: "Components/Form/sw-datepicker",
  component: SwDatepicker,
  render: (args) => ({
    template: `
      <sw-datepicker
        v-bind="args"
        v-model="currentValue"
        @update:modelValue="args.updateModelValue"
      ></sw-datepicker>`,
    components: { SwDatepicker },
    data() {
      return { currentValue: "" };
    },
    watch: {
      "args.modelValue"(v) {
        this.currentValue = v;
      },
    },
    created() {
      this.currentValue = args.modelValue;
    },
    setup: () => {
      return {
        args,
      };
    },
  }),
  args: {
    label: "Datepicker",
    updateModelValue: fn(action("update:modelValue")),
    modelValue: null,
  },
} as SwDatepickerMeta;

export type SwDatepickerStory = StoryObj<SwDatepickerMeta>;

export const DefaultStory: SwDatepickerStory = {
  name: "sw-datepicker",
};
