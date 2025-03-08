import type { SlottedMeta } from "@/_internal/story-helper";
import type { StoryObj } from "@storybook/vue3";
import MtVerticalStack from "./mt-vertical-stack.vue";

type MtStackMeta = SlottedMeta<typeof MtVerticalStack, "default">;

export default {
  title: "Components/Layout/mt-vertical-stack",
  component: MtVerticalStack,
  render(args) {
    return {
      setup: () => ({ args }),
      components: { MtVerticalStack },
      template: `
<mt-vertical-stack v-bind="args">
    <div>1</div>
    <div>2</div>
    <div>3</div>
</mt-vertical-stack>`,
    };
  },
  args: {
    size: "32px",
  },
} satisfies MtStackMeta;

export const Default: StoryObj<typeof MtVerticalStack> = {};

export const WithToken: StoryObj<typeof MtVerticalStack> = {
  args: {
    size: "scale-size-24",
  },
};
