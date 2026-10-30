import { expect, userEvent, within } from "@storybook/test";

import meta, {
  Compact,
  LongName,
  WithoutSubtitle,
  type MtUserMenuMeta,
  type MtUserMenuStory,
} from "./mt-user-menu.stories";

export default {
  ...meta,
  title: "Components/User Menu/Interaction tests",
  tags: ["!autodocs"],
} as MtUserMenuMeta;

async function openMenu(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);

  await userEvent.click(canvas.getByRole("button", { name: "Max Mustermann Administrator" }));

  // The menu is rendered at the end of the document, outside the canvas
  return within(document.body).findByRole("menu");
}

export const VisualTestDefault: MtUserMenuStory = {
  name: "Render user menu with name and subtitle",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText("Max Mustermann")).toBeVisible();
    expect(canvas.getByText("Administrator")).toBeVisible();
  },
};

export const VisualTestWithoutSubtitle: MtUserMenuStory = {
  ...WithoutSubtitle,
  name: "Render user menu without subtitle",
};

export const VisualTestLongName: MtUserMenuStory = {
  ...LongName,
  name: "Cut off a long name with an ellipsis",
  play: async ({ canvasElement }) => {
    const name = canvasElement.querySelector<HTMLElement>(".mt-user__name");
    if (!name) throw new Error("Name not found");

    expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
  },
};

export const VisualTestOpenMenu: MtUserMenuStory = {
  name: "Open the user menu",
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

export const VisualTestCompact: MtUserMenuStory = {
  ...Compact,
  name: "Show only the avatar when compact",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("button", { name: "Max Mustermann Administrator" })).toBeVisible();
    expect(canvasElement.querySelector(".mt-user-menu__chevrons")).not.toBeInTheDocument();
  },
};
