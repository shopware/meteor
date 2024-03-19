import meta, { type MtDataTableMeta, type MtDataTableStory } from "./mt-data-table.stories";
import MtDataTableFixtures from "./mt-data-table.fixtures.json";
import { waitUntilRendered } from "../../../_internal/test-helper";
import { within, userEvent, waitFor, fireEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

export default {
  ...meta,
  title: "Interaction Tests/Table and list/mt-data-table",
} as MtDataTableMeta;

export const VisualTestRenderTable: MtDataTableStory = {
  name: "Should render the Table",
};

export const VisualTestRenderFullTable: MtDataTableStory = {
  name: "Should render the full Table",
  args: {
    layout: "full",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => {
      return document.querySelector(".mt-data-table-text-renderer");
    });

    await expect(canvas.getByText("Awesome Concrete Chair")).toBeInTheDocument();
  },
};

export const VisualTestRenderEmptyState: MtDataTableStory = {
  name: "Should render the empty state",
  args: {
    dataSource: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitUntilRendered(() => {
      return document.querySelector(".mt-empty-state");
    });

    await expect(canvas.getByText("Add your first item")).toBeInTheDocument();
  },
};

export const VisualTestRenderTableStickyHeader: MtDataTableStory = {
  name: "Should render the Table with sticky header",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitUntilRendered(() => document.body.textContent?.includes("Gorgeous Wooden Ball"));
    await waitUntilRendered(() => document.body.textContent?.includes("Available"));

    // wait 1 second so that everything is correctly rendered
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // scroll to bottom
    const MtDataTable = document.querySelector(".mt-data-table__table-wrapper");

    if (!MtDataTable) {
      throw new Error("MtDataTable not found");
    }

    MtDataTable.scrollTop = MtDataTable.scrollHeight;

    await expect(canvas.getByText("Gorgeous Wooden Ball")).toBeInTheDocument();
  },
};

export const VisualTestRenderTableWithoutCardHeader: MtDataTableStory = {
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

export const VisualTestRenderTableWithScrollShadows: MtDataTableStory = {
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
      ...MtDataTableFixtures,
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
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.body.textContent?.includes("Aa Render scroll shadows"));

    // scroll to middle horizontally and vertically
    const MtDataTable = document.querySelector(".mt-data-table__table-wrapper");

    if (!MtDataTable) {
      throw new Error("MtDataTable not found");
    }

    MtDataTable.scrollTop = MtDataTable.scrollHeight / 2 - MtDataTable.clientHeight / 2;
    MtDataTable.scrollLeft = MtDataTable.scrollWidth / 2 - MtDataTable.clientWidth / 2;

    // wait 1 second so that everything is correctly rendered
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await expect(canvas.getByText("Aa Render scroll shadows")).toBeInTheDocument();
  },
};

export const VisualTestEmitReloadEventOnClickingReload: MtDataTableStory = {
  name: "Emit reload event on clicking reload",
  args: {
    enableReload: true,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.mt-button[aria-label="reload-data"]'));

    const reloadButton = canvas.getByLabelText("reload-data");

    await userEvent.click(reloadButton);

    // wait 1 second so that everything is correctly rendered
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await expect(args.reload).toHaveBeenCalled();
  },
};

export const VisualTestOpenSettingsMenu: MtDataTableStory = {
  name: "Open settings menu with correct popover items inside",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.mt-button[aria-label="reload-data"]'));

    const toggleTableSettingsButton = canvas.getByLabelText("Toggle view settings");

    await userEvent.click(toggleTableSettingsButton);

    await waitUntilRendered(() => document.querySelector(".mt-floating-ui__content"));

    const popover = within(
      document.querySelector('.mt-floating-ui__content[data-show="true"]') as HTMLElement,
    );
    await expect(popover.getByText("Settings")).toBeInTheDocument();
    await expect(popover.getByText("Columns")).toBeInTheDocument();

    await waitUntilRendered(() => !document.querySelector('[class*="popoverTransition"]'));

    await expect(popover.getByText("Reset all changes")).toBeInTheDocument();
  },
};

export const VisualTestOpenColumnSettingsMenu: MtDataTableStory = {
  name: "Open column settings menu",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.mt-button[aria-label="reload-data"]'));

    const toggleTableSettingsButton = canvas.getByRole("button", {
      name: "Toggle view settings",
    });

    await userEvent.click(toggleTableSettingsButton);

    await waitUntilRendered(() =>
      document.querySelector('.mt-floating-ui__content[data-show="true"]'),
    );

    let popover = within(
      document.querySelector('.mt-floating-ui__content[data-show="true"]') as HTMLElement,
    );
    await expect(popover.getByText("Settings")).toBeInTheDocument();

    const columnSettingsPopoverItem = popover.getByText("Columns");

    await userEvent.click(columnSettingsPopoverItem);

    popover = within(
      document.querySelector('.mt-floating-ui__content[data-show="true"]') as HTMLElement,
    );

    await waitUntilRendered(() => document.querySelector(".mt-popover-item-result__group-label"));

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

export const VisualTestColumnDragBar: MtDataTableStory = {
  name: "Show the column drag bar on hover",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.mt-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".mt-data-table__table-head-dragzone"));

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

export const VisualTestColumnDragDropOrdering: MtDataTableStory = {
  name: "Order the columns by drag and drop",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.mt-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".mt-data-table__table-head-dragzone"));

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

export const VisualTestColumnSettingsPopover: MtDataTableStory = {
  name: "Show the column settings on click",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.mt-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".mt-data-table__table-head-dragzone"));

    const nameColumnSettingsTrigger = await canvas.getByTestId("column-settings-trigger__name");
    await userEvent.click(nameColumnSettingsTrigger);

    await waitUntilRendered(() =>
      document.querySelector('.mt-data-table__table-head-column-settings[data-show="true"]'),
    );

    const columnSettingsPopover = within(
      document.querySelector(
        '.mt-data-table__table-head-column-settings[data-show="true"]',
      ) as HTMLElement,
    );
    await expect(columnSettingsPopover.getByText("Name")).toBeInTheDocument();
    await expect(columnSettingsPopover.getByText("Sort ascending")).toBeInTheDocument();
    await expect(columnSettingsPopover.getByText("Sort descending")).toBeInTheDocument();
  },
};

export const VisualTestColumnSettingsPopoverWithoutSort: MtDataTableStory = {
  name: "Show the column settings without sort on click",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.mt-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".mt-data-table__table-head-dragzone"));

    const activeColumnSettingsTrigger = await canvas.getByTestId("column-settings-trigger__active");
    await userEvent.click(activeColumnSettingsTrigger);

    await waitUntilRendered(() =>
      document.querySelector('.mt-data-table__table-head-column-settings[data-show="true"]'),
    );

    const columnSettingsPopover = within(
      document.querySelector(
        '.mt-data-table__table-head-column-settings[data-show="true"]',
      ) as HTMLElement,
    );
    await expect(columnSettingsPopover.getByText("Active")).toBeInTheDocument();
  },
};

export const VisualTestDataSortingInColumnSettings: MtDataTableStory = {
  name: "Sort the data by clicking on the column settings",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.mt-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".mt-data-table__table-head-dragzone"));

    const nameColumnSettingsTrigger = await canvas.getByTestId("column-settings-trigger__name");
    await userEvent.click(nameColumnSettingsTrigger);

    await waitUntilRendered(() =>
      document.querySelector('.mt-data-table__table-head-column-settings[data-show="true"]'),
    );

    const columnSettingsPopover = within(
      document.querySelector(
        '.mt-data-table__table-head-column-settings[data-show="true"]',
      ) as HTMLElement,
    );
    await expect(columnSettingsPopover.getByText("Name")).toBeInTheDocument();
    await expect(columnSettingsPopover.getByText("Sort ascending")).toBeInTheDocument();
    await expect(columnSettingsPopover.getByText("Sort descending")).toBeInTheDocument();

    const sortDescendingButton = await columnSettingsPopover.getByText("Sort descending");
    await userEvent.click(sortDescendingButton);

    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    const rowContentName = await canvas.getAllByText("Unbranded Steel Bike");
    await expect(rowContentName.length).toBeGreaterThan(0);
  },
};

// visual testing for loading state with skeleton bars
export const VisualTestRenderSkeleton: MtDataTableStory = {
  name: "Should render the Table with skeleton bars",
  args: {
    isLoading: true,
  },
  play: async () => {
    await waitUntilRendered(() => document.querySelector(".mt-skeleton-bar"));
  },
};

export const VisualTestAddColumnIndicator: MtDataTableStory = {
  name: "Render the add column indicator",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.mt-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".mt-data-table__table-head-dragzone"));

    const tableHeadResizableAfter = await canvas.getByTestId(
      "mt-data-table__table-head-resizable-before__manufacturer.name",
    );
    await userEvent.hover(tableHeadResizableAfter);

    await waitUntilRendered(() =>
      document.querySelector(
        ".mt-floating-ui__content.mt-data-table__table-head-add-column-indicator",
      ),
    );
  },
};

export const VisualTestAddColumnIndicatorPopover: MtDataTableStory = {
  name: "Render the add column indicator popover",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.mt-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".mt-data-table__table-head-dragzone"));

    const tableHeadResizableAfter = await canvas.getByTestId(
      "mt-data-table__table-head-resizable-before__manufacturer.name",
    );
    await userEvent.hover(tableHeadResizableAfter);

    await waitUntilRendered(() =>
      document.querySelector(
        ".mt-floating-ui__content.mt-data-table__table-head-add-column-indicator",
      ),
    );

    const popover = within(
      document.querySelector('.mt-floating-ui__content[data-show="true"]') as HTMLElement,
    );
    const addColumnIndicatorIcon = await popover.getByTestId("add-column-indicator-icon__name");

    await userEvent.click(addColumnIndicatorIcon);
    await waitUntilRendered(() => document.querySelector(".mt-popover-item-result__option"));
  },
};
export const VisualTestAddNewColumn: MtDataTableStory = {
  name: "Add new column with add column indicator popover",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await waitUntilRendered(() => document.querySelector('.mt-button[aria-label="reload-data"]'));
    await waitUntilRendered(() => document.querySelector(".mt-data-table__table-head-dragzone"));

    const tableHeadResizableAfter = await canvas.getByTestId(
      "mt-data-table__table-head-resizable-before__manufacturer.name",
    );
    await userEvent.hover(tableHeadResizableAfter);

    await waitUntilRendered(() =>
      document.querySelector(
        ".mt-floating-ui__content.mt-data-table__table-head-add-column-indicator",
      ),
    );

    let popover = within(
      document.querySelector('.mt-floating-ui__content[data-show="true"]') as HTMLElement,
    );
    const addColumnIndicatorIcon = await popover.getByTestId("add-column-indicator-icon__name");

    await userEvent.click(addColumnIndicatorIcon);
    await waitUntilRendered(() => document.querySelector(".mt-popover-item-result__option"));

    popover = within(document.querySelector(".mt-floating-ui__content.mt-popover") as HTMLElement);
    const stockOption = await popover.getByText("Stock");

    await userEvent.click(stockOption);

    const columnSettingsTriggerStock = await canvas.getByTestId("column-settings-trigger__stock");

    await waitUntilRendered(
      () =>
        document.querySelectorAll(
          ".mt-floating-ui__content.mt-data-table__table-head-add-column-indicator",
        ).length === 0,
    );
    await expect(columnSettingsTriggerStock).toBeInTheDocument();
  },
};

export const VisualTestHideOutlines: MtDataTableStory = {
  name: "Should render the Table without outlines",
  args: {
    showOutlines: false,
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await expect(canvas.getByText("Awesome Concrete Chair")).toBeInTheDocument();
  },
};

export const VisualTestHideStripes: MtDataTableStory = {
  name: "Should render the Table without stripes",
  args: {
    showStripes: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await expect(canvas.getByText("Awesome Concrete Chair")).toBeInTheDocument();
  },
};

export const VisualTestBlankTable: MtDataTableStory = {
  name: "Should render the Table without stripes and outlines",
  args: {
    showOutlines: false,
    showStripes: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await expect(canvas.getByText("Awesome Concrete Chair")).toBeInTheDocument();
  },
};

export const VisualTestEnableRowNumbering: MtDataTableStory = {
  name: "Should render the Table with row numbering",
  args: {
    enableRowNumbering: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(() => document.querySelectorAll(".mt-skeleton-bar").length === 0);

    await expect(canvas.getByText("Awesome Concrete Chair")).toBeInTheDocument();
  },
};

export const EmitOpenDetailsEventOnClickingEdit: SwDataTableStory = {
  name: "Emit open details event on clicking edit",
  args: {
    disableEdit: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    const editLink = canvas.getAllByText("Edit")[0];

    await userEvent.click(editLink);
    
    await expect(args.openDetails).toHaveBeenCalled();
  },
};

export const EmitItemDeleteEventOnClickingDelete: SwDataTableStory = {
  name: "Emit item delete event on clicking delete",
  args: {
    disableDelete: false,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await waitUntilRendered(() => document.querySelectorAll(".sw-skeleton-bar").length === 0);

    const contextButton = canvas.getAllByLabelText("Context menu")[0];

    await userEvent.click(contextButton);

    const popover = within(
      document.querySelector('.sw-floating-ui__content[data-show="true"]') as HTMLElement,
    );

    const deleteOption = popover.getByText("Delete");

    await userEvent.click(deleteOption);

    await expect(args.itemDelete).toHaveBeenCalled();
  },
};