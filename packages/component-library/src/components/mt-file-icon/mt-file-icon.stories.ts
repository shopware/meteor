import type { Meta, StoryObj } from "@storybook/vue3";
import MtFileIcon from "./mt-file-icon.vue";
import { fileIconCategories } from "./mt-file-icon-formats";

export type MtFileIconMeta = Meta<typeof MtFileIcon>;

const sizes = [24, 32, 40, 48, 56, 64, 72, 80, 96] as const;
const formats = ["txt", "pdf", "doc", "docx", "xls", "xlsx", "mov", "zip", "rar"] as const;

const meta: MtFileIconMeta = {
  title: "Components/File Icon",
  component: MtFileIcon,
  args: {
    fileName: "invoice.pdf",
    mimeType: undefined,
    format: undefined,
    category: undefined,
    icon: undefined,
    showFormat: true,
    broken: false,
    size: 48,
    label: "PDF file",
  },
  argTypes: {
    fileName: { control: { type: "text" } },
    mimeType: { control: { type: "text" } },
    format: { control: { type: "text" } },
    category: {
      control: { type: "select" },
      options: [undefined, ...fileIconCategories],
    },
    icon: { control: { type: "text" } },
    showFormat: { control: { type: "boolean" } },
    broken: { control: { type: "boolean" } },
    size: {
      control: { type: "select" },
      options: sizes,
    },
    label: { control: { type: "text" } },
  },
  render: (args) => ({
    components: { MtFileIcon },
    setup() {
      return { args };
    },
    template: `<mt-file-icon v-bind="args" />`,
  }),
};

export default meta;
export type MtFileIconStory = StoryObj<MtFileIconMeta>;

export const Default: MtFileIconStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-file-icon file-name="invoice.pdf" label="PDF file" />`,
      },
    },
  },
};

export const Variants: MtFileIconStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-file-icon />
<mt-file-icon category="document" />
<mt-file-icon file-name="notes.txt" />
<mt-file-icon broken />`,
      },
    },
  },
  render: () => ({
    components: { MtFileIcon },
    template: `
      <div style="display: flex; gap: 8px;">
        <mt-file-icon />
        <mt-file-icon category="document" />
        <mt-file-icon file-name="notes.txt" />
        <mt-file-icon broken />
      </div>`,
  }),
};

export const Categories: MtFileIconStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: fileIconCategories
          .map((category) => `<mt-file-icon category="${category}" />`)
          .join("\n"),
      },
    },
  },
  render: () => ({
    components: { MtFileIcon },
    setup() {
      return { categories: fileIconCategories };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <mt-file-icon v-for="category in categories" :key="category" :category="category" />
      </div>`,
  }),
};

export const Formats: MtFileIconStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: formats.map((format) => `<mt-file-icon format="${format}" />`).join("\n"),
      },
    },
  },
  render: () => ({
    components: { MtFileIcon },
    setup() {
      return { formats };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        <mt-file-icon v-for="format in formats" :key="format" :format="format" />
      </div>`,
  }),
};

export const CustomIconAndFormat: MtFileIconStory = {
  name: "Custom icon and format",
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<mt-file-icon icon="square" format="TXT" />`,
      },
    },
  },
  args: {
    fileName: undefined,
    icon: "square",
    format: "TXT",
    label: undefined,
  },
};

export const Sizes: MtFileIconStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: sizes
          .map((size) => `<mt-file-icon :size="${size}" file-name="invoice.pdf" />`)
          .join("\n"),
      },
    },
  },
  render: () => ({
    components: { MtFileIcon },
    setup() {
      return { sizes };
    },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
        <mt-file-icon v-for="size in sizes" :key="size" :size="size" file-name="invoice.pdf" />
      </div>`,
  }),
};

export const Fluid: MtFileIconStory = {
  parameters: {
    docs: {
      source: {
        language: "html",
        code: `<div class="media-preview">
  <mt-file-icon size="fluid" file-name="photos.zip" />
</div>

<style>
.media-preview {
  container-type: inline-size;
}

.media-preview .mt-file-icon {
  width: 40cqw;
}
</style>`,
      },
    },
  },
  render: () => ({
    components: { MtFileIcon },
    setup() {
      return { widths: [40, 120, 200, 320], files: ["photos.zip", "invoice.pdf", "clip.mov"] };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div v-for="file in files" :key="file" style="display: flex; gap: 16px; align-items: flex-start;">
          <div
            v-for="width in widths"
            :key="width"
            :style="{ width: width + 'px', aspectRatio: '4 / 3', containerType: 'inline-size', display: 'grid', placeItems: 'center', border: '1px solid var(--color-border-secondary-default)', borderRadius: 'var(--border-radius-xs)' }"
          >
            <mt-file-icon size="fluid" :file-name="file" style="width: 40cqw;" />
          </div>
        </div>
      </div>`,
  }),
};
