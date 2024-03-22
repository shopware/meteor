import meta, { type MtLoaderMeta, type MtLoaderStory } from "./mt-loader.stories";

export default {
  ...meta,
  title: "Interaction Tests/Feedback Indicator/mt-loader",
} as MtLoaderMeta;

export const VisualTestLoaderAt50: MtLoaderStory = {
  name: "Render loader with 50px",
  args: {
    size: "50px",
  },
};

export const VisualTestLoaderAt90: MtLoaderStory = {
  name: "Render loader with 90px",
  args: {
    size: "90px",
  },
};

export const VisualTestLoaderAt7: MtLoaderStory = {
  name: "Render loader with 7px",
  args: {
    size: "7px",
  },
};
