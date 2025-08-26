import MtTextField from "./mt-text-field.vue";
import baseFieldArgTypes from "../_internal/mt-base-field/arg-types";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtTextFieldMeta = SlottedMeta<
  typeof MtTextField,
  | "default"
  | "change"
  | "updateModelValue"
  | "prefix"
  | "suffix"
  | "hint"
  | "label"
  | "placeholder"
  | "error"
  | "inheritanceRestore"
  | "inheritanceRemove"
  | "isInherited"
  | "focus"
>;

export default {
  title: "Components/Form/mt-text-field",
  component: MtTextField,
  render: (args) => ({
    template: `
    <div>
      <mt-text-field
        v-bind="args"
        :modelValue="currentValue"
        @update:modelValue="onUpdateModelValue"
        @inheritance-restore="inheritanceRestoreWrapper"
        @inheritance-remove="inheritanceRemoveWrapper"
        @change="onChange"
        @focus="handleFocus">
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
      </mt-text-field>
      <h4 style="display: none;">hidden</h4>
    </div>`,
    components: { MtTextField },
    // argTypes contains all props of text field
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
      inheritanceRemoveWrapper() {
        args.inheritanceRemove();
        args.isInherited = false;
      },

      inheritanceRestoreWrapper() {
        args.inheritanceRestore();
        args.isInherited = true;
      },

      onUpdateModelValue(value: string) {
        this.currentValue = value;
        args.updateModelValue(value);
      },

      onChange(value: string) {
        args.change(value);
        this.currentValue = value;
      },

      handleFocus() {
        args.focus();
      },
    },
    setup: () => {
      return {
        args,
      };
    },
  }),
  argTypes: {
    focus: {
      action: "focus",
      table: {
        category: "Events",
      },
    },
    ...baseFieldArgTypes,
  },
  args: {
    label: "Textfield label",
    change: fn(),
    updateModelValue: fn(),
    inheritanceRemove: fn(),
    inheritanceRestore: fn(),
    focus: fn(),
  },
} as MtTextFieldMeta;

export type MtTextFieldStory = StoryObj<MtTextFieldMeta>;

export const DefaultStory: MtTextFieldStory = {
  name: "mt-text-field",
};
