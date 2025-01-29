import MtNumberField from "./mt-number-field.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

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
  },
} as MtNumberFieldMeta;

export type MtNumberFieldStory = StoryObj<MtNumberFieldMeta>;

export const DefaultStory: MtNumberFieldStory = {
  name: "mt-number-field",
};
