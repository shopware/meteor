import { expect, userEvent, within } from "@storybook/test";
import { waitUntil } from "@/_internal/test-helper";

import meta, { type MtSidebarMeta, type MtSidebarStory } from "./mt-sidebar.stories";

export default {
  ...meta,
  title: "Components/Sidebar/Interaction tests",
  tags: ["!autodocs"],
} as MtSidebarMeta;

export const VisualTestDefault: MtSidebarStory = {
  name: "Render the sidebar",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole("navigation", { name: "Main navigation" });

    expect(within(navigation).getByText("Dashboard")).toBeVisible();
    expect(within(navigation).getByText("Catalogues")).toBeVisible();
    expect(canvas.getByText("Demo store")).toBeVisible();
    expect(canvas.getByText("Max Mustermann")).toBeVisible();
  },
};

export const VisualTestActiveRoute: MtSidebarStory = {
  name: "Open the branch of the current route",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The story starts on product.index, which sits below Catalogues
    await waitUntil(() => canvas.getByText("Products").checkVisibility());

    expect(canvas.getByText("Products").closest("li")).toHaveAttribute("aria-current", "page");
  },
};

export const VisualTestExpandBranch: MtSidebarStory = {
  name: "Expand a branch by clicking its row",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Content" }));

    await waitUntil(() => canvas.getByText("Media").checkVisibility());

    expect(canvas.getByText("Shopping Experiences")).toBeVisible();
    expect(canvas.getByText("Media")).toBeVisible();
  },
};

export const VisualTestCollapse: MtSidebarStory = {
  name: "Collapse and expand the sidebar",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sidebar = canvasElement.querySelector(".mt-sidebar") as HTMLElement;

    await userEvent.click(canvas.getByRole("button", { name: "Collapse menu" }));

    await waitUntil(() => sidebar.classList.contains("is--collapsed"));
    expect(sidebar).toHaveAttribute("data-expanded", "false");

    await userEvent.click(canvas.getByRole("button", { name: "Expand menu" }));

    await waitUntil(() => sidebar.classList.contains("is--expanded"));
    expect(sidebar).toHaveAttribute("data-expanded", "true");
  },
};

export const VisualTestFlyout: MtSidebarStory = {
  name: "Show the flyout of a collapsed branch",
  args: {
    expanded: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.hover(canvas.getByRole("button", { name: "Marketing" }));

    // The flyout is positioned asynchronously and fades in, so wait for it to be fully shown
    await waitUntil(() => {
      const element = document.getElementById("mt-sidebar-flyout");

      return (
        element !== null &&
        getComputedStyle(element).visibility === "visible" &&
        getComputedStyle(element).opacity === "1"
      );
    });

    const flyout = within(document.getElementById("mt-sidebar-flyout") as HTMLElement);

    expect(flyout.getByText("Marketing")).toBeVisible();
    expect(flyout.getByText("Promotions")).toBeVisible();
    expect(flyout.getByText("Newsletter recipients")).toBeVisible();
  },
};

export const VisualTestUserMenu: MtSidebarStory = {
  name: "Open the user menu in the footer",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Max Mustermann, Administrator" }));

    await waitUntil(() => document.querySelector('[role="menu"]') !== null);

    const menu = within(document.querySelector('[role="menu"]') as HTMLElement);

    expect(menu.getByRole("menuitem", { name: "Profile" })).toBeVisible();
    expect(menu.getByRole("menuitem", { name: "Logout" })).toBeVisible();
    expect(menu.getByText("Version: 6.7.0.0")).toBeVisible();

    await userEvent.keyboard("{Escape}");
  },
};
