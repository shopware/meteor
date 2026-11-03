import type { Meta, StoryObj } from "@storybook/vue3";
import MtExtensionIcon from "./mt-extension-icon.vue";

export type MtExtensionIconMeta = Meta<typeof MtExtensionIcon>;

const sizes = [16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96] as const;

const meta: MtExtensionIconMeta = {
  title: "Components/Extension Icon",
  component: MtExtensionIcon,
  args: {
    src: "/extension-icon-example.svg",
    alt: "Example extension",
    size: 40,
  },
  argTypes: {
    src: {
      control: { type: "text" },
    },
    alt: {
      control: { type: "text" },
    },
    size: {
      control: { type: "select" },
      options: sizes,
    },
  },
  render: (args) => ({
    components: { MtExtensionIcon },
    setup() {
      return { args };
    },
    template: `<mt-extension-icon :src="args.src" :alt="args.alt" :size="args.size" />`,
  }),
};

export default meta;
export type MtExtensionIconStory = StoryObj<MtExtensionIconMeta>;

export const Default: MtExtensionIconStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-extension-icon src="/my-extension-icon.png" alt="My extension" />`,
      },
    },
  },
};

export const AllSizes: MtExtensionIconStory = {
  name: "Sizes",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: sizes
          .map((size) => `<mt-extension-icon :size="${size}" src="/my-extension-icon.png" />`)
          .join("\n"),
      },
    },
  },
  render: () => ({
    components: { MtExtensionIcon },
    setup() {
      return { src: "/extension-icon-example.svg", sizes };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center;">
        <mt-extension-icon v-for="size in sizes" :key="size" :size="size" :src="src" />
      </div>`,
  }),
};

export const Placeholder: MtExtensionIconStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-extension-icon :size="16" alt="My extension" />
<mt-extension-icon :size="40" alt="My extension" />
<mt-extension-icon :size="96" alt="My extension" />`,
      },
    },
  },
  render: () => ({
    components: { MtExtensionIcon },
    template: `
      <div style="display: flex; gap: 12px; align-items: center;">
        <mt-extension-icon :size="16" alt="Example extension" />
        <mt-extension-icon :size="40" alt="Example extension" />
        <mt-extension-icon :size="96" alt="Example extension" />
      </div>`,
  }),
};
