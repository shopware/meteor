---
title: Container
description: A layout wrapper that limits content to a maximum width and centers it.
---

::component-example{name="container-basic-example" fullWidth}
::

## Usage

**Container** keeps page content at a readable width. It fills the available width up to its size and centers itself with automatic inline margins. It has no padding of its own, so the surrounding page or region stays in charge of spacing.

```ts
import { MtContainer } from "@shopware-ag/meteor-component-library";
```

## Examples

### Sizes

Three sizes are available: `s` (680px), `m` (960px, the default) and `l` (1280px). On narrower screens every size simply takes the full width.

::component-example{name="container-sizes-example" fullWidth}
::

### Inside a page

Put the padding on the page and the container inside it. Use `as` to render a semantic element instead of a `div`.

::component-example{name="container-page-example" fullWidth}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use `s` for forms and settings, `m` for regular pages and `l` for wide content such as tables or dashboards.
- Keep padding and gaps on the page or a wrapper around the container.
- Use one container per page and nest the page content inside it.

#dont

- Do not add padding or borders to the container itself; wrap the content instead.
- Do not nest containers to fine-tune widths.

::

## Behavior

The widths come from three custom properties defined in the library's global stylesheet. Override them on `:root` to change the sizes for the whole application.

| Size | Custom property      | Default |
| ---- | -------------------- | ------- |
| `s`  | `--container-size-s` | 680px   |
| `m`  | `--container-size-m` | 960px   |
| `l`  | `--container-size-l` | 1280px  |

## Related components

- [**App**](/components/app) for the application shell around the page content.
- [**Card**](/components/card) to group content inside a container.
