import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import { fn } from "@storybook/test";
import MtLink from "./mt-link.vue";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtLinkMeta = SlottedMeta<typeof MtLink, "default" | "close" | "click">;

export default {
  title: "Components/Navigation/mt-link",
  component: MtLink,
  args: {
    as: "a",
    default: "Link",
    to: "/",
    variant: "primary",
    disabled: false,
    click: fn(action("click")),
  },
  render: (args) => ({
    components: { MtLink },
    setup() {
      return {
        args,
      };
    },
    template: `<mt-link @click="args.click" v-bind="args">{{ args.default}}</mt-link>`,
  }),
} as MtLinkMeta;

export type MtLinkStory = StoryObj<MtLinkMeta>;

export const DefaultStory: MtLinkStory = {
  name: "mt-link",
};
