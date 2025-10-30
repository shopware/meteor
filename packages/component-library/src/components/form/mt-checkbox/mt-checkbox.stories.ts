import { action } from "@storybook/addon-actions";
import MtCheckbox from "./mt-checkbox.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtCheckboxMeta = SlottedMeta<
  typeof MtCheckbox,
  | "default"
  | "change"
  | "updateModelValue"
  | "isInherited"
  | "inheritanceRemove"
  | "checked"
  | "modelValue"
>;

export default {
  title: "Components/Form/mt-checkbox",
  component: MtCheckbox,
  args: {
    label: "Checkbox",
    disabled: false,
    bordered: false,
    change: fn(action("change")),
    updateModelValue: fn(action("update:modelValue")),
    inheritanceRemove: fn(action("inheritance-remove")),
    inheritanceRestore: fn(action("inheritance-restore")),
  },
  render: (args) => ({
    components: { MtCheckbox },
    template: `<mt-checkbox
              v-bind="args"
              :modelValue="currentValue"
              @update:modelValue="onUpdateModelValue"
              @change="args.change"
              @inheritance-remove="args.inheritanceRemove"
              @inheritance-restore="args.inheritanceRestore"
            ></mt-checkbox>`,
    setup: () => {
      return {
        args,
      };
    },
    data() {
      return { currentValue: undefined as boolean | undefined };
    },
    watch: {
      "args.modelValue"(v) {
        if (this.currentValue === v) {
          return;
        }

        this.currentValue = v as boolean | undefined;
      },
    },
    created() {
      this.currentValue = args.modelValue as boolean | undefined;
    },
    methods: {
      onUpdateModelValue(value: boolean) {
        this.currentValue = value;
        args.updateModelValue(value);
      },
    },
  }),
} as MtCheckboxMeta;

export type MtCheckboxStory = StoryObj<MtCheckboxMeta>;

export const DefaultStory: MtCheckboxStory = {
  name: "mt-checkbox",
};
