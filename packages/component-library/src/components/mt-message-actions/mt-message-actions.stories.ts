import type { Meta, StoryObj } from "@storybook/vue3";
import MtMessageAction from "./mt-message-action.vue";
import MtMessageActions from "./mt-message-actions.vue";

export type MtMessageActionsMeta = Meta<typeof MtMessageActions>;

const meta: MtMessageActionsMeta = {
  title: "Components/Message Actions",
  component: MtMessageActions,
  render: () => ({
    components: { MtMessageActions, MtMessageAction },
    template: `
      <mt-message-actions>
        <mt-message-action label="Copy" icon="regular-copy" />
        <mt-message-action label="Retry" icon="regular-redo" />
        <mt-message-action label="Good answer" icon="regular-thumbs-up" aria-pressed="false" />
        <mt-message-action label="Bad answer" icon="regular-thumbs-down" aria-pressed="false" />
      </mt-message-actions>
    `,
  }),
};

export default meta;
export type MtMessageActionsStory = StoryObj<MtMessageActionsMeta>;

export const Default: MtMessageActionsStory = {};
