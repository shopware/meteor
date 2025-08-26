import MtPasswordField from "./mt-password-field.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";

export type MtPasswordFieldMeta = Meta<typeof MtPasswordField>;

export default {
  title: "Components/Form/mt-password-field",
  component: MtPasswordField,
  args: {
    label: "Passwordfield",
    onChange: fn(),
    "onUpdate:modelValue": fn(),
  },
} as MtPasswordFieldMeta;

export type MtPasswordFieldStory = StoryObj<MtPasswordFieldMeta>;

export const DefaultStory: MtPasswordFieldStory = {
  name: "mt-password-field",
};
