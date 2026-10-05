import type { Meta, StoryObj } from "@storybook/vue3";
import MtMessage from "./mt-message.vue";
import MtText from "../mt-text/mt-text.vue";

export type MtMessageMeta = Meta<typeof MtMessage>;

const meta: MtMessageMeta = {
  title: "Components/Message",
  component: MtMessage,
  args: {
    from: "user",
  },
  render: (args) => ({
    components: { MtMessage, MtText },
    setup: () => ({ args }),
    template: `
      <mt-message v-bind="args">
        <mt-text size="xs">Which products are low on stock?</mt-text>
      </mt-message>
    `,
  }),
};

export default meta;
export type MtMessageStory = StoryObj<MtMessageMeta>;

export const Default: MtMessageStory = {};
