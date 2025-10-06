import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import { fn } from "@storybook/test";
import MtShopwareSsoButton from "./mt-shopware-sso-button.vue";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtShopwareSsoButtonMeta = SlottedMeta<
  typeof MtShopwareSsoButton,
  "default" | "click"
>;

export default {
  title: "Components/Form/mt-shopware-sso-button",
  component: MtShopwareSsoButton,
  args: {
    default: "Login with Shopware SSO",
    disabled: false,
    block: false,
    is: "button",
    click: fn(action("click")),
  },
  render: (args) => ({
    components: { MtShopwareSsoButton },
    setup() {
      return { args };
    },
    template: `<mt-shopware-sso-button @click="args.click" v-bind="args">{{ args.default }}</mt-shopware-sso-button>`,
  }),
} as MtShopwareSsoButtonMeta;

export type MtShopwareSsoButtonStory = StoryObj<MtShopwareSsoButtonMeta>;

export const DefaultStory: MtShopwareSsoButtonStory = {
  name: "mt-shopware-sso-button",
};


