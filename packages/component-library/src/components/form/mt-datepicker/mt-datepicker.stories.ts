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
  title: "Components/mt-datepicker",
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

export const Default: MtDatepickerStory = {
  parameters: {
    docs: {
      source: {
        code: `<mt-datepicker label="Datepicker" />`,
      },
    },
  },
};

export const DateOnly: MtDatepickerStory = {
  name: "Date only",
  args: {
    label: "Publish date",
    dateType: "date",
    modelValue: "2024-11-13T00:00:00.000Z",
  },
  parameters: {
    docs: {
      source: {
        code: `<mt-datepicker
  label="Publish date"
  date-type="date"
  model-value="2024-11-13T00:00:00.000Z"
/>`,
      },
    },
  },
};

export const TimeOnly: MtDatepickerStory = {
  name: "Time only",
  args: {
    label: "Reminder time",
    dateType: "time",
    modelValue: "12:40",
  },
  parameters: {
    docs: {
      source: {
        code: `<mt-datepicker
  label="Reminder time"
  date-type="time"
  model-value="12:40"
/>`,
      },
    },
  },
};

export const Range: MtDatepickerStory = {
  args: {
    label: "Campaign period",
    dateType: "date",
    range: true,
    modelValue: ["2024-11-13T00:00:00.000Z", "2024-11-16T00:00:00.000Z"],
  },
  parameters: {
    docs: {
      source: {
        code: `<mt-datepicker
  label="Campaign period"
  date-type="date"
  :range="true"
  :model-value="['2024-11-13T00:00:00.000Z', '2024-11-16T00:00:00.000Z']"
/>`,
      },
    },
  },
};
