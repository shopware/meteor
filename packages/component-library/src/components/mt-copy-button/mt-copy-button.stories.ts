import type { Meta, StoryObj } from "@storybook/vue3";
import { action } from "@storybook/addon-actions";
import MtCopyButton from "./mt-copy-button.vue";

export type MtCopyButtonMeta = Meta<typeof MtCopyButton>;

const variants = ["primary", "secondary", "tertiary", "critical"] as const;
const sizes = ["xs", "s", "m", "l"] as const;

const meta: MtCopyButtonMeta = {
  title: "Components/Copy Button",
  component: MtCopyButton,
  args: {
    value: "SW-10001",
    label: "Copy order number",
    variant: "secondary",
    size: "s",
    disabled: false,
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: variants,
    },
    size: {
      control: { type: "select" },
      options: sizes,
    },
  },
  render: (args) => ({
    components: { MtCopyButton },
    setup() {
      return { args, onCopy: action("copy"), onError: action("error") };
    },
    template: `<mt-copy-button v-bind="args" @copy="onCopy" @error="onError" />`,
  }),
};

export default meta;
export type MtCopyButtonStory = StoryObj<MtCopyButtonMeta>;

export const Default: MtCopyButtonStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-copy-button value="SW-10001" label="Copy order number" />`,
      },
    },
  },
};

export const Variants: MtCopyButtonStory = {
  render: () => ({
    components: { MtCopyButton },
    setup() {
      return { variants };
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <mt-copy-button v-for="variant in variants" :key="variant" value="SW-10001" :variant="variant" />
      </div>`,
  }),
};

export const Sizes: MtCopyButtonStory = {
  render: () => ({
    components: { MtCopyButton },
    setup() {
      return { sizes };
    },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <mt-copy-button v-for="size in sizes" :key="size" value="SW-10001" :size="size" />
      </div>`,
  }),
};
