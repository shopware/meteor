import { expect, userEvent, within } from "@storybook/test";

import meta, {
  LongName,
  WithFurtherEntries,
  WithoutRole,
  type MtUserMenuMeta,
  type MtUserMenuStory,
} from "./mt-user-menu.stories";

export default {
  ...meta,
  title: "Components/User menu/Interaction tests",
  tags: ["!autodocs"],
} as MtUserMenuMeta;

async function openMenu(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByRole("button", { name: "User menu: Max Mustermann" }));

  // The menu is rendered at the end of the document, outside the canvas
  return within(document.body).findByRole("menu");
}

export const VisualTestDefault: MtUserMenuStory = {
  name: "Render footer with name and role",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Max Mustermann")).toBeVisible();
    expect(canvas.getByText("Administrator")).toBeVisible();
  },
};

export const VisualTestWithoutRole: MtUserMenuStory = {
  ...WithoutRole,
  name: "Render footer without role",
};

export const VisualTestLongName: MtUserMenuStory = {
  ...LongName,
  name: "Cut off a long name with an ellipsis",
  play: async ({ canvasElement }) => {
    const name = canvasElement.querySelector<HTMLElement>(".mt-user-menu__name");
    if (!name) throw new Error("Name not found");

    expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
  },
};

export const VisualTestOpenMenu: MtUserMenuStory = {
  name: "Open the user menu",
  play: async ({ canvasElement }) => {
    const menu = await openMenu(canvasElement);

    expect(within(menu).getByRole("menuitem", { name: "Log out" })).toBeVisible();
    expect(menu).toHaveTextContent("Version 6.7.0.0");
  },
};

export const VisualTestOpenMenuWithFurtherEntries: MtUserMenuStory = {
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

export const TestEmitsLogout: MtUserMenuStory = {
  name: "Emits logout when the logout entry is chosen",
  play: async ({ args, canvasElement }) => {
    const menu = await openMenu(canvasElement);

    await userEvent.click(within(menu).getByRole("menuitem", { name: "Log out" }));

    expect(args.onLogout).toHaveBeenCalledOnce();
  },
};
