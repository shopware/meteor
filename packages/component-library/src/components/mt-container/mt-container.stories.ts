import type { Meta, StoryObj } from "@storybook/vue3";
import MtContainer from "./mt-container.vue";
import MtText from "../mt-text/mt-text.vue";

export type MtContainerMeta = Meta<typeof MtContainer>;

const meta: MtContainerMeta = {
  title: "Components/Container",
  component: MtContainer,
  parameters: {
    docs: {
      description: {
        component: "**Experimental.** The API may still change in a future release.",
      },
    },
  },
  args: {
    width: "m",
    as: "div",
  },
  argTypes: {
    width: {
      control: { type: "select" },
      options: ["s", "m", "l"],
    },
  },
  render: (args) => ({
    components: { MtContainer, MtText },
    setup: () => ({ args }),
    template: `
      <mt-container :width="args.width" :as="args.as">
        <mt-text size="xs">The content is limited to the maximum width and centered.</mt-text>
      </mt-container>`,
  }),
};

export default meta;
export type MtContainerStory = StoryObj<MtContainerMeta>;

export const Default: MtContainerStory = {};
