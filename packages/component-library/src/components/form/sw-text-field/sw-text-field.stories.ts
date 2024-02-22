import SwTextField from "./sw-text-field.vue";
import baseFieldArgTypes from "../_internal/sw-base-field/arg-types";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type SwTextFieldMeta = SlottedMeta<
  typeof SwTextField,
  | "default"
  | "change"
  | "prefix"
  | "suffix"
  | "hint"
  | "label"
  | "placeholder"
  | "error"
  | "inheritanceRestore"
  | "inheritanceRemove"
  | "isInherited"
>;

export default {
  title: "Components/Form/sw-text-field",
  component: SwTextField,
  render: (args) => ({
    template: `
    <div>
      <sw-text-field
        v-bind="args"
        :modelValue="currentValue"
        @inheritance-restore="inheritanceRestoreWrapper"
        @inheritance-remove="inheritanceRemoveWrapper"
        @change="onChange">
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
      </sw-text-field>
      <h4 style="display: none;">hidden</h4>
    </div>`,
    components: { SwTextField },
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

      onChange(value: string) {
        args.change(value);
        this.currentValue = value;
      },
    },
    setup: () => {
      return {
        args,
      };
    },
  }),
  argTypes: {
    ...baseFieldArgTypes,
  },
  args: {
    label: "Textfield label",
  },
} as SwTextFieldMeta;

export type SwTextFieldStory = StoryObj<SwTextFieldMeta>;

export const DefaultStory: SwTextFieldStory = {
  name: "sw-text-field",
};
