import { action } from "@storybook/addon-actions";
import MtDatepicker from "./mt-datepicker.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtDatepickerMeta = SlottedMeta<
  typeof MtDatepicker,
  "default" | "updateModelValue" | "modelValue"
>;

export default {
  title: "Components/Form/mt-datepicker",
  component: MtDatepicker,
  render: (args) => ({
    template: `
      <mt-datepicker
        v-bind="args"
        v-model="currentValue"
        @update:modelValue="args.updateModelValue"
      ></mt-datepicker>`,
    components: { MtDatepicker },
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
} as MtDatepickerMeta;

export type MtDatepickerStory = StoryObj<MtDatepickerMeta>;

export const DefaultStory: MtDatepickerStory = {
  name: "mt-datepicker",
};
