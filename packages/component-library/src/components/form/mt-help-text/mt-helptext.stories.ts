import { defineStory } from "@/_internal/story-helper";
import MtHelpText from "./mt-help-text.vue";
import type { Meta } from "@storybook/vue3";

type MtHelpTextMeta = Meta<typeof MtHelpText>;

const meta = {
  title: "Components/mt-help-text",
  component: MtHelpText,
  args: {
    text: "Help text",
  },
} as MtHelpTextMeta;

export default meta;

export const Default = defineStory({
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-help-text text="This field is required for checkout" />`,
      },
    },
  },
});
