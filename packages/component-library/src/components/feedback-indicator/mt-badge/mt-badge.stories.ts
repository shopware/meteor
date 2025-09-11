import type { StoryObj } from "@storybook/vue3";
import MtBadge from "./mt-badge.vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtBadgeMeta = SlottedMeta<typeof MtBadge, "default"> & {
  args: {
    showIcon?: boolean;
  };
  argTypes: {
    showIcon?: any;
  };
};

const meta: MtBadgeMeta = {
  title: "Components/Feedback Indicator/mt-badge",
  component: MtBadge,
  args: {
    default: "Badge",
    variant: "neutral",
    size: "s",
    showIcon: false,
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
    showIcon: {
      control: { type: "boolean" },
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
      >
        <template v-if="args.showIcon" #icon="slotProps">
          <mt-icon
            name="solid-party-horn"
            size="10"
          />
        </template>
        {{ args.default }}
      </mt-badge>`,
  }),
};

export default meta;
export type MtBadgeStory = StoryObj<MtBadgeMeta>;

export const Default: MtBadgeStory = {
  name: "mt-badge",
};
