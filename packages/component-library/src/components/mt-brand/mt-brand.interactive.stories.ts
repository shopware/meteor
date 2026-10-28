import { expect, within } from "@storybook/test";

import meta, {
  LongTitle,
  WithoutSubtitle,
  type MtBrandMeta,
  type MtBrandStory,
} from "./mt-brand.stories";

export default {
  ...meta,
  title: "Components/Brand/Interaction tests",
  tags: ["!autodocs"],
} as MtBrandMeta;

export const VisualTestDefault: MtBrandStory = {
  name: "Render logo with title and subtitle",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Demo shop")).toBeVisible();
    expect(canvas.getByText("Shopware")).toBeVisible();
  },
};

export const VisualTestWithoutSubtitle: MtBrandStory = {
  ...WithoutSubtitle,
  name: "Render logo without subtitle",
};

export const VisualTestLongTitle: MtBrandStory = {
  ...LongTitle,
  name: "Cut off a long title with an ellipsis",
  play: async ({ canvasElement }) => {
    const title = canvasElement.querySelector<HTMLElement>(".mt-brand__title");
    if (!title) throw new Error("Title not found");

    expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
  },
};
