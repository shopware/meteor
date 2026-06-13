---
title: Entity Data Table
description: A repository-backed Data Table that owns loading and table state for Admin SDK entity data.
---

## Import

```ts
import { MtEntityDataTable } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Entity Data Table** when rows should come from an Admin SDK entity repository.
- Use it when you want searching, sorting, pagination, and filtering to refetch automatically.
- Use it when you want built-in row selection and bulk-action wiring on top of [**Data Table**](/components/data-table).
- Define `availableFilters` only for the filters users actually need.
- Handle `open-details`, `bulk-delete`, and `bulk-edit` in the parent component.

## Examples

### Basic

::component-example{name="entity-data-table-default-example"}
::

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Let the wrapper own repository-backed table state.
- Define `availableFilters` only for filters users actually need.
- Handle `open-details`, `bulk-delete`, and `bulk-edit` in the parent component.

#dont

- Do not use it when the parent must fully own fetching and table state.
- Do not duplicate repository search, sort, pagination, or filter handling in the parent component.
- Do not use it for local-only datasets where plain [**Data Table**](/components/data-table) is enough.

::

## Behavior

- Data is fetched on mount.
- The table refetches when page, limit, sort, search, or filters change.
- `availableFilters` generates the filter UI for repository-backed filters.
- Bulk actions emit the currently selected row ids.

## Accessibility

- Give the table a meaningful `title` or surrounding heading.
- Keep column labels and filter labels clear and specific.

## Related components

### Entity Data Table vs Data Table

The choice comes down to whether the component or the parent owns data fetching and table state.

- Use **Entity Data Table** for Admin SDK repository data with built-in loading and table state.
- Use [**Data Table**](/components/data-table) when the parent component should own fetching and state management.
