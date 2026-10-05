import type { Meta, StoryObj } from "@storybook/vue3";
import MtTool from "./mt-tool.vue";
import MtToolContent from "./mt-tool-content.vue";
import MtToolHeader from "./mt-tool-header.vue";
import MtToolInput from "./mt-tool-input.vue";
import MtToolOutput from "./mt-tool-output.vue";

export type MtToolMeta = Meta<typeof MtToolHeader>;

const meta: MtToolMeta = {
  title: "Components/Tool",
  component: MtToolHeader,
  args: {
    type: "tool-searchProducts",
    state: "output-available",
    title: "Search products",
  },
  render: (args) => ({
    components: { MtTool, MtToolHeader, MtToolContent, MtToolInput, MtToolOutput },
    setup: () => ({ args }),
    template: `
      <div style="max-width: 32rem">
        <mt-tool default-open>
          <mt-tool-header v-bind="args" />
          <mt-tool-content>
            <mt-tool-input :input="{ query: 'lamp', sortBy: 'price', limit: 5 }" />
            <mt-tool-output
              :output="args.state === 'output-available' ? { count: 2, products: [{ sku: 'SW-1000', name: 'Aurora desk lamp' }] } : undefined"
              :error-text="args.state === 'output-error' ? 'The catalog is not available.' : undefined"
            />
          </mt-tool-content>
        </mt-tool>
      </div>
    `,
  }),
};

export default meta;
export type MtToolStory = StoryObj<MtToolMeta>;

export const Default: MtToolStory = {};

export const Running: MtToolStory = {
  args: { state: "input-available" },
};

export const OutputError: MtToolStory = {
  args: { state: "output-error" },
};
