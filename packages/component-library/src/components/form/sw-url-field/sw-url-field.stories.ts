import SwUrlField from "./sw-url-field.vue";
import baseFieldArgTypes from "../_internal/sw-base-field/arg-types";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type SwUrlFieldMeta = SlottedMeta<
  typeof SwUrlField,
  | "default"
  | "change"
  | "hint"
  | "label"
  | "placeholder"
  | "error"
  | "inheritanceRestore"
  | "inheritanceRemove"
  | "isInherited"
  | "updateModelValue"
>;

export default {
  title: "Components/Form/sw-url-field",
  component: SwUrlField,
  render: (args) => ({
    components: { SwUrlField },
    template: `<div>
        <sw-url-field
          v-bind="args"
          :modelValue="currentValue"
          @change="onChange"
          @update:modelValue="args.updateModelValue"
          @inheritance-restore="inheritanceRestoreWrapper"
          @inheritance-remove="inheritanceRemoveWrapper">
          <template
            v-if="$props.prefix"
            #prefix>
            {{ $props.prefix }}
          </template>
          <template
            v-if="$props.suffix"
            #suffix>
            {{ $props.suffix }}
          </template>
          <template
            v-if="$props.hint"
            #hint>
            {{ $props.hint }}
          </template>
        </sw-url-field>
  
        <h4 style="display: none;">hidden</h4>
      </div>`,
    data() {
      return { currentValue: "" };
    },
    watch: {
      "args.modelValue"(v) {
        this.currentValue = v;
      },
    },
    created() {
      this.currentValue = args.modelValue;
    },
    methods: {
      inheritanceRemoveWrapper(a: any) {
        args.inheritanceRemove(...a);
        args.isInherited = false;
      },

      inheritanceRestoreWrapper(a: any) {
        args.inheritanceRestore(...a);
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
  args: {
    label: "Url field",
    size: "default",
  },
  argTypes: {
    ...baseFieldArgTypes,
  },
} as SwUrlFieldMeta;

export type SwUrlFieldStory = StoryObj<SwUrlFieldMeta>;

export const DefaultStory: SwUrlFieldStory = {
  name: "sw-url-field",
};
