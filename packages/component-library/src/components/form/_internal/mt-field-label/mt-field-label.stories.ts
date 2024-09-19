import type { StoryObj } from "@storybook/vue3";
import MtFieldLabel from "./mt-field-label.vue";
import { fn } from "@storybook/test";
import type { SlottedMeta } from "@/_internal/story-helper";

export default {
  title: "Components/Form/mt-field-label",
  component: MtFieldLabel,
  args: {
    default: "Field Label",
    id: "some-id",
    "onUpdate:inheritance": fn(),
  },
  argTypes: {
    inheritance: {
      control: {
        type: "select",
      },
      options: ["none", "linked", "unlinked"],
    },
  },
} satisfies SlottedMeta<typeof MtFieldLabel, "default">;

type MtFieldLabelStory = StoryObj<typeof MtFieldLabel>;

export const Default: MtFieldLabelStory = {};
