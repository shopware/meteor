---
title: Brand
description: A logo with the name of the shop or app next to it, and an optional second line below the name.
---

::warning
**Experimental:** This component is in a testing phase, and its API and behavior are not stable yet. Props, events, slots, visual behavior, or accessibility details may change without notice, and the component may be removed at any time.
::

::component-example{name="brand-basic-example"}
::

## Usage

**Brand** shows the logo of the app with a title, such as the name of the shop, and an optional subtitle, such as the name of the product. It is made for the `header` slot of [**Sidebar**](/components/sidebar), but works anywhere the name of the shop is shown with a logo.

```ts
import { MtBrand } from "@shopware-ag/meteor-component-library";
```

The default logo is the Shopware logo. The `logo` slot replaces it as a whole, including its blue box.

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use the name of the shop or app as the title.
- Use the subtitle for one short fact, such as the product or the environment.
- Use the `logo` slot for the logo of another brand.

#dont

- Do not put links or actions into the title or subtitle.
- Do not use **Brand** as the heading of a page.

::

## Behavior

- A title or subtitle that does not fit is cut off with an ellipsis. The full title shows on hover.

## Accessibility

- The default logo is decorative and hidden from screen readers, as the title next to it names the shop.
- A custom logo in the `logo` slot brings its own accessibility, for example an image with an `alt` text, or an empty `alt` when it only repeats the title.
