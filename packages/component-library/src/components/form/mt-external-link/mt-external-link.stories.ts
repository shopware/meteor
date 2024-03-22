import { action } from "@storybook/addon-actions";
import MtExternalLink from "./mt-external-link.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";
import { fn } from "@storybook/test";

export type MtExternalLinkMeta = SlottedMeta<typeof MtExternalLink, "default" | "click">;

export default {
  title: "Components/Form/mt-external-link",
  component: MtExternalLink,
  render: (args) => ({
    components: { MtExternalLink },
    template: `
      <mt-external-link 
        v-bind="args"
        @click="args.click"
      >
        Click here
      </mt-external-link>`,
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
} as MtExternalLinkMeta;

export type MtExternalLinkStory = StoryObj<MtExternalLinkMeta>;

export const DefaultStory: MtExternalLinkStory = {
  name: "mt-external-link",
};
