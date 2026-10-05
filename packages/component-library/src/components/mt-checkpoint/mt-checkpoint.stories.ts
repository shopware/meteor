import type { Meta, StoryObj } from "@storybook/vue3";
import MtCheckpoint from "./mt-checkpoint.vue";
import MtCheckpointIcon from "./mt-checkpoint-icon.vue";
import MtCheckpointTrigger from "./mt-checkpoint-trigger.vue";

export type MtCheckpointMeta = Meta<typeof MtCheckpoint>;

const meta: MtCheckpointMeta = {
  title: "Components/Checkpoint",
  component: MtCheckpoint,
  render: () => ({
    components: { MtCheckpoint, MtCheckpointIcon, MtCheckpointTrigger },
    template: `
      <div style="display: grid; gap: 1rem; max-width: 32rem">
        <mt-checkpoint>
          <mt-checkpoint-icon icon="regular-sync" />
          Switched to GPT-6 Luna
        </mt-checkpoint>
        <mt-checkpoint>
          <mt-checkpoint-icon />
          Before the stock changes
          <mt-checkpoint-trigger>Restore</mt-checkpoint-trigger>
        </mt-checkpoint>
      </div>
    `,
  }),
};

export default meta;
export type MtCheckpointStory = StoryObj<MtCheckpointMeta>;

export const Default: MtCheckpointStory = {};
