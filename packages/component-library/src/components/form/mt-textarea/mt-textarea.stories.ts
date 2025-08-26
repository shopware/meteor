import MtTextarea from "./mt-textarea.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtTextareaMeta = SlottedMeta<
  typeof MtTextarea,
  | "default"
  | "change"
  | "updateModelValue"
  | "hint"
  | "label"
  | "placeholder"
  | "error"
  | "inheritanceRestore"
  | "inheritanceRemove"
  | "isInherited"
>;

export default {
  title: "Components/Form/mt-textarea",
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
  <template #hint>{{ args.hint }}</template>
</mt-textarea>`,
    components: { MtTextarea },
    setup: () => ({ args }),
  }),
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
  name: "mt-textarea",
};
