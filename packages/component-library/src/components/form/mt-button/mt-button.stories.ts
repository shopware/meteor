import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import { fn } from "@storybook/test";
import MtButton from "./mt-button.vue";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtButtonMeta = SlottedMeta<typeof MtButton, "default" | "click">;

export default {
  title: "Components/Form/mt-button",
  component: MtButton,
  args: {
    default: "Button",
    iconFront: "",
    iconBack: "",
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
    components: { MtButton },
    setup() {
      return {
        args,
      };
    },
    template: `<mt-button @click="args.click" v-bind="args">
      <template v-if="args.iconFront" #iconFront>
        <div v-html="args.iconFront"></div>
      </template>
      {{ args.default}}
      <template v-if="args.iconBack" #iconBack>
        <div v-html="args.iconBack"></div>
      </template>
     </mt-button>`,
  }),
} as MtButtonMeta;

export type MtButtonStory = StoryObj<MtButtonMeta>;

export const DefaultStory: MtButtonStory = {
  name: "mt-button",
};
