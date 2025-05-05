import MtUnitField from "./mt-unit-field.vue";
import baseFieldArgTypes from "../_internal/mt-base-field/arg-types";
import type { Meta, StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtUnitFieldMeta = SlottedMeta<
  typeof MtUnitField,
  | "default"
  | "inheritanceRemove"
  | "inheritanceRestore"
  | "isInherited"
  | "change"
  | "updateModelValue"
  | "modelValue"
  | "error"
>;

const meta: Meta<typeof MtUnitField> = {
  title: "Components/Form/mt-unit-field",
  component: MtUnitField,
  tags: ["autodocs"],
  render: (args) => ({
    template: `
      <div>
        <mt-unit-field
          v-bind="args"
          v-model="currentValue"
          v-model:defaultUnit="currentUnit"
          v-model:measurementType="currentMeasurementType"
          @update:modelValue="args.updateModelValue"
          @inheritance-restore="inheritanceRestoreWrapper"
          @inheritance-remove="inheritanceRemoveWrapper">
        </mt-unit-field>
        <h4 style="display: none;">hidden</h4>
      </div>`,
    components: { MtUnitField },
    data() {
      return {
        currentValue: null,
        currentUnit: args.defaultUnit,
        currentMeasurementType: args.measurementType,
      };
    },
    watch: {
      "args.modelValue"(v) {
        if (this.currentValue === v) {
          return;
        }
        this.currentValue = v;
      },
      "args.defaultUnit"(v) {
        if (this.currentUnit === v) {
          return;
        }
        this.currentUnit = v;
      },
      "args.measurementType"(v) {
        if (this.currentMeasurementType === v) {
          return;
        }
        this.currentMeasurementType = v;
      },
    },
    created() {
      this.currentValue = args.modelValue;
      this.currentUnit = args.defaultUnit;
      this.currentMeasurementType = args.measurementType;
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
    label: "Unit field",
    defaultUnit: "m",
    measurementType: "length",
    updateModelValue: fn(),
    inheritanceRemove: fn(),
    inheritanceRestore: fn(),
    zIndex: 9,
  },
  argTypes: {
    ...baseFieldArgTypes,
  },
} as MtUnitFieldMeta;

export default meta;

export type MtUnitFieldStory = StoryObj<typeof meta>;

export const Default: MtUnitFieldStory = {
  name: "mt-unit-field",
};
