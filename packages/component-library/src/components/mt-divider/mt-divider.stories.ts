import type { Meta, StoryObj } from "@storybook/vue3";
import MtDivider from "./mt-divider.vue";
import MtText from "../mt-text/mt-text.vue";
import MtCard from "../mt-card/mt-card.vue";

export type MtDividerMeta = Meta<typeof MtDivider>;

const meta: MtDividerMeta = {
  title: "Components/Divider",
  component: MtDivider,
  render: (args) => ({
    components: { MtDivider },
    setup: () => ({ args }),
    template: `<mt-divider v-bind="args" />`,
  }),
};

export default meta;
export type MtDividerStory = StoryObj<MtDividerMeta>;

export const Default: MtDividerStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-divider />`,
      },
    },
  },
};

export const WithContent: MtDividerStory = {
  name: "With content",
  render: () => ({
    components: { MtDivider, MtText },
    template: `
<mt-divider>
  <mt-text size="xs" color="color-text-secondary-default">or</mt-text>
</mt-divider>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-divider>
  <mt-text size="xs" color="color-text-secondary-default">or</mt-text>
</mt-divider>`,
      },
    },
  },
};

export const Vertical: MtDividerStory = {
  render: () => ({
    components: { MtDivider },
    template: `
<div style="display: flex; height: 48px; gap: var(--scale-size-16); align-items: center;">
  <span>Left</span>
  <mt-divider orientation="vertical" />
  <span>Right</span>
</div>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-divider orientation="vertical" />`,
      },
    },
  },
};

export const Dashed: MtDividerStory = {
  args: {
    variant: "dashed",
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-divider variant="dashed" />`,
      },
    },
  },
};

export const FullBleed: MtDividerStory = {
  name: "Full bleed",
  render: () => ({
    components: { MtDivider, MtCard, MtText },
    template: `
<mt-card title="Full bleed">
  <div style="display: grid; gap: var(--scale-size-24)">
    <mt-text>The divider below stretches across the card padding.</mt-text>
    <mt-divider full-bleed />
    <mt-text>The divider above ignores the card padding.</mt-text>
  </div>
</mt-card>`,
  }),
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-divider full-bleed />`,
      },
    },
  },
};

export const Decorative: MtDividerStory = {
  args: {
    decorative: true,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-divider decorative />`,
      },
    },
  },
};
