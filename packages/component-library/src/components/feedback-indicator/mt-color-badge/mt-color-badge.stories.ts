import MtColorBadge from "./mt-color-badge.vue";
import type { StoryObj } from "@storybook/vue3";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtColorBadgeMeta = SlottedMeta<typeof MtColorBadge, "default">;

const meta: MtColorBadgeMeta = {
  title: "Components/Feedback Indicator/mt-color-badge",
  component: MtColorBadge,
  args: {
    rounded: false,
    variant: "default",
    hasText: false,
    color: "",
    default: "",
  },
  render: (args) => ({
    components: { MtColorBadge },
    setup() {
      return {
        args,
      };
    },
    template: `
      <mt-color-badge
        v-bind="args"
      >
        <div v-html="args.default"></div>
      </mt-color-badge>`,
  }),
};

export default meta;
export type MtColorBadgeStory = StoryObj<MtColorBadgeMeta>;

export const DefaultStory: MtColorBadgeStory = {
  name: "mt-color-badge",
};
