import type { Meta, StoryObj } from "@storybook/vue3";
import MtContentLayout from "./mt-content-layout.vue";
import MtCard from "../mt-card/mt-card.vue";
import MtText from "../mt-text/mt-text.vue";

export type MtContentLayoutMeta = Meta<typeof MtContentLayout>;

const meta: MtContentLayoutMeta = {
  title: "Components/Content Layout",
  component: MtContentLayout,
  parameters: {
    docs: {
      description: {
        component: "**Experimental.** The API may still change in a future release.",
      },
    },
  },
  render: (args) => ({
    components: { MtContentLayout, MtCard, MtText },
    setup: () => ({ args }),
    template: `
      <mt-content-layout>
        <mt-card title="General">
          <mt-text size="xs">The main content.</mt-text>
        </mt-card>

        <template #end>
          <mt-card title="Status">
            <mt-text size="xs">A sidebar after the content.</mt-text>
          </mt-card>
        </template>
      </mt-content-layout>`,
  }),
};

export default meta;
export type MtContentLayoutStory = StoryObj<MtContentLayoutMeta>;

export const Default: MtContentLayoutStory = {};
