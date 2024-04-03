import { action } from "@storybook/addon-actions";
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
    disabled: false,
    bordered: false,
    change: fn(action("change")),
    inheritanceRemove: fn(action("inheritance-remove")),
    inheritanceRestore: fn(action("inheritance-restore")),
  },
  render: (args) => ({
    components: { MtCheckbox },
    template: `<mt-checkbox
              v-bind="args"
              @change="args.change"
              @inheritance-remove="args.inheritanceRemove"
              @inheritance-restore="args.inheritanceRestore"
            ></mt-checkbox>`,
    setup: () => {
      return {
        args,
      };
    },
  }),
} as MtCheckboxMeta;

export type MtCheckboxStory = StoryObj<MtCheckboxMeta>;

export const DefaultStory: MtCheckboxStory = {
  name: "mt-checkbox",
};
