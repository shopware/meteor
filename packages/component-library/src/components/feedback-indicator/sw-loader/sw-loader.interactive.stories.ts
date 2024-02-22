import meta, { type SwLoaderMeta, type SwLoaderStory } from "./sw-loader.stories";

export default {
  ...meta,
  title: "Interaction Tests/Feedback Indicator/sw-loader",
} as SwLoaderMeta;

export const VisualTestLoaderAt50: SwLoaderStory = {
  name: "Render loader with 50px",
  args: {
    size: "50px",
  },
};

export const VisualTestLoaderAt90: SwLoaderStory = {
  name: "Render loader with 90px",
  args: {
    size: "90px",
  },
};

export const VisualTestLoaderAt7: SwLoaderStory = {
  name: "Render loader with 7px",
  args: {
    size: "7px",
  },
};
