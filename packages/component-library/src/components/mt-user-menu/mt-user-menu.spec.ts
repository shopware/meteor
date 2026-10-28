import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import MtUserMenu from "./mt-user-menu.vue";
import MtActionMenuItem from "../mt-action-menu-item/mt-action-menu-item.vue";

function renderUserMenu(props: Record<string, unknown> = {}) {
  return render(MtUserMenu, {
    props: { firstName: "Max", lastName: "Mustermann", ...props },
  });
}

async function openMenu(name = "Max Mustermann") {
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
    expect(screen.getByRole("button", { name: "Max" })).toBeInTheDocument();
  });

  it("renders the initials in the avatar", () => {
    renderUserMenu();

    expect(screen.getByTestId("mt-avatar-initials")).toHaveTextContent("MM");
  });

  it("renders the subtitle below the name", () => {
    const { container } = renderUserMenu({ subtitle: "Administrator" });

    expect(container.querySelector(".mt-user__subtitle")).toHaveTextContent("Administrator");
  });

  it("renders no subtitle when none is given", () => {
    const { container } = renderUserMenu();

    expect(container.querySelector(".mt-user__subtitle")).not.toBeInTheDocument();
  });

  it("names the menu button after its visible name and subtitle", () => {
    renderUserMenu({ subtitle: "Administrator" });

    const button = screen.getByRole("button", { name: "Max Mustermann Administrator" });
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("hides the avatar from screen readers, as the button is named after the user", () => {
    renderUserMenu();

    expect(screen.getByTestId("mt-avatar-initials").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("opens a menu with the entries of the default slot", async () => {
    const onSelect = vi.fn();
    render(MtUserMenu, {
      props: { firstName: "Max", lastName: "Mustermann" },
      slots: {
        default: {
          components: { MtActionMenuItem },
          setup: () => ({ onSelect }),
          template: `
            <mt-action-menu-item>Your profile</mt-action-menu-item>
            <mt-action-menu-item @select="onSelect">Log out</mt-action-menu-item>
          `,
        },
      },
    });

    const menu = await openMenu();

    const entries = screen.getAllByRole("menuitem");
    expect(entries.map((entry) => entry.textContent?.trim())).toEqual(["Your profile", "Log out"]);
    expect(menu).toContainElement(entries[1]);

    await userEvent.click(entries[1]);

    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("has no entries of its own", async () => {
    renderUserMenu();

    await openMenu();

    expect(screen.queryAllByRole("menuitem")).toHaveLength(0);
  });
});
