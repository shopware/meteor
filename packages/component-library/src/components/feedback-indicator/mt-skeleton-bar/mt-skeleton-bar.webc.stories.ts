import type { StoryObj } from "@storybook/vue3";
import MtSkeletonBarWebComponent from "./mt-skeleton-bar.webc";

const meta = {
  title: "Components/Feedback Indicator/mt-skeleton-bar (Web Component)",
  component: MtSkeletonBarWebComponent,
  render: (args: any) => ({
    setup() {
      return {
        args,
      };
    },
    template: "<mt-skeleton-bar></mt-skeleton-bar>",
  }),
};

export default meta;
export type MtSkeletonBarWebComponentStory = StoryObj<typeof meta>;

export const Default: MtSkeletonBarWebComponentStory = {
  name: "mt-skeleton-bar (Web Component)",
};
