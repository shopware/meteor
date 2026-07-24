import type { Meta, StoryObj } from "@storybook/vue3";
import MtStatusDot from "./mt-status-dot.vue";

export type MtStatusDotMeta = Meta<typeof MtStatusDot>;

const meta: MtStatusDotMeta = {
  title: "Components/Status Dot",
  component: MtStatusDot,
  args: {
    variant: "neutral",
    size: "m",
    pulse: false,
    label: "",
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
    pulse: {
      control: { type: "boolean" },
    },
    label: {
      control: { type: "text" },
    },
  },
  render: (args) => ({
    components: { MtStatusDot },
    setup() {
      return { args };
    },
    template: `<mt-status-dot :variant="args.variant" :size="args.size" :pulse="args.pulse" :label="args.label" />`,
  }),
};

export default meta;
export type MtStatusDotStory = StoryObj<MtStatusDotMeta>;

export const Default: MtStatusDotStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-status-dot variant="neutral" />`,
      },
    },
  },
};

export const AllVariants: MtStatusDotStory = {
  name: "Variants",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-status-dot variant="neutral" />
<mt-status-dot variant="info" />
<mt-status-dot variant="attention" />
<mt-status-dot variant="critical" />
<mt-status-dot variant="positive" />`,
      },
    },
  },
  render: () => ({
    components: { MtStatusDot },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <mt-status-dot variant="neutral" />
        <mt-status-dot variant="info" />
        <mt-status-dot variant="attention" />
        <mt-status-dot variant="critical" />
        <mt-status-dot variant="positive" />
      </div>`,
  }),
};

export const AllSizes: MtStatusDotStory = {
  name: "Sizes",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-status-dot size="s" />
<mt-status-dot size="m" />
<mt-status-dot size="l" />`,
      },
    },
  },
  render: () => ({
    components: { MtStatusDot },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <mt-status-dot variant="positive" size="s" />
        <mt-status-dot variant="positive" size="m" />
        <mt-status-dot variant="positive" size="l" />
      </div>`,
  }),
};

export const Pulse: MtStatusDotStory = {
  args: {
    variant: "positive",
    pulse: true,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-status-dot variant="positive" pulse />`,
      },
    },
  },
};
