import MtNumberField from "./mt-number-field.vue";
import baseFieldArgTypes from "../_internal/mt-base-field/arg-types";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtNumberFieldMeta = SlottedMeta<
  typeof MtNumberField,
  | "default"
  | "inheritanceRemove"
  | "inheritanceRestore"
  | "isInherited"
  | "change"
  | "updateModelValue"
  | "modelValue"
  | "hint"
  | "suffix"
  | "prefix"
  | "error"
>;

export default {
  title: "Components/Form/mt-number-field",
  component: MtNumberField,
  render: (args) => ({
    template: `
      <div>
        <mt-number-field
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
        </mt-number-field>
        <h4 style="display: none;">hidden</h4>
      </div>`,
    components: { MtNumberField },
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
    change: fn(),
    updateModelValue: fn(),
    inheritanceRemove: fn(),
    inheritanceRestore: fn(),
  },
  argTypes: {
    ...baseFieldArgTypes,
  },
} as MtNumberFieldMeta;

export type MtNumberFieldStory = StoryObj<MtNumberFieldMeta>;

export const DefaultStory: MtNumberFieldStory = {
  name: "mt-number-field",
};
