import MtColorpicker from "./mt-colorpicker.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { ref } from "vue";
import { fn } from "@storybook/test";

export type MtColorpickerMeta = SlottedMeta<typeof MtColorpicker, "default" | "updateModelValue">;

export default {
  title: "Components/Form/mt-colorpicker",
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

export const DefaultStory: MtColorpickerStory = {
  name: "mt-colorpicker",
};
