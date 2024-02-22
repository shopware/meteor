import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import { fn } from "@storybook/test";
import SwButton from "./sw-button.vue";
import type { SlottedMeta } from "@/_internal/story-helper";

export type SwButtonMeta = SlottedMeta<typeof SwButton, "default" | "click">;

export default {
  title: "Components/Form/sw-button",
  component: SwButton,
  args: {
    default: "Button",
    variant: "primary",
    size: "small",
    disabled: false,
    square: false,
    block: false,
    isLoading: false,
    ghost: false,
    link: undefined,
    click: fn(action("click")),
  },
  render: (args) => ({
    components: { SwButton },
    setup() {
      return {
        args,
      };
    },
    template: `<sw-button @click="args.click" v-bind="args">{{ args.default}}</sw-button>`,
  }),
} as SwButtonMeta;

export type SwButtonStory = StoryObj<SwButtonMeta>;

export const DefaultStory: SwButtonStory = {
  name: "sw-button",
};
