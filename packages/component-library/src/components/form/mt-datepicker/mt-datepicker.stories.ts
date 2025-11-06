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
  argTypes: {
    dateType: {
      control: { type: "select" },
      options: ["datetime", "date", "time"],
    },
    timeZone: {
      control: { type: "select" },
      options: [
        "UTC",
        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "Europe/London",
        "Europe/Paris",
        "Europe/Berlin",
        "Europe/Rome",
        "Europe/Madrid",
        "Asia/Tokyo",
        "Asia/Shanghai",
        "Asia/Kolkata",
        "Australia/Sydney",
        "Australia/Melbourne",
        "Pacific/Auckland",
      ],
    },
  },
  args: {
    label: "Datepicker",
    updateModelValue: fn(action("update:modelValue")),
    modelValue: null,
    dateType: "datetime",
    timeZone: "UTC",
  },
} as MtDatepickerMeta;

export type MtDatepickerStory = StoryObj<MtDatepickerMeta>;

export const DefaultStory: MtDatepickerStory = {
  name: "mt-datepicker",
};
