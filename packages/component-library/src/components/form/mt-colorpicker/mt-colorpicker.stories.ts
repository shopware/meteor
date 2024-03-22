import MtColorpicker from "./mt-colorpicker.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtColorpickerMeta = SlottedMeta<typeof MtColorpicker, "default">;

export default {
  title: "Components/Form/mt-colorpicker",
  component: MtColorpicker,
  render: (args) => ({
    components: { MtColorpicker },
    template: '<mt-colorpicker v-bind="args"></mt-colorpicker>',
    setup: () => {
      return {
        args,
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
  },
} as MtColorpickerMeta;

export type MtColorpickerStory = StoryObj<MtColorpickerMeta>;

export const DefaultStory: MtColorpickerStory = {
  name: "mt-colorpicker",
};
