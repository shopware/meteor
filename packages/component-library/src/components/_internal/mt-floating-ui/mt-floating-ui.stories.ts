import type { StoryObj } from "@storybook/vue3";
import MtFloatingUi, { type MtFloatingUiProps } from "./mt-floating-ui.vue";
import MtButton from "../../form/mt-button/mt-button.vue";
import MtCard from "../../layout/mt-card/mt-card.vue";
import { ref } from "vue";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtFloatingUiMeta = SlottedMeta<typeof MtFloatingUi, "default" | "trigger" | "close">;

export default {
  title: "Components/Overlay/mt-floating-ui",
  component: MtFloatingUi,
  args: {
    showArrow: true,
    offset: 6,
    matchReferenceWidth: false,
  },
  render: (args: MtFloatingUiProps) => ({
    components: {
      MtFloatingUi,
      MtButton,
      MtCard,
    },
    setup() {
      const isOpened = ref(false);
      const toggleFloatingUi = () => {
        isOpened.value = !isOpened.value;
      };

      return {
        args,
        isOpened,
        toggleFloatingUi,
      };
    },
    template: `
      <div style="padding: 80px">
        <mt-floating-ui
          v-bind="args"
          :is-opened="isOpened"
          @close="isOpened = false"
        >
          <template #trigger>
            <mt-button variant="secondary" @click="toggleFloatingUi">
              Toggle floating UI
            </mt-button>
          </template>

          <mt-card style="padding: 16px; max-width: 320px;">
            <strong style="display: block; margin-bottom: 8px;">Bulk actions</strong>
            <p style="margin: 0 0 12px; line-height: 1.4;">
              Use this floating panel to apply actions to selected products.
            </p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <mt-button size="small" variant="secondary">Mark as active</mt-button>
              <mt-button size="small" variant="secondary">Add tags</mt-button>
              <mt-button size="small" variant="critical">Archive</mt-button>
            </div>
          </mt-card>
        </mt-floating-ui>
      </div>
    `,
  }),
} as MtFloatingUiMeta;

export type MtFloatingUiStory = StoryObj<MtFloatingUiMeta>;

export const DefaultStory: MtFloatingUiStory = {
  name: "mt-floating-ui",
};
