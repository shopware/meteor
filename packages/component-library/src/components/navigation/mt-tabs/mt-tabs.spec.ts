import { flushPromises } from "@vue/test-utils";
import type { TabItem } from "./mt-tabs.vue";
import MtTabs from "./mt-tabs.vue";
import { render, screen } from "@testing-library/vue";
import { userEvent } from "@storybook/test";

describe("mt-tabs", () => {
  it("selects the first tab by default", async () => {
    // ARRANGE
    const items: TabItem[] = [
      { label: "Tab 1", name: "tab1" },
      { label: "Tab 2", name: "tab2" },
    ];

    // ACT
    render(MtTabs, {
      props: { items },
    });

    await flushPromises();

    // ASSERT
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("aria-selected", "false");
  });

  it("selects the second tab as a default tab", async () => {
    // ARRANGE
    const items: TabItem[] = [
      { label: "Tab 1", name: "tab1" },
      { label: "Tab 2", name: "tab2" },
    ];

    // ACT
    render(MtTabs, {
      props: { items, defaultItem: "tab2" },
    });

    await flushPromises();

    // ASSERT
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("aria-selected", "true");
  });

  it("selects the tab when clicked", async () => {
    // ARRANGE
    const items: TabItem[] = [
      { label: "Tab 1", name: "tab1" },
      { label: "Tab 2", name: "tab2" },
    ];

    const handler = vi.fn();

    render(MtTabs, {
      props: {
        items,
        "onNew-item-active": handler,
      },
    });

    await flushPromises();

    // ACT
    await userEvent.click(screen.getByRole("tab", { name: "Tab 2" }));

    // ASSERT
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("aria-selected", "true");

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenLastCalledWith("tab2");
  });

  it("does not select the tab when clicked if it is disabled", async () => {
    // ARRANGE
    const items: TabItem[] = [
      { label: "Tab 1", name: "tab1" },
      { label: "Tab 2", name: "tab2", disabled: true },
    ];

    const handler = vi.fn();

    render(MtTabs, {
      props: {
        items,
        "onNew-item-active": handler,
      },
    });

    await flushPromises();

    // ACT
    await userEvent.click(screen.getByRole("tab", { name: "Tab 2" }));

    // ASSERT
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("aria-selected", "false");

    expect(handler).not.toHaveBeenCalled();
  });

  it("announces an errored tab", async () => {
    // ARRANGE
    const items: TabItem[] = [
      { label: "Tab 1", name: "tab1" },
      { label: "Tab 2", name: "tab2", hasError: true },
    ];

    render(MtTabs, {
      props: { items },
    });

    await flushPromises();

    // ASSERT
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("aria-invalid", "true");
  });

  it("shows normal tab when error is resolved", async () => {
    // ARRANGE
    const items: TabItem[] = [
      { label: "Tab 1", name: "tab1" },
      { label: "Tab 2", name: "tab2", hasError: true },
    ];

    const { rerender } = render(MtTabs, {
      props: { items },
    });

    await flushPromises();

    await userEvent.click(screen.getByRole("tab", { name: "Tab 2" }));

    // ACT
    await rerender({
      items: [
        { label: "Tab 1", name: "tab1" },
        { label: "Tab 2", name: "tab2", hasError: false },
      ],
    });

    // ASSERT
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("aria-invalid", "false");
    expect(screen.getByTestId("mt-tabs__slider")).not.toHaveClass("mt-tabs__slider--error");
  });

  it("focuses the active tab when tabbing into the tabs", async () => {
    // ARRANGE
    const items: TabItem[] = [
      { label: "Tab 1", name: "tab1" },
      { label: "Tab 2", name: "tab2" },
    ];

    render(MtTabs, {
      props: { items, defaultItem: "tab2" },
    });

    await flushPromises();

    // ACT
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveFocus();
  });

  it("only tabs through one tab and than to the next element", async () => {
    // ARRANGE
    render({
      components: { MtTabs },
      template: '<div><mt-tabs :items="items" /><button>Some button</button></div>',
      setup: () => ({
        items: [
          { label: "Tab 1", name: "tab1" },
          { label: "Tab 2", name: "tab2" },
        ],
      }),
    });

    // ACT
    await userEvent.tab();
    await userEvent.tab();

    // ASSERT
    expect(screen.getByRole("button", { name: "Some button" })).toHaveFocus();
  });

  it("focuses the next tab when pressing right arrow key", async () => {
    // ARRANGE
    const items: TabItem[] = [
      { label: "Tab 1", name: "tab1" },
      { label: "Tab 2", name: "tab2" },
    ];

    render(MtTabs, {
      props: { items, defaultItem: "tab1" },
    });

    await flushPromises();

    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowRight}");

    // ASSERT
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveFocus();

    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("aria-selected", "false");
  });

  it("is only possible to focus the active element after navigating via the arrow keys", async () => {
    // ARRANGE
    render(MtTabs, {
      props: {
        items: [
          { label: "Tab 1", name: "tab1" },
          { label: "Tab 2", name: "tab2" },
        ],
        defaultItem: "tab1",
      },
    });

    await flushPromises();

    await userEvent.tab();
    await userEvent.keyboard("{ArrowRight}");

    // ACT & ASSERT
    await userEvent.tab();

    await userEvent.tab();
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveFocus();

    await userEvent.tab();
    expect(document.body).toHaveFocus();
  });

  it("focuses the third tab when pressing the right arrow key two times", async () => {
    // ARRANGE
    const items: TabItem[] = [
      { label: "Tab 1", name: "tab1" },
      { label: "Tab 2", name: "tab2" },
      { label: "Tab 3", name: "tab3" },
    ];

    render(MtTabs, {
      props: { items, defaultItem: "tab1" },
    });

    await flushPromises();

    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}");

    // ASSERT
    expect(screen.getByRole("tab", { name: "Tab 3" })).toHaveFocus();

    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Tab 3" })).toHaveAttribute("aria-selected", "false");
  });

  it("focus the first tab when pressing the left arrow key on the second tab", async () => {
    // ARRANGE
    const items: TabItem[] = [
      { label: "Tab 1", name: "tab1" },
      { label: "Tab 2", name: "tab2" },
    ];

    render(MtTabs, {
      props: { items, defaultItem: "tab2" },
    });

    await flushPromises();

    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowLeft}");

    // ASSERT
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveFocus();

    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("aria-selected", "true");
  });

  it("focuses the last tab when pressing the left arrow key on the first tab", async () => {
    // ARRANGE
    const items: TabItem[] = [
      { label: "Tab 1", name: "tab1" },
      { label: "Tab 2", name: "tab2" },
    ];

    render(MtTabs, {
      props: { items, defaultItem: "tab1" },
    });

    await flushPromises();

    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowLeft}");

    // ASSERT
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveFocus();

    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("aria-selected", "false");
  });

  it("focuses the first tab when pressing the right arrow key on the last tab", async () => {
    // ARRANGE
    const items: TabItem[] = [
      { label: "Tab 1", name: "tab1" },
      { label: "Tab 2", name: "tab2" },
    ];

    render(MtTabs, {
      props: { items, defaultItem: "tab2" },
    });

    await flushPromises();

    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowRight}");

    // ASSERT
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveFocus();

    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute("aria-selected", "true");
  });

  it("moves focus out of the tab component when pressing shift and tab and the user previously navigated via the right arrow key", async () => {
    // ARRANGE
    render(MtTabs, {
      props: {
        items: [
          { label: "Tab 1", name: "tab1" },
          { label: "Tab 2", name: "tab2" },
          { label: "Tab 3", name: "tab3" },
          { label: "Tab 4", name: "tab4" },
        ],
        defaultItem: "tab1",
      },
    });

    await flushPromises();

    await userEvent.tab();

    // ACT
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}");

    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");

    // ASSERT
    expect(document.body).toHaveFocus();
  });
});
