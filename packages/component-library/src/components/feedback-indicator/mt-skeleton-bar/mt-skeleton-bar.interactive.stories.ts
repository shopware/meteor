import MtSkeletonBar from "./mt-skeleton-bar.vue";
import type { MtSkeletonBarStory, MtSkeletonBarMeta } from "./mt-skeleton-bar.stories";

import meta from "./mt-skeleton-bar.stories";

export default {
  ...meta,
  title: "Components/Skeleton Bar/Interaction tests",
  tags: ["!autodocs"],
  component: MtSkeletonBar,
} as MtSkeletonBarMeta;

export const VisualTestSkeletonBar: MtSkeletonBarStory = {
  name: "Render the skeleton bar",
};
