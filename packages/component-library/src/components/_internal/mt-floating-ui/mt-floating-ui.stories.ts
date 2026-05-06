import type { StoryObj } from "@storybook/vue3";
import MtFloatingUi, { type MtFloatingUiProps } from "./mt-floating-ui.vue";
import MtButton from "../../form/mt-button/mt-button.vue";
import MtNumberField from "../../form/mt-number-field/mt-number-field.vue";
import { ref } from "vue";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtFloatingUiMeta = SlottedMeta<typeof MtFloatingUi, "default" | "trigger" | "close">;

const meta: MtFloatingUiMeta = {
  title: "Components/Floating UI",
  component: MtFloatingUi,
  args: {
    showArrow: true,
    offset: 6,
    matchReferenceWidth: false,
    detached: false,
  },
  argTypes: {
    detached: {
      description:
        "Omits the trigger slot and uses `display: contents` on the root. Use with `anchorElement` for external anchors.",
    },
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

export const MultipleAnchors: MtFloatingUiStory = {
  name: "Multiple anchors",
  args: {
    detached: true,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<div
  v-for="btn in buttons"
  :key="btn.label"
  @mouseenter="openFor($event, btn)"
  @mouseleave="scheduleClose"
>
  <mt-button variant="secondary">{{ btn.label }}</mt-button>
</div>

<mt-floating-ui
  :is-opened="isOpened"
  :anchor-element="anchorElement"
  detached
  @close="isOpened = false"
>
  <div @mouseenter="cancelClose" @mouseleave="scheduleClose">
    Popover for {{ activeLabel }}
  </div>
</mt-floating-ui>`,
      },
    },
  },
  render: (args: MtFloatingUiProps) => ({
    components: { MtFloatingUi, MtButton, MtNumberField },
    setup() {
      const isOpened = ref(false);
      const anchorElement = ref<HTMLElement | null>(null);
      const activeButton = ref<{ label: string; field1: string; field2: string } | null>(null);
      let closeTimer: ReturnType<typeof setTimeout> | null = null;

      const buttons = [
        { label: "Adjust size", field1: "Width", field2: "Height" },
        { label: "Adjust position", field1: "X offset", field2: "Y offset" },
        { label: "Adjust padding", field1: "Horizontal", field2: "Vertical" },
      ];

      const values = ref<Record<string, { v1: string; v2: string }>>({
        "Adjust size": { v1: "120", v2: "120" },
        "Adjust position": { v1: "0", v2: "0" },
        "Adjust padding": { v1: "16", v2: "16" },
      });

      const floatingUiOptions = { placement: "bottom" as const, ...args.floatingUiOptions };

      const openFor = (event: MouseEvent, btn: (typeof buttons)[0]) => {
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = null;
        }
        anchorElement.value = event.currentTarget as HTMLElement;
        activeButton.value = btn;
        isOpened.value = true;
      };

      const scheduleClose = () => {
        closeTimer = setTimeout(() => {
          isOpened.value = false;
        }, 200);
      };

      const cancelClose = () => {
        if (closeTimer) {
          clearTimeout(closeTimer);
          closeTimer = null;
        }
      };

      return {
        args,
        isOpened,
        anchorElement,
        activeButton,
        buttons,
        values,
        floatingUiOptions,
        openFor,
        scheduleClose,
        cancelClose,
      };
    },
    template: `
      <div style="padding: 32px 32px 32px 200px;">
        <div style="display: flex; gap: 12px;">
          <div
            v-for="btn in buttons"
            :key="btn.label"
            @mouseenter="openFor($event, btn)"
            @mouseleave="scheduleClose"
          >
            <mt-button variant="secondary">
              {{ btn.label }}
            </mt-button>
          </div>
        </div>

        <mt-floating-ui
          v-bind="args"
          :is-opened="isOpened"
          :anchor-element="anchorElement"
          :floating-ui-options="floatingUiOptions"
          @close="isOpened = false"
        >
          <div
            v-if="activeButton"
            style="padding: 16px; width: 320px; border-radius: var(--border-radius-m, 8px);
              border: 1px solid var(--color-border-secondary-default, #E2E3E9);
              background: var(--color-elevation-surface-raised, #FFF);
              box-shadow: 0 6px 24px -8px var(--color-elevation-shadow-default, rgba(16, 16, 19, 0.10));"
            @mouseenter="cancelClose"
            @mouseleave="scheduleClose"
          >
            <strong style="display: block; margin-bottom: 10px;">{{ activeButton.label }}</strong>
            <div style="display: flex; gap: 12px; margin-bottom: 10px;">
              <mt-number-field
                v-model="values[activeButton.label].v1"
                :label="activeButton.field1"
                size="small"
                number-type="int"
              />
              <mt-number-field
                v-model="values[activeButton.label].v2"
                :label="activeButton.field2"
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
