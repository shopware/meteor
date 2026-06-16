---
title: Pagination
description: A control for moving through larger result sets one page at a time.
---

## Import

```ts
import { MtPagination } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Pagination** when a list or table is split into pages.
- Use it when users need to move forward, backward, or jump to a specific page.
- Use it alongside data tables, result lists, or overview pages with many items.

## Examples

### Basic

::component-example{name="pagination-basic-example"}
::

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Keep `limit` and `totalItems` in sync with the actual dataset.
- Reset back to the first page when the page size or result set changes significantly.
- Place **Pagination** close to the content it controls.

#dont

- Do not use **Pagination** when all items comfortably fit in one view.
- Do not use **Pagination** for exploratory browsing patterns where users are expected to keep discovering content continuously. Infinite scrolling may fit better there.
- Do not leave the current page disconnected from the visible result range.
- Do not mix pagination with infinite scrolling in the same content area.

::

## Behavior

- **Pagination** displays the current visible range, for example `1-25 of 100`.
- It emits `change-current-page` when users navigate with the buttons or by typing a page number.
- Changing `limit` resets the current page back to `1`.

## Accessibility

- Navigation buttons include accessible labels for first, previous, next, and last page.
- Keep **Pagination** near the content it updates so the relationship stays clear.
- Make sure page changes also update the visible content in a predictable way for keyboard and screen-reader users.
