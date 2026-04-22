import type { StoryObj } from "@storybook/vue3";
import MtBadge from "./mt-badge.vue";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtBadgeMeta = SlottedMeta<typeof MtBadge, "default">;

const meta: MtBadgeMeta = {
  title: "Components/Badge",
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
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-badge variant="neutral" size="s">
  Badge
</mt-badge>`,
      },
    },
  },
};

export const AllVariants: MtBadgeStory = {
  name: "Variants",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-badge variant="neutral">Neutral</mt-badge>
<mt-badge variant="info">Info</mt-badge>
<mt-badge variant="attention">Attention</mt-badge>
<mt-badge variant="critical">Critical</mt-badge>
<mt-badge variant="positive">Positive</mt-badge>`,
      },
    },
  },
  render: () => ({
    components: { MtBadge },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <mt-badge variant="neutral">Neutral</mt-badge>
        <mt-badge variant="info">Info</mt-badge>
        <mt-badge variant="attention">Attention</mt-badge>
        <mt-badge variant="critical">Critical</mt-badge>
        <mt-badge variant="positive">Positive</mt-badge>
      </div>`,
  }),
};

export const AllSizes: MtBadgeStory = {
  name: "Sizes",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-badge size="s">Small</mt-badge>
<mt-badge size="m">Medium</mt-badge>
<mt-badge size="l">Large</mt-badge>`,
      },
    },
  },
  render: () => ({
    components: { MtBadge },
    template: `
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
        <mt-badge size="s">Small</mt-badge>
        <mt-badge size="m">Medium</mt-badge>
        <mt-badge size="l">Large</mt-badge>
      </div>`,
  }),
};

export const StatusIndicator: MtBadgeStory = {
  name: "Status indicator",
  args: {
    default: "Connected",
    variant: "positive",
    statusIndicator: true,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-badge variant="positive" :status-indicator="true">
  Connected
</mt-badge>`,
      },
    },
  },
};

export const WithIcon: MtBadgeStory = {
  name: "With icon",
  args: {
    default: "Successful",
    variant: "positive",
    icon: "solid-check-circle",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-badge variant="positive" icon="solid-check-circle">
  Successful
</mt-badge>`,
      },
    },
  },
};
