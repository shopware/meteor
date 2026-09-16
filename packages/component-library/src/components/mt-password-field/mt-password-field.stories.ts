import MtPasswordField from "./mt-password-field.vue";
import { hintArgTypes } from "../_internal/mt-base-field/arg-types";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtPasswordFieldMeta = SlottedMeta<
  typeof MtPasswordField,
  "default" | "hint" | "hintSlot"
>;

export default {
  title: "Components/Password Field",
  component: MtPasswordField,
  render: (args) => ({
    components: { MtPasswordField },
    setup: () => ({ args }),
    template: `
<mt-password-field v-bind="args">
  <template v-if="args.hintSlot" #hint>{{ args.hintSlot }}</template>
</mt-password-field>`,
  }),
  argTypes: {
    ...hintArgTypes,
  },
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
