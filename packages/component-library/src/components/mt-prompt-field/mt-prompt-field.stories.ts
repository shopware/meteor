import type { Meta, StoryObj } from "@storybook/vue3";
import { fn } from "@storybook/test";
import MtPromptField from "./mt-prompt-field.vue";

export type MtPromptFieldMeta = Meta<typeof MtPromptField>;

const meta: MtPromptFieldMeta = {
  title: "Components/Prompt Field",
  component: MtPromptField,
  args: {
    placeholder: "Ask anything...",
    "onUpdate:modelValue": fn(),
    onSubmit: fn(),
    onStop: fn(),
    onError: fn(),
  },
  render: (args) => ({
    components: { MtPromptField },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 640px">
        <mt-prompt-field v-bind="args" v-model="args.modelValue" />
      </div>
    `,
  }),
};

export default meta;
export type MtPromptFieldStory = StoryObj<MtPromptFieldMeta>;

export const Default: MtPromptFieldStory = {};

export const Streaming: MtPromptFieldStory = {
  args: {
    status: "streaming",
  },
};
