import { flushPromises } from "@vue/test-utils";
import type { TabItem } from "./mt-tabs.vue";
import MtTabs from "./mt-tabs.vue";
import { render, screen } from "@testing-library/vue";

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
});
