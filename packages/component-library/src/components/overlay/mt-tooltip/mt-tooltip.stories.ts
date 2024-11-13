import type { SlottedMeta } from "@/_internal/story-helper";
import MtTooltip from "./mt-tooltip.vue";
import type { StoryObj } from "@storybook/vue3";
import MtButton from "@/components/form/mt-button/mt-button.vue";

export type MtTooltipMeta = SlottedMeta<typeof MtTooltip, "default">;

export default {
  title: "Components/Overlay/mt-tooltip",
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

export const Default: MtTooltipStory = {};
