import SwNumberField from "./sw-number-field.vue";
import baseFieldArgTypes from "../_internal/sw-base-field/arg-types";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type SwNumberFieldMeta = SlottedMeta<
  typeof SwNumberField,
  | "default"
  | "inheritanceRemove"
  | "inheritanceRestore"
  | "isInherited"
  | "change"
  | "modelValue"
  | "hint"
  | "suffix"
  | "prefix"
  | "error"
>;

export default {
  title: "Components/Form/sw-number-field",
  component: SwNumberField,
  render: (args) => ({
    template: `
      <div>
        <sw-number-field
          v-bind="args"
          v-model="currentValue"
          @change="args.change"
          @update:modelValue="args.updateModelValue"
          @inheritance-restore="inheritanceRestoreWrapper"
          @inheritance-remove="inheritanceRemoveWrapper">
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
        </sw-number-field>
        <h4 style="display: none;">hidden</h4>
      </div>`,
    components: { SwNumberField },
    data() {
      return {
        currentValue: "",
      };
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
    },
    setup: () => {
      return {
        args,
      };
    },
  }),
  args: {
    label: "Numberfield",
    step: 1,
    numberType: "int",
  },
  argTypes: {
    ...baseFieldArgTypes,
  },
} as SwNumberFieldMeta;

export type SwNumberFieldStory = StoryObj<SwNumberFieldMeta>;

export const DefaultStory: SwNumberFieldStory = {
  name: "sw-number-field",
};
