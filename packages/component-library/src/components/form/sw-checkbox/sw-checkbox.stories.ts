import { action } from "@storybook/addon-actions";
import SwCheckbox from "./sw-checkbox.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type SwCheckboxMeta = SlottedMeta<
  typeof SwCheckbox,
  "default" | "change" | "isInherited" | "inheritanceRemove"
>;

export default {
  title: "Components/Form/sw-checkbox",
  component: SwCheckbox,
  args: {
    label: "Checkbox",
    disabled: false,
    bordered: false,
    change: fn(action("change")),
    inheritanceRemove: fn(action("inheritance-remove")),
    inheritanceRestore: fn(action("inheritance-restore")),
  },
  render: (args) => ({
    components: { SwCheckbox },
    template: `<sw-checkbox
              v-bind="args"
              @change="args.change"
              @inheritance-remove="args.inheritanceRemove"
              @inheritance-restore="args.inheritanceRestore"
            ></sw-checkbox>`,
    setup: () => {
      return {
        args,
      };
    },
  }),
} as SwCheckboxMeta;

export type SwCheckboxStory = StoryObj<SwCheckboxMeta>;

export const DefaultStory: SwCheckboxStory = {
  name: "sw-checkbox",
};
