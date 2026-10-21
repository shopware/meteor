---
title: Content Layout
description: A layout for the content of a page, with up to two sidebars next to it.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="content-layout-basic-example" fullWidth}
::

## Usage

**Content Layout** arranges the blocks of a page's content, such as cards, in a main column with up to two sidebars of 300px next to it. Use it in the content of a [**Page**](/components/page) or in one of its tabs, for example with the settings of a record in the middle and its status at the side.

```ts
import { MtContentLayout } from "@shopware-ag/meteor-component-library";
```

## Examples

### Two sidebars

Fill `start` and `end` for a sidebar on each side. When the content gets too narrow, the sidebars wrap: the start sidebar above the content and the end sidebar below it. Drag the corner of the box to try it.

::component-example{name="content-layout-sidebars-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Put the main settings of a record in the content and secondary information, such as its status, in a sidebar.
- Prefer a single sidebar; use two only when both hold information that belongs next to the content.

#dont

- Do not use **Content Layout** for lists and properties that should stay in view while the content scrolls; use the panels of [**Page**](/components/page) for that.

::

## Behavior

- **Content Layout** fills the width of its parent, and each region stacks its blocks with a gap of 16px.
- The sidebars are 300px wide and scroll with the content. Unlike the panels of [**Page**](/components/page), they never become drawers.
- The sidebars wrap when the layout is narrower than 49.75rem with one sidebar, or 69.5rem with two, so the content keeps at least 480px. Two sidebars wrap together.

## Related components

- [**Page**](/components/page): for panels that stay in view while the content scrolls.
- [**Content Header**](/components/content-header): for the title above the layout.
- [**Card**](/components/card): for the blocks inside the layout.
