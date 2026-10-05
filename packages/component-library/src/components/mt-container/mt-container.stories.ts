import type { Meta, StoryObj } from "@storybook/vue3";
import MtContainer from "./mt-container.vue";

export type MtContainerMeta = Meta<typeof MtContainer>;

const demoContent = `
<div style="padding: var(--scale-size-16); background-color: var(--color-elevation-surface-hover); border-radius: var(--border-radius-xs); font-size: var(--font-size-xs);">
  Container content
</div>`;

const createStory = (template: string) => ({
  render: (args: Record<string, unknown>) => ({
    components: { MtContainer },
    setup: () => ({ args }),
    template,
  }),
  parameters: {
    docs: {
      source: {
        code: template.trim(),
      },
    },
  },
});

const meta: MtContainerMeta = {
  title: "Components/Container",
  component: MtContainer,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    size: "m",
    as: "div",
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["s", "m", "l"],
      description: "The maximum width: `s` (680px), `m` (960px) or `l` (1280px).",
    },
    as: {
      control: { type: "text" },
      description: "The element or component that renders the container.",
    },
  },
};

export default meta;
export type MtContainerStory = StoryObj<MtContainerMeta>;

export const Default: MtContainerStory = {
  ...createStory(`<mt-container v-bind="args">${demoContent}</mt-container>`),
};

export const Sizes: MtContainerStory = {
  ...createStory(`
<div style="display: grid; gap: var(--scale-size-16); padding: var(--scale-size-16);">
  <mt-container size="s">${demoContent}</mt-container>
  <mt-container size="m">${demoContent}</mt-container>
  <mt-container size="l">${demoContent}</mt-container>
</div>`),
};
