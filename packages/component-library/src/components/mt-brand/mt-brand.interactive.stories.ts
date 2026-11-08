import { expect, within } from "@storybook/test";

import meta, {
  Appearances,
  Compact,
  LongTitle,
  Variants,
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

    expect(canvas.getByText("Meteor")).toBeVisible();
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

export const VisualTestVariants: MtBrandStory = {
  ...Variants,
  name: "Render the logo of each product",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const icon of [
      "shopware",
      "shopware-copilot",
      "shopware-intelligence",
      "shopware-nexus",
      "shopware-payments",
    ]) {
      expect(canvas.getByTestId(`mt-icon__solid-${icon}`)).toBeInTheDocument();
    }
  },
};

export const VisualTestAppearances: MtBrandStory = {
  ...Appearances,
  name: "Render the dark and light appearance",
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector(".mt-brand__image--dark")).toBeInTheDocument();
    expect(canvasElement.querySelector(".mt-brand__image--light")).toBeInTheDocument();
  },
};

export const VisualTestCompact: MtBrandStory = {
  ...Compact,
  name: "Show only the logo when compact",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvasElement.querySelector(".mt-brand__text")).toHaveClass("visually-hidden");
    expect(canvas.getByText("Meteor")).toBeInTheDocument();
  },
};
