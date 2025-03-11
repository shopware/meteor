import MtNumberField from "./mt-number-field.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtNumberFieldMeta = SlottedMeta<
  typeof MtNumberField,
  "default" | "hint" | "suffix" | "prefix"
>;

export default {
  title: "Components/Form/mt-number-field",
  component: MtNumberField,
  args: {
    label: "Numberfield",
    numberType: "int",
    onChange: fn(),
    "onUpdate:modelValue": fn(),
  },
} as MtNumberFieldMeta;

export type MtNumberFieldStory = StoryObj<MtNumberFieldMeta>;

export const DefaultStory: MtNumberFieldStory = {
  name: "mt-number-field",
};
