import type { Meta, StoryObj } from "@storybook/vue3";
import MtLayout from "./mt-layout.vue";
import MtCard from "../mt-card/mt-card.vue";
import MtText from "../mt-text/mt-text.vue";

export type MtLayoutMeta = Meta<typeof MtLayout>;

const meta: MtLayoutMeta = {
  title: "Components/Layout",
  component: MtLayout,
  parameters: {
    docs: {
      description: {
        component: "**Experimental.** The API may still change in a future release.",
      },
    },
  },
  render: (args) => ({
    components: { MtLayout, MtCard, MtText },
    setup: () => ({ args }),
    template: `
      <mt-layout>
        <mt-card title="General">
          <mt-text size="xs">The main content.</mt-text>
        </mt-card>

        <template #end>
          <mt-card title="Status">
            <mt-text size="xs">A sidebar after the content.</mt-text>
          </mt-card>
        </template>
      </mt-layout>`,
  }),
};

export default meta;
export type MtLayoutStory = StoryObj<MtLayoutMeta>;

export const Default: MtLayoutStory = {};
