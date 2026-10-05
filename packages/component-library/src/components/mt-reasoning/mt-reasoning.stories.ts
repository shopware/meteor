import type { Meta, StoryObj } from "@storybook/vue3";
import MtReasoning from "./mt-reasoning.vue";
import MtReasoningContent from "./mt-reasoning-content.vue";
import MtReasoningTrigger from "./mt-reasoning-trigger.vue";

export type MtReasoningMeta = Meta<typeof MtReasoning>;

const meta: MtReasoningMeta = {
  title: "Components/Reasoning",
  component: MtReasoning,
  args: {
    duration: 4,
    open: true,
  },
  render: (args) => ({
    components: { MtReasoning, MtReasoningTrigger, MtReasoningContent },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 32rem">
        <mt-reasoning v-bind="args">
          <mt-reasoning-trigger />
          <mt-reasoning-content
            content="The merchant wants the **five most expensive** products. I can search the catalog sorted by price, descending, limited to five."
          />
        </mt-reasoning>
      </div>
    `,
  }),
};

export default meta;
export type MtReasoningStory = StoryObj<MtReasoningMeta>;

export const Default: MtReasoningStory = {};

export const Collapsed: MtReasoningStory = {
  args: { open: false },
};
