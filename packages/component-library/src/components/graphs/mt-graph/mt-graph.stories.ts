import type { StoryObj } from "@storybook/vue3";
import MtGraph from "./mt-graph.vue";
import { type SlottedMeta } from "@/_internal/story-helper";

export type MtGraphMeta = SlottedMeta<typeof MtGraph, "default" | "click">;

export default {
  title: "Components/Graphs/mt-graph",
  component: MtGraph,
  args: {
    type: "area",
    series: [
      {
        name: "Sample Data",
        data: [30, 55, 65, 60, 45, 40, 55, 80],
      },
    ],
    width: "100%",
    height: 300,
  },
  render: (args) => ({
    components: { MtGraph },
    setup: () => ({ args }),
    template: `<mt-graph v-bind="args" />`,
  }),
} as MtGraphMeta;

export type MtGraphStory = StoryObj<MtGraphMeta>;

export const DefaultStory: MtGraphStory = {
  name: "mt-graph",
};
