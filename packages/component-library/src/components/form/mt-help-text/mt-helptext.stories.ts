import { defineStory } from "@/_internal/story-helper";
import MtHelpText from "./mt-help-text.vue";
import type { Meta } from "@storybook/vue3";

type MtHelpTextMeta = Meta<typeof MtHelpText>;

export default {
  title: "Components/Form/mt-help-text",
  component: MtHelpText,
  args: {
    text: "Help text",
  },
} as MtHelpTextMeta;

export const Default = defineStory({});
