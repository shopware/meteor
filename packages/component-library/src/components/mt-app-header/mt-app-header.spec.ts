import { render, screen, within } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtAppHeader from "./mt-app-header.vue";
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
