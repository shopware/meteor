import meta, {
  Categories,
  Fluid,
  Formats,
  Sizes,
  Variants,
  type MtFileIconMeta,
  type MtFileIconStory,
} from "./mt-file-icon.stories";

export default {
  ...meta,
  title: "Components/File Icon/Interaction tests",
  tags: ["!autodocs"],
} as MtFileIconMeta;

export const VisualTestVariants: MtFileIconStory = {
  ...Variants,
  name: "Render variants",
};

export const VisualTestCategories: MtFileIconStory = {
  ...Categories,
  name: "Render categories",
};

export const VisualTestFormats: MtFileIconStory = {
  ...Formats,
  name: "Render formats",
};

export const VisualTestFormatsDark: MtFileIconStory = {
  ...Formats,
  name: "Render formats in dark mode",
  globals: { theme: "dark" },
};

export const VisualTestSizes: MtFileIconStory = {
  ...Sizes,
  name: "Render sizes",
};

export const VisualTestFluid: MtFileIconStory = {
  ...Fluid,
  name: "Render fluid sizes",
};

export const VisualTestLongFormats: MtFileIconStory = {
  name: "Render long formats",
  render: () => ({
    components: { MtFileIcon: meta.component! },
    setup() {
      return { formats: ["pptx", "webm", "woff2", "numbers", "sketch"] };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <mt-file-icon v-for="format in formats" :key="format" :format="format" />
        <mt-file-icon v-for="format in formats" :key="format + '-large'" :format="format" :size="96" />
      </div>`,
  }),
};
