import type { SlottedMeta } from "@/_internal/story-helper";
import MtTooltip from "./mt-tooltip.vue";
import type { StoryObj } from "@storybook/vue3";
import MtButton from "@/components/form/mt-button/mt-button.vue";

export type MtTooltipMeta = SlottedMeta<typeof MtTooltip, "default">;

export default {
  title: "Components/mt-tooltip",
  component: MtTooltip,
  args: {
    content: "Tooltip content",
  },
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { MtTooltip, MtButton },
    template: `
<mt-tooltip v-bind="args">
    <template #default="params">
        <mt-button variant="secondary" v-bind="params" ref="params.ref">Open tooltip</mt-button>
    </template>
</mt-tooltip>`,
  }),
} satisfies MtTooltipMeta;

export type MtTooltipStory = StoryObj<typeof MtTooltip>;

export const Default: MtTooltipStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-tooltip content="Tooltip content">
  <template #default="params">
    <mt-button variant="secondary" v-bind="params">Open tooltip</mt-button>
  </template>
</mt-tooltip>`,
      },
    },
  },
};

export const Placement: MtTooltipStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-tooltip content="Tooltip content" placement="right">
  <template #default="params">
    <mt-button variant="secondary" v-bind="params">Right placement</mt-button>
  </template>
</mt-tooltip>`,
      },
    },
  },
  args: {
    content: "Tooltip content",
    placement: "right",
  },
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { MtTooltip, MtButton },
    template: `
<mt-tooltip v-bind="args">
    <template #default="params">
        <mt-button variant="secondary" v-bind="params">Right placement</mt-button>
    </template>
</mt-tooltip>`,
  }),
};

export const RichContent: MtTooltipStory = {
  name: "Rich content",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-tooltip
  content="<strong>Tooltip title: </strong>Use short supporting details."
  :max-width="240"
>
  <template #default="params">
    <mt-button variant="secondary" v-bind="params">Open tooltip</mt-button>
  </template>
</mt-tooltip>`,
      },
    },
  },
  args: {
    content: "<strong>Tooltip title: </strong>Use short supporting details.",
    maxWidth: 240,
  },
  render: (args) => ({
    setup() {
      return { args };
    },
    components: { MtTooltip, MtButton },
    template: `
<mt-tooltip v-bind="args">
    <template #default="params">
        <mt-button variant="secondary" v-bind="params">Open tooltip</mt-button>
    </template>
</mt-tooltip>`,
  }),
};
