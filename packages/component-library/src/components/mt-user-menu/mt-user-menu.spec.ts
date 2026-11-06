import { render, screen } from "@testing-library/vue";
import { userEvent } from "@testing-library/user-event";
import MtUserMenu from "./mt-user-menu.vue";
import MtActionMenuItem from "../mt-action-menu-item/mt-action-menu-item.vue";

function renderUserMenu(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return render(MtUserMenu, { props: { name: "Max Mustermann", ...props }, slots });
}

async function openMenu() {
  screen.getByRole("button", { name: /Max Mustermann/ }).focus();
  await userEvent.keyboard("{Enter}");

  return screen.findByRole("menu");
}

describe("mt-user-menu", () => {
  it("names the menu button after the user and the subtitle", () => {
    // ACT
    renderUserMenu({ subtitle: "Administrator" });

    // ASSERT
    const button = screen.getByRole("button", { name: "Max Mustermann Administrator" });
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("shows only the avatar when compact, but keeps the button named after the user", () => {
    // ACT
    const { container } = renderUserMenu({ compact: true, subtitle: "Administrator" });

    // ASSERT
    expect(container.querySelector(".mt-user-menu__chevrons")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Max Mustermann Administrator" }),
    ).toBeInTheDocument();
  });

  it("opens a menu with the entries of the default slot", async () => {
    // ARRANGE
    const onSelect = vi.fn();
    renderUserMenu(
      {},
      {
        default: {
          components: { MtActionMenuItem },
          setup: () => ({ onSelect }),
          template: `
            <mt-action-menu-item>Your profile</mt-action-menu-item>
            <mt-action-menu-item @select="onSelect">Log out</mt-action-menu-item>
          `,
        },
      },
    );

    // ACT
    const menu = await openMenu();

    // ASSERT
    const entries = screen.getAllByRole("menuitem");
    expect(entries.map((entry) => entry.textContent?.trim())).toEqual(["Your profile", "Log out"]);
    expect(menu).toContainElement(entries[1]);

    // ACT
    await userEvent.click(entries[1]);

    // ASSERT
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("has no entries of its own", async () => {
    // ARRANGE
    renderUserMenu();

    // ACT
    await openMenu();

    // ASSERT
    expect(screen.queryAllByRole("menuitem")).toHaveLength(0);
  });
});
