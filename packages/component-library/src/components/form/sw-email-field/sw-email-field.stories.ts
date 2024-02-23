import { action } from "@storybook/addon-actions";
import SwEmailField from "./sw-email-field.vue";
import baseFieldArgTypes from "../_internal/sw-base-field/arg-types";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type SwEmailFieldMeta = SlottedMeta<
  typeof SwEmailField,
  "default" | "updateModelValue" | "change" | "hint" | "suffix" | "prefix" | "placeholder" | "error"
>;

export default {
  title: "Components/Form/sw-email-field",
  component: SwEmailField,
  render: (args) => ({
    template: `
    <div>
      <sw-email-field
          v-bind="args"
          :modelValue="currentValue"
          @update:modelValue="onUpdateModelValue"
          @change="onChange"
          @inheritance-remove="inheritanceRemoveWrapper"
          @inheritance-restore="inheritanceRestoreWrapper">
        <template
            v-if="args.prefix"
            #prefix>
          {{args.prefix}}
        </template>
  
        <template
            v-if="args.suffix"
            #suffix>
          {{args.suffix}}
        </template>
  
        <template
            v-if="args.hint"
            #hint>
          {{args.hint}}
        </template>
      </sw-email-field>
      
      <!-- Helper element to loose focus -->
      <h4 style="display: none;">hidden</h4>
    </div>`,
    components: { SwEmailField },
    data() {
      return {
        currentValue: args.modelValue,
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
      onUpdateModelValue(e: string) {
        this.currentValue = e;
        args.updateModelValue(e);
      },

      onChange(e: string) {
        this.currentValue = e;
        args.change(e);
      },

      inheritanceRemoveWrapper(a: any) {
        this.inheritanceRemove(...a);
        this.isInherited = false;
      },

      inheritanceRestoreWrapper(a: any) {
        this.inheritanceRestore(...a);
        this.isInherited = true;
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
    label: "Emailfield",
    updateModelValue: fn(action("updateModelValue")),
  },
} as SwEmailFieldMeta;

export type SwEmailFieldStory = StoryObj<SwEmailFieldMeta>;

export const DefaultStory: SwEmailFieldStory = {
  name: "sw-email-field",
};
