import MtRadioField from "./mt-radio-field.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtRadioFieldMeta = SlottedMeta<
  typeof MtRadioField,
  "default" | "change" | "updateModelValue"
>;

export default {
  title: "Components/Form/mt-radio-field",
  component: MtRadioField,
  args: {
    label: "Radio field",
    options: [
        { label: "Standard shipping", value: "standard" },
        { label: "Express shipping", value: "express" },
    ],
    change: fn(),
    updateModelValue: fn(),
  },
  render: (args) => ({
    components: { MtRadioField },
    template: `<mt-radio-field
      v-bind="args"
      :modelValue="currentValue"
      @update:modelValue="onUpdateModelValue"
      @change="args.change"
    />`,
    setup() {
      return { args };
    },
    data() {
      return {
        currentValue: args.modelValue ?? args.options?.[0]?.value ?? null,
      };
    },
    watch: {
      "args.modelValue"(next) {
        if (next === this.currentValue) {
          return;
        }

        this.currentValue = next;
      },
    },
    methods: {
      onUpdateModelValue(value: string | number | boolean | null) {
        this.currentValue = value;
        args.updateModelValue(value);
      },
    },
  }),
} as MtRadioFieldMeta;

export type MtRadioFieldStory = StoryObj<MtRadioFieldMeta>;

export const DefaultStory: MtRadioFieldStory = {
  name: "mt-radio-field",
};
