import baseFieldArgTypes from "../_internal/mt-base-field/arg-types";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import MtSlider from "./mt-slider.vue";

export type MtSliderMeta = SlottedMeta<
  typeof MtSlider,
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
  title: "Components/Form/mt-slider",
  component: MtSlider,
  render: (args) => ({
    template: `
      <div>
        <mt-slider
          v-bind="args"
          v-model="args.modelValue"
          :disabled="args.disabled"
          @inheritance-restore="inheritanceRestoreWrapper"
          @inheritance-remove="inheritanceRemoveWrapper">
          <template
            v-if="args.hint"
            #hint>
            {{ args.hint }}
          </template>
        </mt-slider>
        <h4 style="display: none;">hidden</h4>
      </div>`,
    components: { MtSlider },
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
    label: "Slider",
    min: 0,
    max: 100,
    step: 1,
    isRange: false,
    markCount: 5,
    disabled: false,
    hasFocus: false,
    helpText: "",
  },
  argTypes: {
    ...baseFieldArgTypes,
  },
} as MtSliderMeta;

export type MtSliderStory = StoryObj<MtSliderMeta>;

export const DefaultStory: MtSliderStory = {
  name: "mt-slider",
};
