import meta  from './sw-data-table.stories';
import SwDataTableFixtures from './sw-data-table.fixtures.json';
import { waitUntilRendered } from '../../../_internal/test-helper';
import {
  within,
  userEvent,
  waitFor,
  fireEvent,
} from '@storybook/testing-library';
import { expect } from '@storybook/jest';

export default {
  ...meta,
  title: 'Interaction Tests/Table and list/sw-data-table',
};

export const VisualTestRenderTable = {
  name: 'Should render the Table',
};

export const VisualTestRenderFullTable = {
  name: 'Should render the full Table',
  args: {
    layout: 'full',
  },
};

export const VisualTestRenderEmptyState = {
  name: 'Should render the empty state',
  args: {
    dataSource: [],
  },
};

export const VisualTestRenderTableStickyHeader = {
  name: 'Should render the Table with sticky header',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitUntilRendered(() =>
        document.body.textContent.includes('Gorgeous Wooden Ball'),
    );
    await waitUntilRendered(() =>
        document.body.textContent.includes('Available'),
    );

    // wait until everything is correctly rendered
    const dataTable = document.querySelector('.sw-data-table');
    await dataTable.parentElement.__vue__.$nextTick();

    // scroll to bottom
    const swDataTable = document.querySelector('.sw-data-table__table-wrapper');
    swDataTable.scrollTop = swDataTable.scrollHeight;

    expect(canvas.getByText('Gorgeous Wooden Ball')).toBeInTheDocument();
  },
};

export const VisualTestRenderTableWithoutCardHeader = {
  name: 'Should render the Table without card header',
  args: {
    title: undefined,
    subtitle: undefined,
    disableSearch: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitUntilRendered(() =>
        document.body.textContent.includes('Awesome Concrete Chair'),
    );
    await waitUntilRendered(() =>
        document.body.textContent.includes('Available'),
    );

    // wait until everything is correctly rendered
    const dataTable = document.querySelector('.sw-data-table');
    await dataTable.parentElement.__vue__.$nextTick();

    expect(
        canvas.getAllByText('Awesome Concrete Chair')[0],
    ).toBeInTheDocument();
  },
};

export const VisualTestRenderTableWithScrollShadows = {
  name: 'Should render the Table with scroll shadows',
  args: {
    dataSource: [
      {
        id: 'bbf41666-d40f-44d1-8d31-49daab4fdc87',
        active: false,
        name: 'Aa Render scroll shadows',
        manufacturer: {
          name: 'Last manufacturer',
          translated: {
            name: 'Last manufacturer',
          },
        },
        translated: {
          name: 'Aa Render scroll shadows',
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
      ...meta.args.columns.map((column) => {
        return {
          ...column,
          width: 300,
        };
      }),
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    await waitUntilRendered(() =>
        document.body.textContent.includes('Aa Render scroll shadows'),
    );

    // scroll to middle horizontally and vertically
    const swDataTable = document.querySelector('.sw-data-table__table-wrapper');
    swDataTable.scrollTop =
        swDataTable.scrollHeight / 2 - swDataTable.clientHeight / 2;
    swDataTable.scrollLeft =
        swDataTable.scrollWidth / 2 - swDataTable.clientWidth / 2;

    // wait until everything is correctly rendered
    const dataTable = document.querySelector('.sw-data-table');
    await dataTable.parentElement.__vue__.$nextTick();

    expect(canvas.getByText('Aa Render scroll shadows')).toBeInTheDocument();
  },
};

export const VisualTestEmitReloadEventOnClickingReload = {
  name: 'Emit reload event on clicking reload',
  args: {
    enableReload: true,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    await waitUntilRendered(() =>
        document.querySelector('.sw-button[aria-label="reload-data"]'),
    );

    const reloadButton = canvas.getByLabelText('reload-data');

    await userEvent.click(reloadButton);

    // wait until everything is correctly rendered
    const dataTable = document.querySelector('.sw-data-table');
    await dataTable.parentElement.__vue__.$nextTick();
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    await expect(args.reload).toHaveBeenCalled();
  },
};

export const VisualTestOpenSettingsMenu = {
  name: 'Open settings menu with correct popover items inside',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    await waitUntilRendered(() =>
        document.querySelector('.sw-button[aria-label="reload-data"]'),
    );

    const toggleTableSettingsButton = canvas.getByLabelText(
        'Toggle view settings',
    );

    await userEvent.click(toggleTableSettingsButton);

    await waitUntilRendered(() =>
        document.querySelector('.sw-floating-ui__content'),
    );

    const popover = within(
        document.querySelector('.sw-floating-ui__content[data-show="true"]'),
    );
    expect(popover.getByText('Settings')).toBeInTheDocument();
    expect(popover.getByText('Columns')).toBeInTheDocument();

    await waitUntilRendered(
        () => !document.querySelector('[class*="popoverTransition"]'),
    );

    expect(popover.getByText('Reset all changes')).toBeInTheDocument();
  },
};

export const VisualTestOpenColumnSettingsMenu = {
  name: 'Open column settings menu',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    await waitUntilRendered(() =>
        document.querySelector('.sw-button[aria-label="reload-data"]'),
    );

    const toggleTableSettingsButton = canvas.getByRole('button', {
      name: 'Toggle view settings',
    });

    await userEvent.click(toggleTableSettingsButton);

    await waitUntilRendered(() =>
        document.querySelector('.sw-floating-ui__content[data-show="true"]'),
    );

    let popover = within(
        document.querySelector('.sw-floating-ui__content[data-show="true"]'),
    );
    expect(popover.getByText('Settings')).toBeInTheDocument();

    const columnSettingsPopoverItem = popover.getByText('Columns');

    await userEvent.click(columnSettingsPopoverItem);

    popover = within(
        document.querySelector('.sw-floating-ui__content[data-show="true"]'),
    );

    await waitUntilRendered(() =>
        document.querySelector('.sw-popover-item-result__group-label'),
    );

    // check if correct items are visible
    expect(popover.getByText('Shown in table')).toBeInTheDocument();
    expect(popover.getByText('Hidden in table')).toBeInTheDocument();

    expect(popover.getAllByText('Columns')[0]).toBeInTheDocument();

    expect(popover.getByText('Hide all')).toBeInTheDocument();
    expect(popover.getByText('Show all')).toBeInTheDocument();

    expect(popover.getByText('Name')).toBeInTheDocument();
    expect(popover.getByText('Manufacturer')).toBeInTheDocument();
    expect(popover.getByText('Active')).toBeInTheDocument();
    expect(popover.getByText('Price')).toBeInTheDocument();
    expect(popover.getByText('Available')).toBeInTheDocument();
    expect(popover.getByText('Stock')).toBeInTheDocument();
  },
};

export const VisualTestColumnDragBar = {
  name: 'Show the column drag bar on hover',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    await waitUntilRendered(() =>
        document.querySelector('.sw-button[aria-label="reload-data"]'),
    );
    await waitUntilRendered(() =>
        document.querySelector('.sw-data-table__table-head-dragzone'),
    );

    const manufacturerColumnDragBar = await canvas.getByTestId(
        'column-dragzone__manufacturer.name',
    );
    // simulate hover because real css hover is not possible in interaction tests
    await manufacturerColumnDragBar.classList.add('simHover');

    const manufacturerDragzoneBar = await canvas.getByTestId(
        'column-dragzone-bar__manufacturer.name',
    );
    // check if scale was set back to 1:1
    await waitFor(async () => {
      await expect(getComputedStyle(manufacturerDragzoneBar)).toHaveProperty(
          'transform',
          'matrix(1, 0, 0, 1, 0, 0)',
      );
    });
  },
};

export const VisualTestColumnDragDropOrdering = {
  name: 'Order the columns by drag and drop',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    await waitUntilRendered(() =>
        document.querySelector('.sw-button[aria-label="reload-data"]'),
    );
    await waitUntilRendered(() =>
        document.querySelector('.sw-data-table__table-head-dragzone'),
    );

    const manufacturerColumnDragzone = await canvas.getByTestId(
        'column-dragzone__manufacturer.name',
    );
    const priceColumnDropzoneAfter = await canvas.getByTestId(
        'column-dropzone-after__price',
    );

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

    // wait until everything is correctly rendered
    const dataTable = document.querySelector('.sw-data-table');
    await dataTable.parentElement.__vue__.$nextTick();
  },
};

export const VisualTestColumnSettingsPopover = {
  name: 'Show the column settings on click',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    await waitUntilRendered(() =>
        document.querySelector('.sw-button[aria-label="reload-data"]'),
    );
    await waitUntilRendered(() =>
        document.querySelector('.sw-data-table__table-head-dragzone'),
    );

    const nameColumnSettingsTrigger = await canvas.getByTestId(
        'column-settings-trigger__name',
    );
    await userEvent.click(nameColumnSettingsTrigger);

    await waitUntilRendered(() =>
        document.querySelector(
            '.sw-data-table__table-head-column-settings[data-show="true"]',
        ),
    );

    const columnSettingsPopover = within(
        document.querySelector(
            '.sw-data-table__table-head-column-settings[data-show="true"]',
        ),
    );
    expect(columnSettingsPopover.getByText('Name')).toBeInTheDocument();
    expect(
        columnSettingsPopover.getByText('Sort ascending'),
    ).toBeInTheDocument();
    expect(
        columnSettingsPopover.getByText('Sort descending'),
    ).toBeInTheDocument();
  },
};

export const VisualTestColumnSettingsPopoverWithoutSort = {
  name: 'Show the column settings without sort on click',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    await waitUntilRendered(() =>
        document.querySelector('.sw-button[aria-label="reload-data"]'),
    );
    await waitUntilRendered(() =>
        document.querySelector('.sw-data-table__table-head-dragzone'),
    );

    const activeColumnSettingsTrigger = await canvas.getByTestId(
        'column-settings-trigger__active',
    );
    await userEvent.click(activeColumnSettingsTrigger);

    await waitUntilRendered(() =>
        document.querySelector(
            '.sw-data-table__table-head-column-settings[data-show="true"]',
        ),
    );

    const columnSettingsPopover = within(
        document.querySelector(
            '.sw-data-table__table-head-column-settings[data-show="true"]',
        ),
    );
    expect(columnSettingsPopover.getByText('Active')).toBeInTheDocument();
  },
};

export const VisualTestDataSortingInColumnSettings = {
  name: 'Sort the data by clicking on the column settings',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    await waitUntilRendered(() =>
        document.querySelector('.sw-button[aria-label="reload-data"]'),
    );
    await waitUntilRendered(() =>
        document.querySelector('.sw-data-table__table-head-dragzone'),
    );

    const nameColumnSettingsTrigger = await canvas.getByTestId(
        'column-settings-trigger__name',
    );
    await userEvent.click(nameColumnSettingsTrigger);

    await waitUntilRendered(() =>
        document.querySelector(
            '.sw-data-table__table-head-column-settings[data-show="true"]',
        ),
    );

    const columnSettingsPopover = within(
        document.querySelector(
            '.sw-data-table__table-head-column-settings[data-show="true"]',
        ),
    );
    expect(columnSettingsPopover.getByText('Name')).toBeInTheDocument();
    expect(
        columnSettingsPopover.getByText('Sort ascending'),
    ).toBeInTheDocument();
    expect(
        columnSettingsPopover.getByText('Sort descending'),
    ).toBeInTheDocument();

    const sortDescendingButton =
        await columnSettingsPopover.getByText('Sort descending');
    await userEvent.click(sortDescendingButton);

    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    const rowContentName = await canvas.getAllByText('Unbranded Steel Bike');
    expect(rowContentName.length).toBeGreaterThan(0);
  },
};

// visual testing for loading state with skeleton bars
export const VisualTestRenderSkeleton = {
  name: 'Should render the Table with skeleton bars',
  args: {
    isLoading: true,
  },
  play: async () => {
    await waitUntilRendered(() => document.querySelector('.sw-skeleton-bar'));
  },
};

export const VisualTestAddColumnIndicator = {
  name: 'Render the add column indicator',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    await waitUntilRendered(() =>
        document.querySelector('.sw-button[aria-label="reload-data"]'),
    );
    await waitUntilRendered(() =>
        document.querySelector('.sw-data-table__table-head-dragzone'),
    );

    const tableHeadResizableAfter = await canvas.getByTestId(
        'sw-data-table__table-head-resizable-before__manufacturer.name',
    );
    await userEvent.hover(tableHeadResizableAfter);

    await waitUntilRendered(() =>
        document.querySelector(
            '.sw-floating-ui__content.sw-data-table__table-head-add-column-indicator',
        ),
    );
  },
};

export const VisualTestAddColumnIndicatorPopover = {
  name: 'Render the add column indicator popover',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    await waitUntilRendered(() =>
        document.querySelector('.sw-button[aria-label="reload-data"]'),
    );
    await waitUntilRendered(() =>
        document.querySelector('.sw-data-table__table-head-dragzone'),
    );

    const tableHeadResizableAfter = await canvas.getByTestId(
        'sw-data-table__table-head-resizable-before__manufacturer.name',
    );
    await userEvent.hover(tableHeadResizableAfter);

    await waitUntilRendered(() =>
        document.querySelector(
            '.sw-floating-ui__content.sw-data-table__table-head-add-column-indicator',
        ),
    );

    let popover = within(
        document.querySelector('.sw-floating-ui__content[data-show="true"]'),
    );
    const addColumnIndicatorIcon = await popover.getByTestId(
        'add-column-indicator-icon__name',
    );

    await userEvent.click(addColumnIndicatorIcon);
    await waitUntilRendered(() =>
        document.querySelector('.sw-popover-item-result__option'),
    );
  },
};
export const VisualTestAddNewColumn = {
  name: 'Add new column with add column indicator popover',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    await waitUntilRendered(() =>
        document.querySelector('.sw-button[aria-label="reload-data"]'),
    );
    await waitUntilRendered(() =>
        document.querySelector('.sw-data-table__table-head-dragzone'),
    );

    const tableHeadResizableAfter = await canvas.getByTestId(
        'sw-data-table__table-head-resizable-before__manufacturer.name',
    );
    await userEvent.hover(tableHeadResizableAfter);

    await waitUntilRendered(() =>
        document.querySelector(
            '.sw-floating-ui__content.sw-data-table__table-head-add-column-indicator',
        ),
    );

    let popover = within(
        document.querySelector('.sw-floating-ui__content[data-show="true"]'),
    );
    const addColumnIndicatorIcon = await popover.getByTestId(
        'add-column-indicator-icon__name',
    );

    await userEvent.click(addColumnIndicatorIcon);
    await waitUntilRendered(() =>
        document.querySelector('.sw-popover-item-result__option'),
    );

    popover = within(
        document.querySelector('.sw-floating-ui__content.sw-popover'),
    );
    const stockOption = await popover.getByText('Stock');

    await userEvent.click(stockOption);

    const columnSettingsTriggerStock = await canvas.getByTestId(
        'column-settings-trigger__stock',
    );

    await waitUntilRendered(
        () =>
            document.querySelectorAll(
                '.sw-floating-ui__content.sw-data-table__table-head-add-column-indicator',
            ).length === 0,
    );
    expect(columnSettingsTriggerStock).toBeInTheDocument();
  },
};

export const VisualTestHideOutlines = {
  name: 'Should render the Table without outlines',
  args: {
    showOutlines: false,
  },
  async play({ canvasElement }) {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    expect(canvas.getByText('Awesome Concrete Chair')).toBeInTheDocument();
  },
};

export const VisualTestHideStripes = {
  name: 'Should render the Table without stripes',
  args: {
    showStripes: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    expect(canvas.getByText('Awesome Concrete Chair')).toBeInTheDocument();
  },
};

export const VisualTestBlankTable = {
  name: 'Should render the Table without stripes and outlines',
  args: {
    showOutlines: false,
    showStripes: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    expect(canvas.getByText('Awesome Concrete Chair')).toBeInTheDocument();
  },
};

export const VisualTestEnableRowNumbering = {
  name: 'Should render the Table with row numbering',
  args: {
    enableRowNumbering: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitUntilRendered(
        () => document.querySelectorAll('.sw-skeleton-bar').length === 0,
    );

    expect(canvas.getByText('Awesome Concrete Chair')).toBeInTheDocument();
  },
};
