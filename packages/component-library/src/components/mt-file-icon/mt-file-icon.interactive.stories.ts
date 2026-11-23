import meta, {
  Categories,
  Fluid,
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

// A fixed set with every label color, so adding a format does not change the snapshots
export const VisualTestFormats: MtFileIconStory = {
  name: "Render formats",
  render: () => ({
    components: { MtFileIcon: meta.component! },
    setup() {
      return { formats: ["txt", "pdf", "doc", "docx", "xls", "xlsx", "mov", "zip", "rar"] };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <mt-file-icon v-for="format in formats" :key="format" :format="format" />
      </div>`,
  }),
};

export const VisualTestFormatsDark: MtFileIconStory = {
  ...VisualTestFormats,
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
