import meta, { type MtSearchMeta, type MtSearchStory } from "./mt-search.stories";

export default {
  ...meta,
  title: "Interaction Tests/Navigation/mt-search",
} as MtSearchMeta;

export const VisualTestDefaultSize: MtSearchStory = {
  name: "Render the default sized search",
  args: {
    size: "default",
  },
};

export const VisualTestSmallSize: MtSearchStory = {
  name: "Render the small sized search",
  args: {
    size: "small",
  },
};

export const VisualTestDefaultSizeDisabled: MtSearchStory = {
  name: "Render the default sized search disabled",
  args: {
    size: "default",
    disabled: true,
  },
};

export const VisualTestSmallSizeDisabled: MtSearchStory = {
  name: "Render the small sized search disabled",
  args: {
    size: "small",
    disabled: true,
  },
};
