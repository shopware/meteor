import type { StoryObj } from "@storybook/vue3";
import MtBadge from "./mt-badge.vue";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtBadgeMeta = SlottedMeta<typeof MtBadge, "default">;

const meta: MtBadgeMeta = {
  title: "Components/Feedback Indicator/mt-badge",
  component: MtBadge,
  args: {
    default: "Badge",
    variant: "neutral",
    size: "m",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["neutral", "info", "attention", "critical", "positive"],
    },
    size: {
      control: { type: "select" },
      options: ["s", "m", "l"],
    },
  },
  render: (args) => ({
    components: { MtBadge },
    setup() {
      return {
        args,
      };
    },
    template: `
      <mt-badge
        :variant="args.variant"
        :size="args.size"
      >
        {{ args.default }}
      </mt-badge>`,
  }),
};

export default meta;
export type MtBadgeStory = StoryObj<MtBadgeMeta>;

export const Default: MtBadgeStory = {
  name: "mt-badge",
};
