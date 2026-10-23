import { expect, within } from "@storybook/test";

import meta, {
  LongTitle,
  WithoutSubtitle,
  type MtLogoMeta,
  type MtLogoStory,
} from "./mt-logo.stories";

export default {
  ...meta,
  title: "Components/Logo/Interaction tests",
  tags: ["!autodocs"],
} as MtLogoMeta;

export const VisualTestDefault: MtLogoStory = {
  name: "Render logo with title and subtitle",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByLabelText("Shopware")).toBeVisible();
    expect(canvas.getByText("Demo shop")).toBeVisible();
    expect(canvas.getByText("Shopware")).toBeVisible();
  },
};

export const VisualTestWithoutSubtitle: MtLogoStory = {
  ...WithoutSubtitle,
  name: "Render logo without subtitle",
};

export const VisualTestLongTitle: MtLogoStory = {
  ...LongTitle,
  name: "Cut off a long title with an ellipsis",
  play: async ({ canvasElement }) => {
    const title = canvasElement.querySelector<HTMLElement>(".mt-logo__title");
    if (!title) throw new Error("Title not found");

    expect(title.scrollWidth).toBeGreaterThan(title.clientWidth);
  },
};
