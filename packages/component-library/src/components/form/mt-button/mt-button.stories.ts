import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import { fn } from "@storybook/test";
import MtButton from "./mt-button.vue";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtButtonMeta = SlottedMeta<typeof MtButton, "default" | "click">;

export default {
  title: "Components/Form/mt-button",
  component: MtButton,
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
  argTypes: {
    showFrontIcon: {
      control: "boolean",
      description: "Show/hide front icon",
      defaultValue: false,
    },
    showBackIcon: {
      control: "boolean",
      description: "Show/hide back icon",
      defaultValue: false,
    },
  },
  render: (args) => ({
    components: { MtButton, MtIcon },
    setup() {
      return {
        args,
      };
    },
    template: `<mt-button @click="args.click" v-bind="args">
     <template v-if="args.showFrontIcon" #iconFront="slotProps">
          <mt-icon
            name="regular-plus-xs"
            :size="slotProps.size"
          />
        </template>
        {{ args.default}}
        <template v-if="args.showBackIcon" #iconBack="slotProps">
          <mt-icon
            name="regular-plus-xs"
            :size="slotProps.size"
          />
        </template>
     </mt-button>`,
  }),
} as MtButtonMeta;

export type MtButtonStory = StoryObj<MtButtonMeta>;

export const DefaultStory: MtButtonStory = {
  name: "mt-button",
};
