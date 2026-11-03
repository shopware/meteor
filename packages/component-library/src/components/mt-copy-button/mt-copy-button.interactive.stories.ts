import meta, {
  type MtCopyButtonMeta,
  type MtCopyButtonStory,
  Sizes,
  Variants,
} from "./mt-copy-button.stories";

export default {
  ...meta,
  title: "Components/Copy Button/Interaction tests",
  tags: ["!autodocs"],
} as MtCopyButtonMeta;

export const VisualTestVariants: MtCopyButtonStory = {
  name: "Render variants",
  render: Variants.render,
};

export const VisualTestSizes: MtCopyButtonStory = {
  name: "Render sizes",
  render: Sizes.render,
};
