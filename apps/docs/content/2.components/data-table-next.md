---
title: Data Table Next
description: A data-driven table with sorting, pagination, and row selection, built on TanStack Table.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="data-table-next-basic-example" fullWidth}
::

## Usage

**Data Table Next** renders rows from `data` and columns from `columns`, with the same style as [**Table**](/components/table). It stays a plain table by default. Bind `v-model:sorting`, `v-model:pagination`, or `v-model:row-selection` to turn on the features you need. It sorts and pages the rows itself, or shows rows your app has already sorted and paged, for example on the server.

```ts
import {
  MtDataTableNext,
  type MtDataTableNextColumn,
} from "@shopware-ag/meteor-component-library";
```

Columns are [TanStack Table column definitions](https://tanstack.com/table/latest/docs/guide/column-defs). Most columns only need `accessorKey` and `header`:

```ts
const columns: MtDataTableNextColumn<Product>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "stock", header: "Stock", meta: { align: "end" } },
];
```

## Examples

### Custom cells

Use the `#cell-<column id>` slot to render a cell with other components, and `#header-<column id>` for its header. The slots receive the row, so `row.original` is the item from `data`.

::component-example{name="data-table-next-custom-cells-example" fullWidth}
::

### Sorting

Bind `v-model:sorting` to make the headers sortable. Set `enableSorting: false` on columns that should not be sorted.

::component-example{name="data-table-next-sorting-example" fullWidth}
::

### Pagination

Bind `v-model:pagination` to show one page of rows with page controls below the table.

::component-example{name="data-table-next-pagination-example" fullWidth}
::

### Server-side data

Set `manual` when your app sorts and pages the data, for example through an API. Load the rows whenever the sorting or the page changes, and pass the total with `row-count`.

::component-example{name="data-table-next-server-side-example" fullWidth}
::

### Row selection

Bind `v-model:row-selection` to add a checkbox to every row and a checkbox in the header that selects all rows of the page.

::component-example{name="data-table-next-row-selection-example" fullWidth}
::

### Sticky header

Limit the height of the table to scroll the rows below a sticky header.

::component-example{name="data-table-next-sticky-header-example" fullWidth}
::

### Loading

Set `loading` to show placeholder rows while data loads.

::component-example{name="data-table-next-loading-example" fullWidth}
::

### Empty state

The table shows "No results" when there are no rows. Use the `#empty` slot to show your own message.

::component-example{name="data-table-next-empty-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Name the table with `aria-label` or `aria-labelledby`.
- Give rows a stable `id`, or pass `get-row-id`, so row selection keeps working when the data changes.
- Align numbers and prices with `meta: { align: "end" }`.
- Replace the `data` array to update the table, for example `products.value = newProducts`.
- Use `manual` with `row-count` when the data comes from a paginated API.

#dont

- Do not change the `data` array in place with `push` or `splice`. The table does not see these changes.
- Do not bind a feature's `v-model` when users do not need the feature. Every bound model adds controls to the table.
- Do not use **Data Table Next** for small static tables. Use [**Table**](/components/table) instead.

::

## Behavior

- **Features follow the bound models.** Without `v-model:sorting`, `v-model:pagination`, or `v-model:row-selection`, the table only renders rows. Binding a model turns on its feature and keeps its state in sync with your app.
- **Column ids.** A column's id is its `id`, or its `accessorKey` with dots replaced by underscores. The slots use this id: `accessorKey: "price.gross"` renders through `#cell-price_gross`.
- **Sorting.** Clicking a sortable header sorts ascending, a second click sorts descending, and a third click removes the sorting. Text columns start ascending, number columns start descending. One column is sorted at a time.
- **Pagination.** The page controls show the range of rows, the page, and the number of rows per page. Changing the number of rows per page goes back to the first page.
- **Manual mode.** With `manual`, the table renders `data` as given and only reports the new sorting and page through the models. Your app loads the matching rows and passes the total number of rows with `row-count`.
- **Row selection.** Row ids default to each item's `id` and fall back to the row index. The header checkbox selects or clears all rows of the current page. Selected rows stay selected when the page changes.
- **Loading.** While `loading` is set, placeholder rows replace the rows. The table keeps its number of rows, or shows one page of placeholders when it has no rows yet (five without pagination).
- **Height.** The table fills the width of its container. When you limit its height, the rows scroll below the sticky header and the page controls stay visible.

## Accessibility

- The table renders a native `<table>`. Attributes such as `aria-label` and `aria-labelledby` are set on the `<table>`, so they name it for screen readers.
- Sortable headers are buttons. Tab moves between them, and Enter or Space changes the sorting. The sorted column announces its direction through `aria-sort`.
- Row and header checkboxes have accessible names ("Select row", "Select all rows on this page"). The header checkbox shows a mixed state when only some rows of the page are selected.
- While `loading` is set, the table is marked as busy with `aria-busy`.

## Related components

- [**Table**](/components/table): when you write a small, static table by hand.
- [**Data Table**](/components/data-table): the current data table with filters, column settings, and bulk actions.
