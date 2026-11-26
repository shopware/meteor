import MtTextarea from "./mt-textarea.vue";
import { hintArgTypes } from "../_internal/form-field/arg-types";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtTextareaMeta = SlottedMeta<
  typeof MtTextarea,
  | "default"
  | "change"
  | "updateModelValue"
  | "hint"
  | "hintSlot"
  | "label"
  | "placeholder"
  | "error"
  | "inheritanceRestore"
  | "inheritanceRemove"
  | "isInherited"
>;

export default {
  title: "Components/Textarea",
  component: MtTextarea,
  render: (args) => ({
    template: `
<mt-textarea
  v-bind="args"
  v-model="args.modelValue"
  @change="args.change"
  @blur="args.blur"
  @focus="args.focus"
>
  <template v-if="args.hintSlot" #hint>{{ args.hintSlot }}</template>
</mt-textarea>`,
    components: { MtTextarea },
    setup: () => ({ args }),
  }),
  argTypes: {
    ...hintArgTypes,
  },
  args: {
    label: "Textareafield",
    "onUpdate:modelValue": fn(),
    change: fn(),
    blur: fn(),
    focus: fn(),
  },
} as MtTextareaMeta;

export type MtTextareaStory = StoryObj<MtTextareaMeta>;

export const Default: MtTextareaStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-textarea
  v-model="value"
  label="Description"
/>`,
      },
    },
  },
};
