import { action } from "@storybook/addon-actions";
import SwExternalLink from "./sw-external-link.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type SwExternalLinkMeta = SlottedMeta<typeof SwExternalLink, "default" | "click">;

export default {
  title: "Components/Form/sw-external-link",
  component: SwExternalLink,
  render: (args) => ({
    components: { SwExternalLink },
    template: `
      <sw-external-link 
        v-bind="args"
        @click="args.click"
      >
        Click here
      </sw-external-link>`,
    setup: () => {
      return {
        args,
      };
    },
  }),
  args: {
    small: false,
    rel: "noopener",
    href: "https://www.shopware.com",
    disabled: false,
    click: fn(action("click")),
  },
} as SwExternalLinkMeta;

export type SwExternalLinkStory = StoryObj<SwExternalLinkMeta>;

export const DefaultStory: SwExternalLinkStory = {
  name: "sw-external-link",
};
