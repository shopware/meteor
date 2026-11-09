import { render, screen, within } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import MtDataTableSettings from "./mt-data-table-settings.vue";

// Mock "useDebounceFn" from "@vueuse/core"
vi.mock("@vueuse/core", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@vueuse/core")>()),
  useDebounceFn: (method: () => void) => {
    return method;
  },
}));

// mock resizeOvserver
global.ResizeObserver = class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
};

async function renderComponent({ disableInitialOpen = false } = {}) {
  const result = render(MtDataTableSettings, {
    props: {
      columns: [
        { label: "Name", property: "name", renderer: "text", position: 0, cellWrap: "normal" },
        {
          label: "Manufacturer",
          property: "manufacturer.name",
          renderer: "text",
          position: 100,
          cellWrap: "normal",
        },
        {
          label: "Description",
          property: "test",
          renderer: "text",
          position: 200,
          width: 120,
          allowResize: false,
        },
        {
          label: "Price",
          property: "price",
          renderer: "price",
          rendererOptions: {
            currencyId: "b7d2554b0ce847cd82f3ac9bd1c0dfca",
            currencyISOCode: "EUR",
            source: "gross",
          },
          position: 300,
          cellWrap: "nowrap",
          width: 150,
        },
        { label: "Stock", property: "stock", renderer: "number", position: 400, visible: false },
        { label: "Available", property: "available", renderer: "number", position: 500 },
      ],
    },
  });

  if (!disableInitialOpen) {
    // open the floating UI
    await userEvent.click(screen.getByRole("button", { name: "Toggle view settings" }));
  }

  return result;
}

async function dragColumnBefore(columnLabel: string, targetOptionLabel: string) {
  vi.useFakeTimers();
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

  await user.pointer({
    keys: "[MouseLeft>]",
    target: screen.getByRole("menuitem", { name: columnLabel }),
  });
  vi.advanceTimersByTime(200);

  const dropZone = screen
    .getByLabelText(targetOptionLabel)
    .querySelector<HTMLElement>(".mt-popover-item-result__option_drop_before")!;
  await user.pointer([{ target: dropZone }, { keys: "[/MouseLeft]" }]);
}

describe("mt-data-table-settings", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render the component", async () => {
    await renderComponent();

    expect(screen.getByRole("button", { name: "Toggle view settings" })).toBeInTheDocument();
  });

  it("should render the base view by default", async () => {
    await renderComponent();

    const popoverContent = screen.getByRole("dialog");
    expect(within(popoverContent).getByRole("heading")).toHaveAccessibleName("Settings");

    const popoverItems = within(popoverContent).getAllByRole("menuitem");

    expect(popoverItems).toHaveLength(6);

    // The "Columns" popover item should have the correct label and should render the number of columns
    expect(popoverItems[0]).toHaveAccessibleName("Columns");
    expect(popoverContent).toHaveTextContent("Columns 6");

    // The popover items should have the correct label
    expect(popoverItems[1]).toHaveAccessibleName("Show numbered column");
    expect(popoverItems[2]).toHaveAccessibleName("Show striped rows");
    expect(popoverItems[3]).toHaveAccessibleName("Show outlines");
    expect(popoverItems[4]).toHaveAccessibleName(
      "Frame outlines Highlight column and row outlines on mouse hover",
    );
    expect(popoverItems[5]).toHaveAccessibleName("Reset all changes");
  });

  it("should switch to columns view", async () => {
    await renderComponent();

    // Click on "Columns" label to switch to the columns view
    await userEvent.click(screen.getByRole("menuitem", { name: "Columns" }));

    // Check if the columns view header title is rendered
    const popoverContent = screen.getByRole("dialog");
    expect(await within(popoverContent).findByRole("heading")).toHaveAccessibleName("Columns");

    // Check if every column is rendered correctly
    const columns = within(popoverContent).getAllByRole("menuitem");
    expect(columns).toHaveLength(6);

    expect(columns[0]).toHaveTextContent("Name");
    expect(columns[1]).toHaveTextContent("Manufacturer");
    expect(columns[2]).toHaveTextContent("Description");
    expect(columns[3]).toHaveTextContent("Price");
    expect(columns[4]).toHaveTextContent("Available");
    expect(columns[5]).toHaveTextContent("Stock");
  });

  it("should emit the correct events when the columns are changed", async () => {
    const { emitted } = await renderComponent();

    // Click on "Columns" label to switch to the columns view
    await userEvent.click(screen.getByRole("menuitem", { name: "Columns" }));

    await dragColumnBefore("Price", "Shown in table: Manufacturer");

    // Check if the change-column-order event was emitted correctly
    expect(emitted()["change-column-order"]).toBeTruthy();
    expect(emitted()["change-column-order"]![0]).toStrictEqual([
      {
        itemId: "price",
        dropZone: "before",
        dropId: "manufacturer.name",
      },
    ]);

    // Check if the change-column-visibility was emitted correctly
    expect(emitted()["change-column-visibility"]).toBeTruthy();
    expect(emitted()["change-column-visibility"]![0]).toStrictEqual(["price", true]);
  });

  it("should emit the correct events when the columns are changed with visibility to false", async () => {
    const { emitted } = await renderComponent();

    // Click on "Columns" label to switch to the columns view
    await userEvent.click(screen.getByRole("menuitem", { name: "Columns" }));

    await dragColumnBefore("Available", "Hidden in table: Stock");

    // Check if the change-column-order event was emitted correctly
    expect(emitted()["change-column-order"]).toBeTruthy();
    expect(emitted()["change-column-order"]![0]).toStrictEqual([
      {
        itemId: "available",
        dropZone: "before",
        dropId: "stock",
      },
    ]);

    // Check if the change-column-visibility was emitted correctly
    expect(emitted()["change-column-visibility"]).toBeTruthy();
    expect(emitted()["change-column-visibility"]![0]).toStrictEqual(["available", false]);
  });

  it("should change the visibility of all non-pinned column items to false when click on group header of visibility", async () => {
    const { emitted } = await renderComponent();

    // Click on "Columns" label to switch to the columns view
    await userEvent.click(screen.getByRole("menuitem", { name: "Columns" }));

    await userEvent.click(screen.getByRole("button", { name: "Hide all" }));

    // Check if the change-column-visibility was emitted correctly to false for all columns
    expect(emitted()["change-column-visibility"]).toBeTruthy();
    expect(emitted()["change-column-visibility"]!).toHaveLength(5);
    emitted<boolean[]>()["change-column-visibility"]!.forEach((emit) => {
      expect(emit[1]).toBeFalsy();
    });
  });

  it("should change the visibility of all non-pinned column items to true when click on group header of hidden", async () => {
    const { emitted } = await renderComponent();

    // Click on "Columns" label to switch to the columns view
    await userEvent.click(screen.getByRole("menuitem", { name: "Columns" }));

    await userEvent.click(screen.getByRole("button", { name: "Show all" }));

    // Check if the change-column-visibility was emitted correctly to false for all columns
    expect(emitted()["change-column-visibility"]).toBeTruthy();
    expect(emitted()["change-column-visibility"]!).toHaveLength(5);
    emitted<boolean[]>()["change-column-visibility"]!.forEach((emit) => {
      expect(emit[1]).toBeTruthy();
    });
  });

  it("should emit reset-all-changes event", async () => {
    const { emitted } = await renderComponent();

    // Click on "Reset" button to reset all changes
    await userEvent.click(screen.getByRole("menuitem", { name: "Reset all changes" }));

    // Check if the reset-all-changes event was emitted
    expect(emitted("reset-all-changes")).toBeTruthy();
  });
});
