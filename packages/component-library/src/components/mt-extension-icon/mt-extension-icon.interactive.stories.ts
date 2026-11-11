import meta, {
  type MtExtensionIconMeta,
  type MtExtensionIconStory,
} from "./mt-extension-icon.stories";

export default {
  ...meta,
  title: "Components/Extension Icon/Interaction tests",
  tags: ["!autodocs"],
} as MtExtensionIconMeta;

export const VisualTestImage: MtExtensionIconStory = {
  name: "Render image",
  args: {
    size: 96,
  },
};

export const VisualTestPlaceholder: MtExtensionIconStory = {
  name: "Render placeholder",
  args: {
    src: undefined,
    size: 96,
  },
};
