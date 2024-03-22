import { action } from "@storybook/addon-actions";
import MtPasswordField from "./mt-password-field.vue";
import baseFieldArgTypes from "../_internal/mt-base-field/arg-types";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtPasswordFieldMeta = SlottedMeta<
  typeof MtPasswordField,
  | "default"
  | "inheritanceRemove"
  | "inheritanceRestore"
  | "isInherited"
  | "change"
  | "value"
  | "hint"
  | "suffix"
  | "prefix"
  | "error"
>;

export default {
  title: "Components/Form/mt-password-field",
  component: MtPasswordField,
  render: (args) => ({
    template: `
      <div>
        <mt-password-field
          v-bind="args"
          :modelValue="currentValue"
          @change="onChange"
          @inheritance-restore="inheritanceRestoreWrapper"
          @inheritance-remove="inheritanceRemoveWrapper"
        >
          <template
              v-if="args.prefix"
              #prefix>
            {{ args.prefix }}
          </template>
          <template
              v-if="args.suffix"
              #suffix>
            {{ args.suffix }}
          </template>
          <template
              v-if="args.hint"
              #hint>
            {{ args.hint }}
          </template>
        </mt-password-field>
        <h4 style="display: none;">hidden</h4>
      </div>`,
    components: { MtPasswordField },
    data() {
      return { currentValue: "" };
    },
    watch: {
      "args.modelValue"(v) {
        if (this.currentValue === v) {
          return;
        }

        this.currentValue = v;
      },
    },
    created() {
      this.currentValue = args.modelValue;
    },
    methods: {
      onChange(value: string) {
        args.change(value);
        this.currentValue = value;
      },
      inheritanceRemoveWrapper(a: any) {
        this.inheritanceRemove(...a);
        args.isInherited = false;
      },

      inheritanceRestoreWrapper(a: any) {
        this.inheritanceRestore(...a);
        args.isInherited = true;
      },
    },
    setup: () => {
      return {
        args,
      };
    },
  }),
  args: {
    label: "Passwordfield",
    change: fn(action("change")),
    updateModelValue: fn(action("updateModelValue")),
  },
  argTypes: {
    ...baseFieldArgTypes,
  },
} as MtPasswordFieldMeta;

export type MtPasswordFieldStory = StoryObj<MtPasswordFieldMeta>;

export const DefaultStory: MtPasswordFieldStory = {
  name: "mt-password-field",
};
