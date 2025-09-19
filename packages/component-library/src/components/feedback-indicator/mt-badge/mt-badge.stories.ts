import type { StoryObj } from "@storybook/vue3";
import MtBadge from "./mt-badge.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtBadgeMeta = SlottedMeta<typeof MtBadge, "default">;

const meta: MtBadgeMeta = {
  title: "Components/Feedback Indicator/mt-badge",
  component: MtBadge,
  args: {
    default: "Badge",
    variant: "neutral",
    size: "s",
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
    statusIndicator: {
      control: { type: "boolean" },
    },
    icon: {
      control: { type: "text" },
    },
  },
  render: (args) => ({
    components: { MtBadge, MtIcon },
    setup() {
      return {
        args,
      };
    },
    template: `
      <mt-badge
        :variant="args.variant"
        :size="args.size"
        :status-indicator="args.statusIndicator"
        :icon="args.icon"
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
