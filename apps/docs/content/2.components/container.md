---
title: Container
description: A layout wrapper that limits content to a maximum width and centers it.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="container-basic-example" fullWidth}
::

## Usage

**Container** keeps content at a readable width: it fills the available width up to its `width` and centers itself. It has no padding of its own, so the surrounding layout stays in charge of spacing. Inside a [**Page**](/components/page), use its `width` prop instead, which wraps the content in a container.

```ts
import { MtContainer } from "@shopware-ag/meteor-component-library";
```

## Examples

### Widths

`width` sets the maximum width: `s` (680px), `m` (960px, the default) or `l` (1280px). When less space is available, every width takes the full width.

::component-example{name="container-widths-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use `s` for forms and settings, `m` for regular pages and `l` for wide content such as tables or dashboards.
- Keep padding and gaps on the layout around the container.

#dont

- Do not add padding or borders to the container itself; wrap the content instead.
- Do not nest containers to fine-tune widths.

::

## Behavior

- **Container** is as wide as its parent up to its `width`, and centers itself with automatic inline margins.
- `as` renders another element or component, such as a `section`, instead of a `div`.

## Related components

- [**Page**](/components/page): its `width` prop limits the content of a page the same way.
- [**Card**](/components/card): when the content inside the container needs a visible surface and a title.
