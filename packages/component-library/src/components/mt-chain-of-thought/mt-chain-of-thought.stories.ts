import type { Meta, StoryObj } from "@storybook/vue3";
import MtChainOfThought from "./mt-chain-of-thought.vue";
import MtChainOfThoughtContent from "./mt-chain-of-thought-content.vue";
import MtChainOfThoughtHeader from "./mt-chain-of-thought-header.vue";
import MtChainOfThoughtStep from "./mt-chain-of-thought-step.vue";

export type MtChainOfThoughtMeta = Meta<typeof MtChainOfThought>;

const meta: MtChainOfThoughtMeta = {
  title: "Components/Chain of Thought",
  component: MtChainOfThought,
  render: (args) => ({
    components: {
      MtChainOfThought,
      MtChainOfThoughtHeader,
      MtChainOfThoughtContent,
      MtChainOfThoughtStep,
    },
    setup: () => ({ args }),
    template: `
      <mt-chain-of-thought v-bind="args">
        <mt-chain-of-thought-header>Working on it</mt-chain-of-thought-header>
        <mt-chain-of-thought-content>
          <mt-chain-of-thought-step
            label="Thought for 2 seconds"
            description="The merchant asks for products that run out soon."
          />
          <mt-chain-of-thought-step label="Found 12 products" />
          <mt-chain-of-thought-step label="Reading Products…" status="active" />
          <mt-chain-of-thought-step label="Write the answer" status="pending" />
        </mt-chain-of-thought-content>
      </mt-chain-of-thought>
    `,
  }),
};

export default meta;
export type MtChainOfThoughtStory = StoryObj<MtChainOfThoughtMeta>;

export const Default: MtChainOfThoughtStory = {
  args: { defaultOpen: true },
};

export const Closed: MtChainOfThoughtStory = {};
