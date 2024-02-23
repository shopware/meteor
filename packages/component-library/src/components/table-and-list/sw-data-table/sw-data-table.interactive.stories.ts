import meta, { type SwDataTableMeta, type SwDataTableStory } from "./sw-data-table.stories";
import SwDataTableFixtures from "./sw-data-table.fixtures.json";
import { waitUntilRendered } from "../../../_internal/test-helper";
import { within, userEvent, waitFor, fireEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

export default {
  ...meta,
  title: "Interaction Tests/Table and list/sw-data-table",
} as SwDataTableMeta;

export const VisualTestRenderTable: SwDataTableStory = {
  name: "Should render the Table",
};

export const VisualTestRenderFullTable: SwDataTableStory = {
  name: "Should render the full Table",
  args: {
    layout: "full",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => {
      return document.querySelector(".sw-data-table-text-renderer");
    });

    await expect(canvas.getByText("Awesome Concrete Chair")).toBeInTheDocument();
  },
};

export const VisualTestRenderEmptyState: SwDataTableStory = {
  name: "Should render the empty state",
  args: {
    dataSource: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitUntilRendered(() => {
      return document.querySelector(".sw-empty-state");
    });

    await expect(canvas.getByText("Add your first item")).toBeInTheDocument();
  },
};

export const VisualTestRenderTableStickyHeader: SwDataTableStory = {
  name: "Should render the Table with sticky header",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitUntilRendered(() => document.body.textContent?.includes("Gorgeous Wooden Ball"));
    await waitUntilRendered(() => document.body.textContent?.includes("Available"));

    // wait 1 second so that everything is correctly rendered
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // scroll to bottom
    const swDataTable = document.querySelector(".sw-data-table__table-wrapper");

    if (!swDataTable) {
      throw new Error("swDataTable not found");
    }

    swDataTable.scrollTop = swDataTable.scrollHeight;

    await expect(canvas.getByText("Gorgeous Wooden Ball")).toBeInTheDocument();
  },
};

export const VisualTestRenderTableWithoutCardHeader: SwDataTableStory = {
  name: "Should render the Table without card header",
  args: {
    title: undefined,
    subtitle: undefined,
    disableSearch: true,
    _remove_primary_toolbar_button_: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitUntilRendered(() => document.body.textContent?.includes("Awesome Concrete Chair"));
    await waitUntilRendered(() => document.body.textContent?.includes("Available"));

    // wait 1 second so that everything is correctly rendered
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await expect(canvas.getAllByText("Awesome Concrete Chair")[0]).toBeInTheDocument();
  },
};

export const VisualTestRenderTableWithScrollShadows: SwDataTableStory = {
  name: "Should render the Table with scroll shadows",
  args: {
    dataSource: [
      {
        id: "bbf41666-d40f-44d1-8d31-49daab4fdc87",
        active: false,
        name: "Aa Render scroll shadows",
        manufacturer: {
          name: "Last manufacturer",
          translated: {
            name: "Last manufacturer",
          },
        },
        translated: {
          name: "Aa Render scroll shadows",
        },
        price: [
          {
            currencyId: '"b7d2554b0ce847cd82f3ac9bd1c0dfca"',
            gross: 774261,
            net: 609992,
            linked: true,
          },
        ],
        stock: 409278,
        available: 202164,
      },
      ...SwDataTableFixtures,
    ],
    columns: [
      ...(meta.args?.columns?.map((column) => {
        return {
          ...column,
          width: 300,
        };
      }) ?? []),
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.body.textContent?.includes("Aa Render scroll shadows"));

    // scroll to middle horizontally and vertically
    const swDataTable = document.querySelector(".sw-data-table__table-wrapper");

    if (!swDataTable) {
      throw new Error("swDataTable not found");
    }

    swDataTable.scrollTop = swDataTable.scrollHeight / 2 - swDataTable.clientHeight / 2;
    swDataTable.scrollLeft = swDataTable.scrollWidth / 2 - swDataTable.clientWidth / 2;

    // wait 1 second so that everything is correctly rendered
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await expect(canvas.getByText("Aa Render scroll shadows")).toBeInTheDocument();
  },
};

export const VisualTestEmitReloadEventOnClickingReload: SwDataTableStory = {
  name: "Emit reload event on clicking reload",
  args: {
    enableReload: true,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.sw-button[aria-label="reload-data"]'));

    const reloadButton = canvas.getByLabelText("reload-data");

    await userEvent.click(reloadButton);

    // wait 1 second so that everything is correctly rendered
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await expect(args.reload).toHaveBeenCalled();
  },
};

export const VisualTestOpenSettingsMenu: SwDataTableStory = {
  name: "Open settings menu with correct popover items inside",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.sw-button[aria-label="reload-data"]'));

    const toggleTableSettingsButton = canvas.getByLabelText("Toggle view settings");

    await userEvent.click(toggleTableSettingsButton);

    await waitUntilRendered(() => document.querySelector(".sw-floating-ui__content"));

    const popover = within(
      document.querySelector('.sw-floating-ui__content[data-show="true"]') as HTMLElement,
    );
    await expect(popover.getByText("Settings")).toBeInTheDocument();
    await expect(popover.getByText("Columns")).toBeInTheDocument();

    await waitUntilRendered(() => !document.querySelector('[class*="popoverTransition"]'));

    await expect(popover.getByText("Reset all changes")).toBeInTheDocument();
  },
};

export const VisualTestOpenColumnSettingsMenu: SwDataTableStory = {
  name: "Open column settings menu",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.sw-button[aria-label="reload-data"]'));

    const toggleTableSettingsButton = canvas.getByRole("button", {
      name: "Toggle view settings",
    });

    await userEvent.click(toggleTableSettingsButton);

    await waitUntilRendered(() =>
      document.querySelector('.sw-floating-ui__content[data-show="true"]'),
    );

    let popover = within(
      document.querySelector('.sw-floating-ui__content[data-show="true"]') as HTMLElement,
    );
    await expect(popover.getByText("Settings")).toBeInTheDocument();

    const columnSettingsPopoverItem = popover.getByText("Columns");

    await userEvent.click(columnSettingsPopoverItem);

    popover = within(
      document.querySelector('.sw-floating-ui__content[data-show="true"]') as HTMLElement,
    );

    await waitUntilRendered(() => document.querySelector(".sw-popover-item-result__group-label"));

    // check if correct items are visible
    await expect(popover.getByText("Shown in table")).toBeInTheDocument();
    await expect(popover.getByText("Hidden in table")).toBeInTheDocument();

    await expect(popover.getAllByText("Columns")[0]).toBeInTheDocument();

    await expect(popover.getByText("Hide all")).toBeInTheDocument();
    await expect(popover.getByText("Show all")).toBeInTheDocument();

    await expect(popover.getByText("Name")).toBeInTheDocument();
    await expect(popover.getByText("Manufacturer")).toBeInTheDocument();
    await expect(popover.getByText("Active")).toBeInTheDocument();
    await expect(popover.getByText("Price")).toBeInTheDocument();
    await expect(popover.getByText("Available")).toBeInTheDocument();
    await expect(popover.getByText("Stock")).toBeInTheDocument();
  },
};

export const VisualTestColumnDragBar: SwDataTableStory = {
  name: "Show the column drag bar on hover",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.sw-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".sw-data-table__table-head-dragzone"));

    const manufacturerColumnDragBar = await canvas.getByTestId(
      "column-dragzone__manufacturer.name",
    );
    // simulate hover because real css hover is not possible in interaction tests
    await manufacturerColumnDragBar.classList.add("simHover");

    const manufacturerDragzoneBar = await canvas.getByTestId(
      "column-dragzone-bar__manufacturer.name",
    );
    // check if scale was set back to 1:1
    await waitFor(async () => {
      await expect(getComputedStyle(manufacturerDragzoneBar)).toHaveProperty(
        "transform",
        "matrix(1, 0, 0, 1, 0, 0)",
      );
    });
  },
};

export const VisualTestColumnDragDropOrdering: SwDataTableStory = {
  name: "Order the columns by drag and drop",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.sw-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".sw-data-table__table-head-dragzone"));

    const manufacturerColumnDragzone = await canvas.getByTestId(
      "column-dragzone__manufacturer.name",
    );
    const priceColumnDropzoneAfter = await canvas.getByTestId("column-dropzone-after__price");

    // drag the "manufacturer" column right to the "price" column
    fireEvent.mouseDown(manufacturerColumnDragzone, {
      buttons: 1,
    });

    // wait 100ms to simulate a real drag
    await new Promise((resolve) => setTimeout(resolve, 100));

    // enter the right dropzone
    fireEvent.mouseEnter(priceColumnDropzoneAfter, {});
    // and drop the column
    fireEvent.mouseUp(priceColumnDropzoneAfter, {});

    // wait 1 second so that everything is correctly rendered
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
};

export const VisualTestColumnSettingsPopover: SwDataTableStory = {
  name: "Show the column settings on click",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.sw-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".sw-data-table__table-head-dragzone"));

    const nameColumnSettingsTrigger = await canvas.getByTestId("column-settings-trigger__name");
    await userEvent.click(nameColumnSettingsTrigger);

    await waitUntilRendered(() =>
      document.querySelector('.sw-data-table__table-head-column-settings[data-show="true"]'),
    );

    const columnSettingsPopover = within(
      document.querySelector(
        '.sw-data-table__table-head-column-settings[data-show="true"]',
      ) as HTMLElement,
    );
    await expect(columnSettingsPopover.getByText("Name")).toBeInTheDocument();
    await expect(columnSettingsPopover.getByText("Sort ascending")).toBeInTheDocument();
    await expect(columnSettingsPopover.getByText("Sort descending")).toBeInTheDocument();
  },
};

export const VisualTestColumnSettingsPopoverWithoutSort: SwDataTableStory = {
  name: "Show the column settings without sort on click",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.sw-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".sw-data-table__table-head-dragzone"));

    const activeColumnSettingsTrigger = await canvas.getByTestId("column-settings-trigger__active");
    await userEvent.click(activeColumnSettingsTrigger);

    await waitUntilRendered(() =>
      document.querySelector('.sw-data-table__table-head-column-settings[data-show="true"]'),
    );

    const columnSettingsPopover = within(
      document.querySelector(
        '.sw-data-table__table-head-column-settings[data-show="true"]',
      ) as HTMLElement,
    );
    await expect(columnSettingsPopover.getByText("Active")).toBeInTheDocument();
  },
};

export const VisualTestDataSortingInColumnSettings: SwDataTableStory = {
  name: "Sort the data by clicking on the column settings",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.sw-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".sw-data-table__table-head-dragzone"));

    const nameColumnSettingsTrigger = await canvas.getByTestId("column-settings-trigger__name");
    await userEvent.click(nameColumnSettingsTrigger);

    await waitUntilRendered(() =>
      document.querySelector('.sw-data-table__table-head-column-settings[data-show="true"]'),
    );

    const columnSettingsPopover = within(
      document.querySelector(
        '.sw-data-table__table-head-column-settings[data-show="true"]',
      ) as HTMLElement,
    );
    await expect(columnSettingsPopover.getByText("Name")).toBeInTheDocument();
    await expect(columnSettingsPopover.getByText("Sort ascending")).toBeInTheDocument();
    await expect(columnSettingsPopover.getByText("Sort descending")).toBeInTheDocument();

    const sortDescendingButton = await columnSettingsPopover.getByText("Sort descending");
    await userEvent.click(sortDescendingButton);

    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    const rowContentName = await canvas.getAllByText("Unbranded Steel Bike");
    await expect(rowContentName.length).toBeGreaterThan(0);
  },
};

// visual testing for loading state with skeleton bars
export const VisualTestRenderSkeleton: SwDataTableStory = {
  name: "Should render the Table with skeleton bars",
  args: {
    isLoading: true,
  },
  play: async () => {
    await waitUntilRendered(() => document.querySelector(".sw-skeleton-bar"));
  },
};

export const VisualTestAddColumnIndicator: SwDataTableStory = {
  name: "Render the add column indicator",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.sw-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".sw-data-table__table-head-dragzone"));

    const tableHeadResizableAfter = await canvas.getByTestId(
      "sw-data-table__table-head-resizable-before__manufacturer.name",
    );
    await userEvent.hover(tableHeadResizableAfter);

    await waitUntilRendered(() =>
      document.querySelector(
        ".sw-floating-ui__content.sw-data-table__table-head-add-column-indicator",
      ),
    );
  },
};

export const VisualTestAddColumnIndicatorPopover: SwDataTableStory = {
  name: "Render the add column indicator popover",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.sw-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".sw-data-table__table-head-dragzone"));

    const tableHeadResizableAfter = await canvas.getByTestId(
      "sw-data-table__table-head-resizable-before__manufacturer.name",
    );
    await userEvent.hover(tableHeadResizableAfter);

    await waitUntilRendered(() =>
      document.querySelector(
        ".sw-floating-ui__content.sw-data-table__table-head-add-column-indicator",
      ),
    );

    const popover = within(
      document.querySelector('.sw-floating-ui__content[data-show="true"]') as HTMLElement,
    );
    const addColumnIndicatorIcon = await popover.getByTestId("add-column-indicator-icon__name");

    await userEvent.click(addColumnIndicatorIcon);
    await waitUntilRendered(() => document.querySelector(".sw-popover-item-result__option"));
  },
};
export const VisualTestAddNewColumn: SwDataTableStory = {
  name: "Add new column with add column indicator popover",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.sw-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".sw-data-table__table-head-dragzone"));

    const tableHeadResizableAfter = await canvas.getByTestId(
      "sw-data-table__table-head-resizable-before__manufacturer.name",
    );
    await userEvent.hover(tableHeadResizableAfter);

    await waitUntilRendered(() =>
      document.querySelector(
        ".sw-floating-ui__content.sw-data-table__table-head-add-column-indicator",
      ),
    );

    let popover = within(
      document.querySelector('.sw-floating-ui__content[data-show="true"]') as HTMLElement,
    );
    const addColumnIndicatorIcon = await popover.getByTestId("add-column-indicator-icon__name");

    await userEvent.click(addColumnIndicatorIcon);
    await waitUntilRendered(() => document.querySelector(".sw-popover-item-result__option"));

    popover = within(document.querySelector(".sw-floating-ui__content.sw-popover") as HTMLElement);
    const stockOption = await popover.getByText("Stock");

    await userEvent.click(stockOption);

    const columnSettingsTriggerStock = await canvas.getByTestId("column-settings-trigger__stock");

    await waitUntilRendered(
      () =>
        document.querySelectorAll(
          ".sw-floating-ui__content.sw-data-table__table-head-add-column-indicator",
        ).length === 0,
    );
    await expect(columnSettingsTriggerStock).toBeInTheDocument();
  },
};

export const VisualTestHideOutlines: SwDataTableStory = {
  name: "Should render the Table without outlines",
  args: {
    showOutlines: false,
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await expect(canvas.getByText("Awesome Concrete Chair")).toBeInTheDocument();
  },
};

export const VisualTestHideStripes: SwDataTableStory = {
  name: "Should render the Table without stripes",
  args: {
    showStripes: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await expect(canvas.getByText("Awesome Concrete Chair")).toBeInTheDocument();
  },
};

export const VisualTestBlankTable: SwDataTableStory = {
  name: "Should render the Table without stripes and outlines",
  args: {
    showOutlines: false,
    showStripes: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await expect(canvas.getByText("Awesome Concrete Chair")).toBeInTheDocument();
  },
};

export const VisualTestEnableRowNumbering: SwDataTableStory = {
  name: "Should render the Table with row numbering",
  args: {
    enableRowNumbering: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    await expect(canvas.getByText("Awesome Concrete Chair")).toBeInTheDocument();
  },
};
