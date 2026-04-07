import type { SlottedMeta } from "@/_internal/story-helper";
import MtText from "./mt-text.vue";
import type { StoryObj } from "@storybook/vue3";

type MtTextSlots = "default";

export type MtTextMeta = SlottedMeta<typeof MtText, MtTextSlots>;

export default {
  title: "Components/mt-text",
  component: MtText,
  args: {
    default: "Text",
  },
  argTypes: {
    weight: {
      control: { type: "select" },
      options: ["regular", "medium", "semibold", "bold"],
    },
    size: {
      control: { type: "select" },
      options: ["2xs", "xs", "s", "m", "l", "xl", "2xl"],
    },
    color: {
      control: { type: "text" },
    },
  },
  render: (args) => ({
    components: { MtText },
    setup() {
      return { args };
    },
    template: `<mt-text v-bind="args">{{ args.default }}</mt-text>`,
  }),
} satisfies MtTextMeta;

export const Default: StoryObj<MtTextMeta> = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-text>
  Text
</mt-text>`,
      },
    },
  },
};

export const AllSizes: StoryObj<MtTextMeta> = {
  name: "Sizes",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<div style="display: grid; gap: 12px;">
  <mt-text size="2xs">2xs - Text</mt-text>
  <mt-text size="xs">xs - Text</mt-text>
  <mt-text size="s">s - Text</mt-text>
  <mt-text size="m">m - Text</mt-text>
  <mt-text size="l">l - Text</mt-text>
  <mt-text size="xl">xl - Text</mt-text>
  <mt-text size="2xl">2xl - Text</mt-text>
  <mt-text size="3xl">3xl - Text</mt-text>
</div>`,
      },
    },
  },
  render: (args) => ({
    components: { MtText },
    setup() {
      return {
        args,
        sizes: ["2xs", "xs", "s", "m", "l", "xl", "2xl", "3xl"],
      };
    },
    template: `
      <div style="display: grid; gap: 12px;">
        <mt-text
          v-for="size in sizes"
          :key="size"
          v-bind="args"
          :size="size"
        >
          {{ size }} - {{ args.default }}
        </mt-text>
      </div>
    `,
  }),
};
