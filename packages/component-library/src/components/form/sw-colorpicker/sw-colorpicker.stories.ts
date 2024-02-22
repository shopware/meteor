import SwColorpicker from "./sw-colorpicker.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type SwColorpickerMeta = SlottedMeta<typeof SwColorpicker, "default">;

export default {
  title: "Components/Form/sw-colorpicker",
  component: SwColorpicker,
  render: (args) => ({
    components: { SwColorpicker },
    template: '<sw-colorpicker v-bind="args"></sw-colorpicker>',
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
} as SwColorpickerMeta;

export type SwColorpickerStory = StoryObj<SwColorpickerMeta>;

export const DefaultStory: SwColorpickerStory = {
  name: "sw-colorpicker",
};
