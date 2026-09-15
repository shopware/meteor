import { expect, userEvent, within } from "@storybook/test";
import { waitUntil } from "@/_internal/test-helper";

import meta, { Sections, type MtNavMeta, type MtNavStory } from "./mt-nav.stories";

export default {
  ...meta,
  title: "Components/Nav/Interaction tests",
  tags: ["!autodocs"],
} as MtNavMeta;

export const VisualTestDefault: MtNavStory = {
  name: "Render the navigation",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole("navigation", { name: "Main navigation" });

    expect(within(navigation).getByText("Dashboard")).toBeVisible();
    expect(within(navigation).getByText("Catalogues")).toBeVisible();
    expect(within(navigation).getByText("Settings")).toBeVisible();
    expect(within(navigation).queryByRole("heading", { level: 3 })).toBeNull();
  },
};

export const VisualTestSections: MtNavStory = {
  ...Sections,
  name: "Render sections with headers",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole("navigation", { name: "Main navigation" });

    expect(within(navigation).getByRole("heading", { name: "Shop" })).toBeVisible();
    expect(within(navigation).getByRole("heading", { name: "System" })).toBeVisible();
    expect(
      within(canvas.getByRole("list", { name: "System" })).getByText("Settings"),
    ).toBeVisible();
  },
};

export const VisualTestActiveRoute: MtNavStory = {
  name: "Open the branch of the current route",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The story starts on product.index, which sits below Catalogues
    await waitUntil(() => canvas.getByText("Products").checkVisibility());

    expect(canvas.getByText("Products").closest("li")).toHaveAttribute("aria-current", "page");
  },
};

export const VisualTestExpandBranch: MtNavStory = {
  name: "Expand a branch by clicking its row",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Content" }));

    await waitUntil(() => canvas.getByText("Media").checkVisibility());

    expect(canvas.getByText("Shopping Experiences")).toBeVisible();
    expect(canvas.getByText("Media")).toBeVisible();
  },
};

export const VisualTestCollapsed: MtNavStory = {
  name: "Render the collapsed navigation",
  args: {
    expanded: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole("navigation", { name: "Main navigation" });

    expect(navigation).toHaveClass("is--collapsed");

    // Labels are hidden, so the rows are named through aria-label
    expect(within(navigation).getByRole("link", { name: "Dashboard" })).toBeVisible();
    expect(within(navigation).getByRole("button", { name: "Catalogues" })).toBeVisible();
  },
};
