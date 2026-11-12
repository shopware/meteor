import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import CommandPalettePrototype, {
  type CommandPaletteGroup,
} from "./CommandPalettePrototype.vue";

// jsdom doesn't implement modal dialogs or media queries.
beforeAll(() => {
  window.matchMedia ??= (query: string) =>
    ({ matches: false, media: query }) as MediaQueryList;
  HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});

function setup() {
  const openHome = vi.fn();
  const openSettings = vi.fn();
  const openAutomation = vi.fn();
  const groups: CommandPaletteGroup[] = [
    {
      id: "pages",
      label: "Pages",
      showWithoutQuery: true,
      items: [
        { id: "home", label: "Home", icon: "regular-home", run: openHome },
        {
          id: "settings",
          label: "Settings",
          icon: "regular-cog",
          run: openSettings,
        },
      ],
    },
    {
      id: "automations",
      label: "Automations",
      items: [
        {
          id: "sync",
          label: "Sync orders to the ERP",
          icon: "regular-flow",
          run: openAutomation,
        },
      ],
    },
  ];

  render(CommandPalettePrototype, { props: { groups } });
  return { user: userEvent.setup(), openHome, openSettings, openAutomation };
}

describe("CommandPalettePrototype", () => {
  it("shows the pages before anything is typed", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Search" }));

    expect(screen.getByRole("option", { name: "Home" })).toBeVisible();
    expect(screen.queryByRole("option", { name: /Sync orders/ })).toBeNull();
  });

  it("filters every group by what is typed", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Search" }));

    await user.keyboard("orders");

    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option", { name: /Sync orders/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("moves with the arrow keys and runs the active result with Enter", async () => {
    const { user, openSettings } = setup();
    await user.click(screen.getByRole("button", { name: "Search" }));

    await user.keyboard("{ArrowDown}{Enter}");

    expect(openSettings).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Search" })).toHaveFocus();
  });

  it("opens with the keyboard shortcut", async () => {
    const { user } = setup();

    await user.keyboard(
      navigator.platform.includes("Mac")
        ? "{Meta>}k{/Meta}"
        : "{Control>}k{/Control}",
    );

    expect(screen.getByRole("combobox", { name: "Search" })).toHaveFocus();
  });
});
