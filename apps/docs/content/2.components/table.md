---
title: Table
description: Plain table parts for laying out tabular content by hand with the Meteor table style.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="table-basic-example" fullWidth}
::

## Usage

**Table** is a set of parts that map one to one to the native table elements and give them the Meteor table style: a plain header, dividers between rows, and no stripes or card. Use it for small, static tables you write by hand, such as order items or a settings overview. For tables built from data that need sorting, pagination, or row selection, use [**Data Table Next**](/components/data-table-next), which renders with the same parts.

```ts
import {
  MtTable,
  MtTableCaption,
  MtTableHeader,
  MtTableBody,
  MtTableFooter,
  MtTableRow,
  MtTableHeaderCell,
  MtTableCell,
} from "@shopware-ag/meteor-component-library";
```

## Examples

### Caption and footer

A caption names the table, and a footer holds summary rows such as totals.

::component-example{name="table-footer-example" fullWidth}
::

## Anatomy

**Table** is made up of these parts, each rendering its native element:

- `MtTable` renders a scroll container with the `<table>` inside. It forwards `class` and `style` to the container and every other attribute, such as `aria-label`, to the `<table>`.
- `MtTableCaption` renders `<caption>` and names the table.
- `MtTableHeader`, `MtTableBody`, and `MtTableFooter` render `<thead>`, `<tbody>`, and `<tfoot>`.
- `MtTableRow` renders `<tr>`. Set `selected` to highlight it.
- `MtTableHeaderCell` renders `<th>`, for column headers and for row headers in the body or footer.
- `MtTableCell` renders `<td>`.

## API reference

### Table

:component-api{name="MtTable"}

### Row

:component-api{name="MtTableRow"}

### Header cell

:component-api{name="MtTableHeaderCell"}

### Cell

:component-api{name="MtTableCell"}

## Best practices

::do-dont{vertical}
#do

- Give every table a name, with `MtTableCaption`, `aria-label`, or `aria-labelledby`.
- Set `scope="col"` on column headers and `scope="row"` on row headers.
- Align numbers and prices with `align="end"` in both the header cell and the cells of the column.
- Keep cell content short. Move details to a detail page or a modal.

#dont

- Do not use **Table** to lay out content that is not tabular, such as forms or cards.
- Do not wrap the table in a card only to frame it. The table is designed to sit directly on the page.
- Do not build sorting, pagination, or selection by hand. Use [**Data Table Next**](/components/data-table-next) instead.

::

## Behavior

- The table fills the width of its container. Columns size themselves to their content.
- When the table is wider than its container, the container scrolls horizontally.
- The header sticks to the top of the container when you limit the height of `MtTable`, for example with `max-height`. Without a height limit, the table grows with its rows and scrolls with the page.
- The sticky header uses the default surface color, so rows do not show through it. Set `--mt-table-background` on `MtTable` or one of its ancestors when the table sits on a different surface, such as a card.
- The last body row has no divider, so the table ends without a closing line.

## Accessibility

- The parts render native table elements, so screen readers announce rows, columns, and headers without extra attributes.
- Name the table with `MtTableCaption`, `aria-label`, or `aria-labelledby`. Add the `visually-hidden` class to the caption to keep it for screen readers only.
- Use `MtTableHeaderCell` with `scope="row"` for the first cell of a row when it identifies the row, such as the "Total" label in a footer.

## Related components

- [**Data Table Next**](/components/data-table-next): when the table is built from data and needs sorting, pagination, or row selection.
