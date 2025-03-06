import MtCheckbox from "./mt-checkbox.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtCheckboxMeta = SlottedMeta<
  typeof MtCheckbox,
  "default" | "change" | "isInherited" | "inheritanceRemove" | "checked"
>;

export default {
  title: "Components/Form/mt-checkbox",
  component: MtCheckbox,
  args: {
    label: "Checkbox",
    onChange: fn(),
    inheritanceRemove: fn(),
    inheritanceRestore: fn(),
  },
} as MtCheckboxMeta;

export type MtCheckboxStory = StoryObj<MtCheckboxMeta>;

export const DefaultStory: MtCheckboxStory = {};
