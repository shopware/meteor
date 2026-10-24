import type { Meta, StoryObj } from "@storybook/vue3";
import MtContentHeader from "./mt-content-header.vue";
import MtButton from "../mt-button/mt-button.vue";
import MtText from "../mt-text/mt-text.vue";

export type MtContentHeaderMeta = Meta<typeof MtContentHeader>;

const meta: MtContentHeaderMeta = {
  title: "Components/Content Header",
  component: MtContentHeader,
  parameters: {
    docs: {
      description: {
        component: "**Experimental.** The API may still change in a future release.",
      },
    },
  },
  args: {
    title: "Running shoes",
  },
  render: (args) => ({
    components: { MtContentHeader, MtButton, MtText },
    setup: () => ({ args }),
    template: `
      <mt-content-header :title="args.title">
        <template #actions>
          <mt-button variant="secondary" size="default">Duplicate</mt-button>
        </template>

        <mt-text size="xs" color="color-text-secondary-default">SW10001 · In stock</mt-text>
      </mt-content-header>`,
  }),
};

export default meta;
export type MtContentHeaderStory = StoryObj<MtContentHeaderMeta>;

export const Default: MtContentHeaderStory = {};
