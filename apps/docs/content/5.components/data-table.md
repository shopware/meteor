---
title: Data Table
description: A flexible table for displaying large datasets with pagination, sorting, filtering, and row selection.
---

## Import

```ts
import { MtDataTable } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Data Table** to present large, structured datasets in rows and columns.
- Define each column through a configuration object that sets its label, data property, renderer, and position.
- Drive the table entirely through props and react to its events; it holds no internal data state.
- Use pagination, sorting, filtering, and search to help users work through large result sets.
- Use row selection and bulk actions when users need to act on several rows at once.
- Use the `caption` prop to give screen readers a descriptive summary of the table.

## Examples

### Basic

::component-example{name="data-table-basic-example"}
::

### Full width

The `full` layout lets the table span the available width instead of sitting in a centered card.

::component-example{name="data-table-full-width-example"}
::

### Empty state

When the data source is empty, the table shows a built-in empty state.

::component-example{name="data-table-empty-state-example"}
::

### Sticky header

The column header stays in view while the rows scroll.

::component-example{name="data-table-sticky-header-example"}
::

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Provide a unique `id` field for every row in the data source.
- Use increments of 100 for column positions to leave room for inserting columns later.
- Enable sorting only on columns where it is meaningful.
- Use server-side pagination and keep the current page's data source small for large datasets.
- Show the loading state while data is being fetched.
- Set the `caption` prop to describe the table for screen readers.

#dont

- Do not expect the table to manage its own data, sorting, or pagination state.
- Do not load an entire large dataset into the data source at once.
- Do not offer long or irrelevant filter option lists.

::

## Behavior

- **Data Table** is a dumb component: it renders data and emits events but keeps no internal state.
- All data and UI state, including current page, page size, sort column and direction, applied filters, search term, and selected rows, must be provided through props.
- User interactions such as sorting, filtering, pagination, search, and selection emit events that the parent must handle to update the data.
- Set `isLoading` to true while fetching data so the table shows skeleton placeholders, then set it back to false when the data arrives.
- When data management is repeated across several tables, wrap the component to centralize fetching, state, and event handling.

## Accessibility

- Use the `caption` prop to provide a descriptive summary of the table for screen readers.
- Keep column labels clear so the purpose of each column is understandable on its own.
