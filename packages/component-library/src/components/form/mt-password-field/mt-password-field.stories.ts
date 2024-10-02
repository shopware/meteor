import MtPasswordField from "./mt-password-field.vue";
import baseFieldArgTypes from "../_internal/mt-base-field/arg-types";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtPasswordFieldMeta = SlottedMeta<
  typeof MtPasswordField,
  "default" | "hint" | "suffix" | "prefix"
>;

export default {
  title: "Components/Form/mt-password-field",
  component: MtPasswordField,
  args: {
    label: "Passwordfield",
    onChange: fn(),
    "onUpdate:modelValue": fn(),
  },
  argTypes: {
    ...baseFieldArgTypes,
  },
} as MtPasswordFieldMeta;

export type MtPasswordFieldStory = StoryObj<MtPasswordFieldMeta>;

export const DefaultStory: MtPasswordFieldStory = {
  name: "mt-password-field",
};
