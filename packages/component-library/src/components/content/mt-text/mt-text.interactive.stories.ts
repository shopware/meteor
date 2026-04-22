import { expect, within } from "@storybook/test";
import meta from "./mt-text.stories";
import type { MtTextMeta } from "./mt-text.stories";
import type { StoryObj } from "@storybook/vue3";

export default {
  ...meta,
  title: "Components/Text/Interaction tests",
  tags: ["!autodocs"],
} satisfies MtTextMeta;

type MtTextStory = StoryObj<MtTextMeta>;

export const VisualTestDefaultParagraph: MtTextStory = {
  name: "Render as paragraph",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const text = canvas.getByText("Text");

    expect(text.tagName).toBe("P");
  },
};

export const VisualTestRenderAsSpan: MtTextStory = {
  name: "Render as span",
  args: {
    as: "span",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const text = canvas.getByText("Text");

    expect(text.tagName).toBe("SPAN");
  },
};

export const VisualTestSemiboldText: MtTextStory = {
  name: "Render semibold text",
  args: {
    weight: "semibold",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const text = canvas.getByText("Text");

    expect(text).toHaveClass("mt-text--weight-semibold");
  },
};
