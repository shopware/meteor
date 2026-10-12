import { expect, userEvent, within } from "@storybook/test";

import meta, {
  LongName,
  WithFurtherEntries,
  WithoutRole,
  type MtSidebarFooterMeta,
  type MtSidebarFooterStory,
} from "./mt-sidebar-footer.stories";

export default {
  ...meta,
  title: "Components/Sidebar/Footer/Interaction tests",
  tags: ["!autodocs"],
} as MtSidebarFooterMeta;

async function openMenu(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByRole("button", { name: "User menu: Max Mustermann" }));

  // The menu is rendered at the end of the document, outside the canvas
  return within(document.body).findByRole("menu");
}

export const VisualTestDefault: MtSidebarFooterStory = {
  name: "Render footer with name and role",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Max Mustermann")).toBeVisible();
    expect(canvas.getByText("Administrator")).toBeVisible();
  },
};

export const VisualTestWithoutRole: MtSidebarFooterStory = {
  ...WithoutRole,
  name: "Render footer without role",
};

export const VisualTestLongName: MtSidebarFooterStory = {
  ...LongName,
  name: "Cut off a long name with an ellipsis",
  play: async ({ canvasElement }) => {
    const name = canvasElement.querySelector<HTMLElement>(".mt-sidebar-footer__name");
    if (!name) throw new Error("Name not found");

    expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
  },
};

export const VisualTestOpenMenu: MtSidebarFooterStory = {
  name: "Open the user menu",
  play: async ({ canvasElement }) => {
    const menu = await openMenu(canvasElement);

    expect(within(menu).getByRole("menuitem", { name: "Log out" })).toBeVisible();
    expect(menu).toHaveTextContent("Version 6.7.0.0");
  },
};

export const VisualTestOpenMenuWithFurtherEntries: MtSidebarFooterStory = {
  ...WithFurtherEntries,
  name: "Open the user menu with further entries",
  play: async ({ canvasElement }) => {
    const menu = await openMenu(canvasElement);

    const entries = within(menu).getAllByRole("menuitem");
    expect(entries.map((entry) => entry.textContent?.trim())).toEqual([
      "Your profile",
      "Settings",
      "Log out",
    ]);
  },
};

export const TestEmitsLogout: MtSidebarFooterStory = {
  name: "Emits logout when the logout entry is chosen",
  play: async ({ args, canvasElement }) => {
    const menu = await openMenu(canvasElement);

    await userEvent.click(within(menu).getByRole("menuitem", { name: "Log out" }));

    expect(args.onLogout).toHaveBeenCalledOnce();
  },
};
