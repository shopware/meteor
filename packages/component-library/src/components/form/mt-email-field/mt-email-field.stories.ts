import MtEmailField from "./mt-email-field.vue";
import baseFieldArgTypes from "../_internal/mt-base-field/arg-types";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { MtTextField } from "@/index";

export type MtEmailFieldMeta = SlottedMeta<
  typeof MtEmailField,
  | "default"
  | "updateModelValue"
  | "change"
  | "hint"
  | "suffix"
  | "prefix"
  | "placeholder"
  | "error"
  | "_showSecondTextField"
>;

export default {
  title: "Components/Form/mt-email-field",
  component: MtEmailField,
  render: (args) => ({
    template: `
    <div>
      <mt-email-field
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
      </mt-email-field>

      <mt-text-field
        v-if="args._showSecondTextField"
        label="Textfield for testing"
      ></mt-text-field>
      
      <!-- Helper element to loose focus -->
      <h4 style="display: none;">hidden</h4>
    </div>`,
    components: { MtEmailField, MtTextField },
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

      inheritanceRemoveWrapper() {
        this.isInherited = false;
      },

      inheritanceRestoreWrapper() {
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
  },
} as MtEmailFieldMeta;

export type MtEmailFieldStory = StoryObj<MtEmailFieldMeta>;

export const DefaultStory: MtEmailFieldStory = {
  name: "mt-email-field",
};
