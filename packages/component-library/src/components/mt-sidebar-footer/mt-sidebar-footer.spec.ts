import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import MtSidebarFooter from "./mt-sidebar-footer.vue";

function renderFooter(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return render(MtSidebarFooter, {
    props: { firstName: "Max", lastName: "Mustermann", ...props },
    slots,
  });
}

async function openMenu(name = "User menu: Max Mustermann") {
  screen.getByRole("button", { name }).focus();
  await userEvent.keyboard("{Enter}");

  return screen.findByRole("menu");
}

describe("mt-sidebar-footer", () => {
  it("renders the full name of the user", () => {
    renderFooter();

    expect(screen.getByText("Max Mustermann")).toBeVisible();
  });

  it("renders only the first name when there is no last name", () => {
    renderFooter({ lastName: undefined });

    expect(screen.getByText("Max")).toBeVisible();
    expect(screen.getByRole("button", { name: "User menu: Max" })).toBeInTheDocument();
  });

  it("renders the initials in the avatar", () => {
    renderFooter();

    expect(screen.getByTestId("mt-avatar-initials")).toHaveTextContent("MM");
  });

  it("renders the role below the name", () => {
    const { container } = renderFooter({ role: "Administrator" });

    expect(container.querySelector(".mt-sidebar-footer__role")).toHaveTextContent("Administrator");
  });

  it("renders no role when none is given", () => {
    const { container } = renderFooter();

    expect(container.querySelector(".mt-sidebar-footer__role")).not.toBeInTheDocument();
  });

  it("names the menu button after the user", () => {
    renderFooter();

    const button = screen.getByRole("button", { name: "User menu: Max Mustermann" });
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("uses the given accessible name for the menu button", () => {
    renderFooter({ menuLabel: "Account" });

    expect(screen.getByRole("button", { name: "Account" })).toBeInTheDocument();
  });

  it("opens the user menu with the logout entry", async () => {
    renderFooter();

    const menu = await openMenu();

    expect(menu).toContainElement(screen.getByRole("menuitem", { name: "Log out" }));
  });

  it("uses the given label for the logout entry", async () => {
    renderFooter({ logoutLabel: "Sign out" });

    await openMenu();

    expect(screen.getByRole("menuitem", { name: "Sign out" })).toBeInTheDocument();
  });

  it("emits logout when the logout entry is chosen", async () => {
    const handler = vi.fn();
    renderFooter({ onLogout: handler });
    await openMenu();

    await userEvent.click(screen.getByRole("menuitem", { name: "Log out" }));

    expect(handler).toHaveBeenCalledOnce();
  });

  it("shows the version at the bottom of the menu", async () => {
    renderFooter({ version: "6.7.0.0" });

    const menu = await openMenu();

    expect(menu).toHaveTextContent("Version 6.7.0.0");
  });

  it("shows no version when none is given", async () => {
    renderFooter();

    const menu = await openMenu();

    expect(menu).not.toHaveTextContent("Version");
  });

  it("places further entries from the default slot above the logout entry", async () => {
    renderFooter(
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
