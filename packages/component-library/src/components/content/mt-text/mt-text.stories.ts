import type { SlottedMeta } from "@/_internal/story-helper";
import MtText from "./mt-text.vue";
import type { StoryObj } from "@storybook/vue3";

type MtTextSlots = "default";

export type MtTextMeta = SlottedMeta<typeof MtText, MtTextSlots>;

export default {
  title: "Components/Content/mt-text",
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

export const DefaultStory: StoryObj<MtTextMeta> = {};
