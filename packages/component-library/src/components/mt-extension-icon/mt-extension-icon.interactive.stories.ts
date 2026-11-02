import { within, expect } from "@storybook/test";

import MtExtensionIcon from "./mt-extension-icon.vue";
import meta, {
  sizes,
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

export const VisualTestSizes: MtExtensionIconStory = {
  name: "Render sizes",
  render: () => ({
    components: { MtExtensionIcon },
    setup() {
      return { src: "/extension-icon-example.svg", sizes: sizes.filter((size) => size <= 64) };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <mt-extension-icon v-for="size in sizes" :key="size" :size="size" :src="src" />
        </div>
        <div style="display: flex; gap: 12px; align-items: center;">
          <mt-extension-icon v-for="size in sizes" :key="size" :size="size" />
        </div>
      </div>`,
  }),
};

export const TestFallsBackToPlaceholder: MtExtensionIconStory = {
  name: "Falls back to the placeholder when the image fails to load",
  args: {
    src: "/does-not-exist.png",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByTestId("mt-extension-icon-placeholder");

    expect(canvas.getByRole("img", { name: "Example extension" })).toHaveClass("mt-extension-icon");
    expect(canvasElement.querySelector("img")).not.toBeInTheDocument();
  },
};
