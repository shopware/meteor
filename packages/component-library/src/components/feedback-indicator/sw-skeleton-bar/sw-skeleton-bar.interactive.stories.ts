import SwSkeletonBar from "./sw-skeleton-bar.vue";
import type { SwSkeletonBarStory, SwSkeletonBarMeta } from "./sw-skeleton-bar.stories";

import meta from "./sw-skeleton-bar.stories";

export default {
  ...meta,
  title: "Interaction Tests/Feedback Indicator/sw-skeleton-bar",
  component: SwSkeletonBar,
} as SwSkeletonBarMeta;

export const VisualTestSkeletonBar: SwSkeletonBarStory = {
  name: "Render the skeleton bar",
};
