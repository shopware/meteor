import MtPasswordField from "./mt-password-field.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";

export type MtPasswordFieldMeta = Meta<typeof MtPasswordField>;

export default {
  title: "Components/mt-password-field",
  component: MtPasswordField,
  args: {
    label: "Passwordfield",
    onChange: fn(),
    "onUpdate:modelValue": fn(),
  },
} as MtPasswordFieldMeta;

export type MtPasswordFieldStory = StoryObj<MtPasswordFieldMeta>;

export const Default: MtPasswordFieldStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-password-field
  v-model="password"
  label="Password"
/>`,
      },
    },
  },
};
