import type { Meta, StoryObj } from "@storybook/vue3";
import MtConversation from "./mt-conversation.vue";
import MtMessage from "../mt-message/mt-message.vue";
import MtText from "../mt-text/mt-text.vue";
import MtTextShimmer from "../mt-text-shimmer/mt-text-shimmer.vue";

export type MtConversationMeta = Meta<typeof MtConversation>;

const meta: MtConversationMeta = {
  title: "Components/Conversation",
  component: MtConversation,
  render: (args) => ({
    components: { MtConversation, MtMessage, MtText, MtTextShimmer },
    setup: () => ({ args }),
    template: `
      <mt-conversation v-bind="args" style="height: 24rem">
        <mt-message from="user">
          <mt-text size="xs">Which products are low on stock?</mt-text>
        </mt-message>
        <mt-message from="assistant">
          <mt-text size="xs">Three products have fewer than five items left: the desk lamp, the oak shelf and the linen cushion.</mt-text>
        </mt-message>
        <mt-message from="user">
          <mt-text size="xs">Draft a reorder for them.</mt-text>
        </mt-message>

        <template #status>
          <mt-text-shimmer size="xs">Generating response…</mt-text-shimmer>
        </template>
      </mt-conversation>
    `,
  }),
};

export default meta;
export type MtConversationStory = StoryObj<MtConversationMeta>;

export const Default: MtConversationStory = {};
