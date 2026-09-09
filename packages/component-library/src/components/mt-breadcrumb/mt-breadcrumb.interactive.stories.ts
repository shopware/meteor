import { within, expect, userEvent, waitFor } from "@storybook/test";
import { defineStory } from "@/_internal/story-helper";

import meta, {
  Collapsed,
  Default,
  LongLabel,
  Sizes,
  Wrap,
  type MtBreadcrumbMeta,
  type MtBreadcrumbStory,
} from "./mt-breadcrumb.stories";

export default {
  ...meta,
  title: "Components/Breadcrumb/Interaction tests",
  tags: ["!autodocs"],
} as MtBreadcrumbMeta;

export const VisualTestDefault: MtBreadcrumbStory = {
  ...Default,
  name: "Render default breadcrumb",
};

export const VisualTestSizes: MtBreadcrumbStory = {
  ...Sizes,
  name: "Render sizes",
};

export const VisualTestHoverLink: MtBreadcrumbStory = {
  ...Default,
  name: "Underline a hovered link",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.hover(canvas.getByRole("link", { name: "Products" }));
  },
};

export const VisualTestTruncatedLabel: MtBreadcrumbStory = {
  ...LongLabel,
  name: "Truncate a long label",
};

export const VisualTestCollapsed: MtBreadcrumbStory = {
  ...Collapsed,
  name: "Collapse middle crumbs on a narrow container",
};

export const VisualTestWrap: MtBreadcrumbStory = {
  ...Wrap,
  name: "Wrap crumbs on a narrow container",
};

export const TestNavHasAccessibleName: MtBreadcrumbStory = {
  ...Default,
  name: "Exposes a labelled navigation landmark",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
  },
};

export const TestCurrentItemHasAriaCurrent: MtBreadcrumbStory = {
  ...Default,
  name: "Marks the current page",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Shoes")).toHaveAttribute("aria-current", "page");
    expect(canvas.getAllByRole("listitem")).toHaveLength(3);
  },
};

export const TestCollapsedHidesMiddleCrumbs: MtBreadcrumbStory = {
  ...Collapsed,
  name: "Hides middle crumbs but keeps the root and the current page",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() => {
      expect(canvas.getByText("Catalog")).not.toBeVisible();
    });

    expect(canvas.getByText("Home")).toBeVisible();
    expect(canvas.getByText("Running shoes")).toBeVisible();
    expect(canvas.getByRole("button", { name: /hidden level/ })).toBeVisible();
  },
};

export const VisualTestOverflowMenuOpen = defineStory<MtBreadcrumbMeta>(
  {
    name: "Open the overflow menu",
    play: async ({ canvasElement, screen }) => {
      const canvas = within(canvasElement);

      await userEvent.click(await canvas.findByRole("button", { name: /hidden level/ }));
      await screen.findByRole("menu");
    },
  },
  { from: Collapsed },
);

export const TestOverflowMenuListsHiddenCrumbs = defineStory<MtBreadcrumbMeta>(
  {
    name: "Lists the hidden crumbs as links and returns focus on Escape",
    play: async ({ canvasElement, screen }) => {
      const canvas = within(canvasElement);
      const button = await canvas.findByRole("button", { name: /hidden level/ });

      await userEvent.click(button);
      const entries = await screen.findAllByRole("menuitem");

      expect(entries.map((entry) => entry.textContent?.trim())).toEqual([
        "Catalog",
        "Clothing and accessories for every season",
      ]);
      entries.forEach((entry) => expect(entry).toHaveAttribute("href", "#"));

      await userEvent.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
      expect(button).toHaveFocus();
    },
  },
  { from: Collapsed },
);
