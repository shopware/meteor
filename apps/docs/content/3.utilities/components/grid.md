---
title: Grid
description: A layout utility that places form fields and other content side by side in equal, responsive columns with a consistent gap.
---

::component-example{name="grid-basic-example" fullWidth}
::

## Usage

**Grid** lays out its children in columns and takes care of the spacing between them. Use it inside a [**Card**](/components/card) whenever two or more form fields should sit next to each other. The default two equal columns collapse into one when the grid gets too narrow, so a form works on wide and narrow screens without extra rules.

The grid replaces the default outer margins of form fields as the way to space a form. Enable the `removeDefaultMargin` future flag through the [**Theme Provider**](/utilities/components/theme-provider) so the fields' own margins do not add to the gap. For fields that stack on top of each other use [**Stack**](/utilities/components/stack).

```ts
import { MtGrid, MtGridItem } from "@shopware-ag/meteor-component-library";
```

## Examples

### Number of columns

A number creates that many equal columns. The grid drops columns one by one as it gets narrower than `min-column-width` allows.

::component-example{name="grid-columns-example" fullWidth}
::

### Spanning columns

Wrap an item in `mt-grid-item` to let it span several columns. `span="full"` always covers the whole row, also when the grid has collapsed to fewer columns.

::component-example{name="grid-span-example" fullWidth}
::

### Custom column template

A string is used as the CSS `grid-template-columns` value directly, for example to place a button next to a field. This layout is not responsive.

::component-example{name="grid-template-example" fullWidth}
::

### Gap

The gap between rows and columns accepts a spacing token. `row-gap` and `column-gap` override it for one direction.

::component-example{name="grid-gap-example" fullWidth}
::

### Alignment

By default items align to the bottom of their row so the inputs line up when labels or heights differ. Use `align="start"` to line up the labels instead, for example when a field shows a hint.

::component-example{name="grid-align-example" fullWidth}
::

## API reference

### Grid

:component-api

### Grid item

:component-api{name="MtGridItem"}

## Best practices

::do-dont{vertical}
#do

- Use the grid for fields that belong to the same group, such as first and last name or price and tax rate.
- Keep the default gap so forms across the application share the same rhythm.
- Prefer a number of columns over a custom template so the layout stays responsive.

#dont

- Do not place a grid directly inside another grid to create unequal columns; use a custom template or `mt-grid-item` instead.
- Do not add margins to the grid items; adjust `gap` on the grid instead.
- Do not use the grid for tabular data; use [**Data Table**](/components/data-table).

::

## Behavior

- With a numeric `columns` value, each column takes an equal share of the width. When that share falls below `min-column-width` (192px by default), the grid shows fewer columns instead of squeezing them, down to a single column.
- Items fill the grid row by row in source order. A `mt-grid-item` with `span="full"` starts a new row and takes the whole width.
- A numeric `span` on `mt-grid-item` is a fixed number of columns and does not shrink when the grid collapses. Prefer `span="full"` for items that should always take the whole row.
- `align` applies to all items. The default `end` lines up the inputs of fields whose labels, hints, or heights differ. A field with an error message grows downwards, so its row gets taller.

## Related components

- [**Stack**](/utilities/components/stack): when items should sit one below the other instead of side by side.
- [**Card**](/components/card): the surface that usually contains a form grid.
- [**Theme Provider**](/utilities/components/theme-provider): enables the `removeDefaultMargin` future flag the grid is designed for.
