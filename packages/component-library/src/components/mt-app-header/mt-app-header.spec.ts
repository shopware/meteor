import { h, nextTick } from "vue";
import { render, screen, within } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtAppHeader from "./mt-app-header.vue";
import MtApp from "../mt-app/mt-app.vue";
import MtPage from "../mt-page/mt-page.vue";
import MtPanel from "../mt-panel/mt-panel.vue";
import { stubResizeObserver } from "../mt-app/__tests__/shell-test-utils";

const sections = [{ items: [{ label: "Dashboard", href: "#" }] }];

const slots = {
  start: `<template #start="{ isMobile }"><span>Brand {{ isMobile }}</span></template>`,
  actions: `<template #actions="{ isMobile }"><button>Notifications {{ isMobile }}</button></template>`,
  end: `<template #end="{ isMobile }"><button>User {{ isMobile }}</button></template>`,
};

function renderHeader(props: Record<string, unknown> = {}) {
  return render(MtAppHeader, { props: { sections, ...props }, slots });
}

describe("mt-app-header", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows the start, the navigation, the actions and the end in a wide header", () => {
    // ARRANGE
    stubResizeObserver(1200);

    // ACT
    renderHeader();

    // ASSERT
    expect(screen.getByText("Brand false")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Main" })).toHaveClass("mt-nav--horizontal");
    expect(screen.getByRole("button", { name: "Notifications false" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "User false" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Toggle Navigation" })).not.toBeInTheDocument();
  });

  it("moves the start, the navigation and the end into a drawer in a narrow header", async () => {
    // ARRANGE
    stubResizeObserver(800);
    renderHeader();

    // ACT
    await userEvent.click(await screen.findByRole("button", { name: "Toggle Navigation" }));

    // ASSERT
    const drawer = screen.getByRole("dialog", { name: "Navigation" });
    expect(within(drawer).getByText("Brand true")).toBeInTheDocument();
    expect(within(drawer).getByRole("navigation", { name: "Main" })).not.toHaveClass(
      "mt-nav--horizontal",
    );
    expect(within(drawer).getByRole("button", { name: "User true" })).toBeInTheDocument();
    expect(drawer).not.toContainElement(screen.getByRole("button", { name: "Notifications true" }));
  });

  it.each([
    ["the header", 1200],
    ["the drawer", 800],
  ])("marks the item that isActive matches as the current page in %s", async (_, width) => {
    // ARRANGE
    stubResizeObserver(width);
    renderHeader({
      sections: [
        {
          items: [
            { label: "Dashboard", href: "#dashboard" },
            { label: "Orders", href: "#orders" },
          ],
        },
      ],
      isActive: (item: { label: string }) => item.label === "Orders",
    });

    // ACT
    if (width < 1024) {
      await userEvent.click(await screen.findByRole("button", { name: "Toggle Navigation" }));
    }

    // ASSERT
    const navigation = await screen.findByRole("navigation", { name: "Main" });
    expect(within(navigation).getByRole("link", { name: "Orders" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(navigation).getByRole("link", { name: "Dashboard" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("shows the triggers of the shell's panels at its start and after the actions, instead of the page", async () => {
    // ARRANGE
    stubResizeObserver(1200);

    // ACT
    render(MtApp, {
      slots: {
        header: () =>
          h(
            MtAppHeader,
            { sections },
            {
              start: () => h("span", "Brand"),
              actions: () => h("button", "Notifications"),
            },
          ),
        navigation: () => h(MtPanel, { closable: true }, () => h("a", { href: "/" }, "Orders")),
        default: () => h(MtPage, { breadcrumb: [{ label: "Orders" }] }),
        sidebar: () => h(MtPanel, { closable: true }, () => h("div", "Tools")),
      },
    });
    await nextTick();

    // ASSERT
    expect(
      screen.getByRole("button", { name: "Toggle Navigation" }).nextElementSibling,
    ).toHaveTextContent("Brand");
    expect(screen.getByRole("button", { name: "Notifications" }).nextElementSibling).toBe(
      screen.getByRole("button", { name: "Toggle Sidebar" }),
    );
  });

  it("keeps the navigation in a header wider than a custom breakpoint", async () => {
    // ARRANGE
    stubResizeObserver(800);

    // ACT
    renderHeader({ breakpoint: 600 });

    // ASSERT
    expect(await screen.findByRole("navigation", { name: "Main" })).toHaveClass(
      "mt-nav--horizontal",
    );
    expect(screen.queryByRole("button", { name: "Toggle Navigation" })).not.toBeInTheDocument();
  });
});
