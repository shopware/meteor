import type { StoryObj } from "@storybook/vue3";
import MtFloatingUi, { type MtFloatingUiProps } from "./mt-floating-ui.vue";
import MtButton from "../../form/mt-button/mt-button.vue";
import MtNumberField from "../../form/mt-number-field/mt-number-field.vue";
import { ref } from "vue";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtFloatingUiMeta = SlottedMeta<typeof MtFloatingUi, "default" | "trigger" | "close">;

const meta: MtFloatingUiMeta = {
  title: "Components/mt-floating-ui",
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
      MtNumberField,
    },
    setup() {
      const isOpened = ref(false);
      const width = ref("120");
      const height = ref("120");
      const toggleFloatingUi = () => {
        isOpened.value = !isOpened.value;
      };

      return {
        args,
        isOpened,
        width,
        height,
        toggleFloatingUi,
      };
    },
    template: `
      <div>
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

          <div style="padding: 16px; width: 320px; border-radius: var(--border-radius-m, 8px);
border: 1px solid var(--color-border-secondary-default, #E2E3E9);
background: var(--color-elevation-surface-raised, #FFF);
box-shadow: 0 6px 24px -8px var(--color-elevation-shadow-default, rgba(16, 16, 19, 0.10));">
            <strong style="display: block; margin-bottom: 10px;">Adjust size</strong>
            <div style="display: flex; gap: 12px; margin-bottom: 10px;">
              <mt-number-field
                v-model="width"
                label="Width"
                size="small"
                number-type="int"
              />
              <mt-number-field
                v-model="height"
                label="Height"
                size="small"
                number-type="int"
              />
            </div>
            <mt-button size="small" variant="primary">Apply</mt-button>
          </div>
        </mt-floating-ui>
      </div>
    `,
  }),
};

export default meta;

export type MtFloatingUiStory = StoryObj<MtFloatingUiMeta>;

export const Default: MtFloatingUiStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-floating-ui
  :is-opened="isOpened"
  :show-arrow="true"
  :offset="6"
  @close="isOpened = false"
>
  <template #trigger>
    <mt-button variant="secondary" @click="isOpened = !isOpened">
      Toggle floating UI
    </mt-button>
  </template>

  <div class="custom-floating-surface">
    Custom popover-style content
  </div>
</mt-floating-ui>`,
      },
    },
  },
};
