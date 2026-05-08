import MtColorpicker from "./mt-colorpicker.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { ref } from "vue";
import { fn } from "@storybook/test";

export type MtColorpickerMeta = SlottedMeta<typeof MtColorpicker, "default" | "updateModelValue">;

export default {
  title: "Components/Colorpicker",
  component: MtColorpicker,
  render: (args) => ({
    components: { MtColorpicker },
    template: `<mt-colorpicker 
      v-bind="args"
      :modelValue="currentModelValue"
      @update:modelValue="onUpdateModelValue"
    ></mt-colorpicker>`,
    setup: () => {
      const currentModelValue = ref(args.modelValue);
      const onUpdateModelValue = (value: string) => {
        currentModelValue.value = value;
        args.updateModelValue(value);
      };

      return {
        args,
        currentModelValue,
        onUpdateModelValue,
      };
    },
  }),
  args: {
    label: "Colorpicker example",
    modelValue: "#0fcff5",
    colorOutput: "auto",
    disabled: false,
    readonly: false,
    alpha: true,
    colorLabels: true,
    zIndex: null,
    helpText: "",
    required: false,
    isInherited: false,
    isInheritanceField: false,
    disableInheritanceToggle: false,
    compact: false,
    updateModelValue: fn(),
  },
} as MtColorpickerMeta;

export type MtColorpickerStory = StoryObj<MtColorpickerMeta>;

export const Default: MtColorpickerStory = {
  parameters: {
    docs: {
      source: {
        code: `<mt-colorpicker label="Colorpicker example" model-value="#0fcff5" />`,
      },
    },
  },
};

export const WithoutAlpha: MtColorpickerStory = {
  name: "Without alpha",
  args: {
    label: "Solid color",
    modelValue: "#0fcff5",
    alpha: false,
  },
  parameters: {
    docs: {
      source: {
        code: `<mt-colorpicker label="Solid color" model-value="#0fcff5" :alpha="false" />`,
      },
    },
  },
};
