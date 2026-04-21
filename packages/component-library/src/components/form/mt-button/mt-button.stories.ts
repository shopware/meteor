import type { StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import { fn } from "@storybook/test";
import MtButton from "./mt-button.vue";
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
import type { SlottedMeta } from "@/_internal/story-helper";

export type MtButtonMeta = SlottedMeta<typeof MtButton, "default" | "click">;

export default {
  title: "Components/mt-button",
  component: MtButton,
  args: {
    default: "Button",
    variant: "primary",
    size: "small",
    disabled: false,
    square: false,
    block: false,
    isLoading: false,
    ghost: false,
    link: undefined,
    click: fn(action("click")),
  },
  argTypes: {
    showFrontIcon: {
      control: "boolean",
      description: "Show/hide front icon",
      defaultValue: false,
    },
    showBackIcon: {
      control: "boolean",
      description: "Show/hide back icon",
      defaultValue: false,
    },
  },
  render: (args) => ({
    components: { MtButton, MtIcon },
    setup() {
      return {
        args,
      };
    },
    template: `<mt-button @click="args.click" v-bind="args">
     <template v-if="args.showFrontIcon" #iconFront="slotProps">
          <mt-icon
            name="regular-plus-xs"
            :size="slotProps.size"
          />
        </template>
        {{ args.default}}
        <template v-if="args.showBackIcon" #iconBack="slotProps">
          <mt-icon
            name="regular-plus-xs"
            :size="slotProps.size"
          />
        </template>
     </mt-button>`,
  }),
} as MtButtonMeta;

export type MtButtonStory = StoryObj<MtButtonMeta>;

export const Default: MtButtonStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-button variant="primary" size="small">
  Button
</mt-button>`,
      },
    },
  },
};

export const AllVariants: MtButtonStory = {
  name: "Variants",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-button variant="primary">Primary</mt-button>
<mt-button variant="secondary">Secondary</mt-button>
<mt-button variant="tertiary">Tertiary</mt-button>
<mt-button variant="critical">Critical</mt-button>`,
      },
    },
  },
  render: () => ({
    components: { MtButton },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <mt-button variant="primary">Primary</mt-button>
        <mt-button variant="secondary">Secondary</mt-button>
        <mt-button variant="tertiary">Tertiary</mt-button>
        <mt-button variant="critical">Critical</mt-button>
      </div>`,
  }),
};

export const AllSizes: MtButtonStory = {
  name: "Sizes",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-button size="x-small">X-Small</mt-button>
<mt-button size="small">Small</mt-button>
<mt-button size="default">Default</mt-button>
<mt-button size="large">Large</mt-button>`,
      },
    },
  },
  render: () => ({
    components: { MtButton },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <mt-button size="x-small">X-Small</mt-button>
        <mt-button size="small">Small</mt-button>
        <mt-button size="default">Default</mt-button>
        <mt-button size="large">Large</mt-button>
      </div>`,
  }),
};

export const WithIcon: MtButtonStory = {
  name: "With icon",
  args: {
    default: "Add item",
    variant: "secondary",
    showFrontIcon: true,
  },
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-button variant="secondary">
  <template #iconFront="{ size }">
    <mt-icon name="regular-plus-xs" :size="size" />
  </template>
  Add item
</mt-button>`,
      },
    },
  },
};

export const IconOnly: MtButtonStory = {
  name: "Icon only",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-button variant="secondary" :square="true" aria-label="Add item">
  <template #iconFront="{ size }">
    <mt-icon name="regular-plus-xs" :size="size" />
  </template>
</mt-button>`,
      },
    },
  },
  render: () => ({
    components: { MtButton, MtIcon },
    template: `
      <mt-button variant="secondary" :square="true" aria-label="Add item">
        <template #iconFront="{ size }">
          <mt-icon name="regular-plus-xs" :size="size" />
        </template>
      </mt-button>`,
  }),
};

export const States: MtButtonStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-button>Default</mt-button>
<mt-button :disabled="true">Disabled</mt-button>
<mt-button :is-loading="true">Loading</mt-button>`,
      },
    },
  },
  render: () => ({
    components: { MtButton },
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <mt-button>Default</mt-button>
        <mt-button :disabled="true">Disabled</mt-button>
        <mt-button :is-loading="true">Loading</mt-button>
      </div>`,
  }),
};
