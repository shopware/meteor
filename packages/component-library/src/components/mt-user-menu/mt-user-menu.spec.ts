import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import MtUserMenu from "./mt-user-menu.vue";

function renderUserMenu(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return render(MtUserMenu, {
    props: { firstName: "Max", lastName: "Mustermann", ...props },
    slots,
  });
}

async function openMenu(name = "User menu: Max Mustermann") {
  screen.getByRole("button", { name }).focus();
  await userEvent.keyboard("{Enter}");

  return screen.findByRole("menu");
}

describe("mt-user-menu", () => {
  it("renders the full name of the user", () => {
    renderUserMenu();

    expect(screen.getByText("Max Mustermann")).toBeVisible();
  });

  it("renders only the first name when there is no last name", () => {
    renderUserMenu({ lastName: undefined });

    expect(screen.getByText("Max")).toBeVisible();
    expect(screen.getByRole("button", { name: "User menu: Max" })).toBeInTheDocument();
  });

  it("renders the initials in the avatar", () => {
    renderUserMenu();

    expect(screen.getByTestId("mt-avatar-initials")).toHaveTextContent("MM");
  });

  it("renders the role below the name", () => {
    const { container } = renderUserMenu({ role: "Administrator" });

    expect(container.querySelector(".mt-user-menu__role")).toHaveTextContent("Administrator");
  });

  it("renders no role when none is given", () => {
    const { container } = renderUserMenu();

    expect(container.querySelector(".mt-user-menu__role")).not.toBeInTheDocument();
  });

  it("names the menu button after the user", () => {
    renderUserMenu();

    const button = screen.getByRole("button", { name: "User menu: Max Mustermann" });
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("adds the role to the name of the menu button", () => {
    renderUserMenu({ role: "Administrator" });

    expect(
      screen.getByRole("button", { name: "User menu: Max Mustermann, Administrator" }),
    ).toBeInTheDocument();
  });

  it("hides the avatar from screen readers, as the button is named after the user", () => {
    renderUserMenu();

    expect(screen.getByTestId("mt-avatar-initials").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("uses the given accessible name for the menu button", () => {
    renderUserMenu({ menuLabel: "Account" });

    expect(screen.getByRole("button", { name: "Account" })).toBeInTheDocument();
  });

  it("opens the user menu with the logout entry", async () => {
    renderUserMenu();

    const menu = await openMenu();

    expect(menu).toContainElement(screen.getByRole("menuitem", { name: "Log out" }));
  });

  it("uses the given label for the logout entry", async () => {
    renderUserMenu({ logoutLabel: "Sign out" });

    await openMenu();

    expect(screen.getByRole("menuitem", { name: "Sign out" })).toBeInTheDocument();
  });

  it("emits logout when the logout entry is chosen", async () => {
    const handler = vi.fn();
    renderUserMenu({ onLogout: handler });
    await openMenu();

    await userEvent.click(screen.getByRole("menuitem", { name: "Log out" }));

    expect(handler).toHaveBeenCalledOnce();
  });

  it("shows the version at the bottom of the menu", async () => {
    renderUserMenu({ version: "6.7.0.0" });

    const menu = await openMenu();

    expect(menu).toHaveTextContent("Version 6.7.0.0");
  });

  it("shows no version when none is given", async () => {
    renderUserMenu();

    const menu = await openMenu();

    expect(menu).not.toHaveTextContent("Version");
  });

  it("places further entries from the default slot above the logout entry", async () => {
    renderUserMenu(
      {},
      {
        default: '<div role="menuitem">Profile</div>',
      },
    );

    await openMenu();

    const entries = screen.getAllByRole("menuitem");
    expect(entries.map((entry) => entry.textContent?.trim())).toEqual(["Profile", "Log out"]);
  });
});
