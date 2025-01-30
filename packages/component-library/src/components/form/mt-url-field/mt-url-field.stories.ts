import MtUrlField from "./mt-url-field.vue";
import baseFieldArgTypes from "../_internal/mt-base-field/arg-types";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtUrlFieldMeta = SlottedMeta<
  typeof MtUrlField,
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
  title: "Components/Form/mt-url-field",
  component: MtUrlField,
  render: (args) => ({
    components: { MtUrlField },
    template: `<div>
        <mt-url-field
          v-bind="args"
          :modelValue="currentValue"
          @change="onChange"
          @update:modelValue="onUpdateModelValue"
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
        </mt-url-field>
  
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

      onUpdateModelValue(value: string) {
        args.updateModelValue(value);
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
} as MtUrlFieldMeta;

export type MtUrlFieldStory = StoryObj<MtUrlFieldMeta>;

export const DefaultStory: MtUrlFieldStory = {
  name: "mt-url-field",
};
