---
title: Content Header
description: The heading block at the top of a page's content, with a title, actions and a row of details.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="content-header-basic-example" fullWidth}
::

## Usage

**Content Header** shows the title of what a page shows, such as the name of a product, with actions at its end and an optional row of details below. Use it at the top of the content of a [**Page**](/components/page), whose header keeps the breadcrumb and the actions that concern the whole page.

```ts
import { MtContentHeader } from "@shopware-ag/meteor-component-library";
```

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use the name of the record the page shows as the title.
- Keep the details row to short facts, such as a number, a status or a date.

#dont

- Do not repeat the actions of the page header in the `actions` slot.
- Do not use more than one **Content Header** on a page.

::

## Behavior

- The title wraps onto further lines instead of being cut off.
- When the container gets narrow, the actions move onto their own line below the title.
- Inside a [**Page**](/components/page), the breadcrumb in the page header hides its current page while the title is on screen and shows it again once the title has scrolled out of view.

## Accessibility

- The title is an `<h2>`, below the `<h1>` that [**Page**](/components/page) renders from its breadcrumb.

## Related components

- [**Page**](/components/page): for the frame around the content.
- [**Content Layout**](/components/content-layout): for the blocks below the header.
