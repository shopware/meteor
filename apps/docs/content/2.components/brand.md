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

**Brand** shows the logo of the app with a title, such as the name of the shop, and a subtitle, such as the name of the product. The title defaults to "Meteor" and the subtitle to "Shopware". An empty `subtitle` hides the second line. It is made for the `header` slot of [**Sidebar**](/components/sidebar), but works anywhere the name of the shop is shown with a logo.

```ts
import { MtBrand } from "@shopware-ag/meteor-component-library";
```

The default logo is the Shopware logo. The `variant` prop shows the logo of another Shopware product instead: `copilot`, `intelligence`, `nexus` or `payments`. The `appearance` prop sets its colors: `dark`, the default, shows a white mark on a blue box, and `light` shows a blue mark on a white box. The `compact` prop shows only the logo, for example in a collapsed sidebar. The `logo` slot replaces the logo as a whole, including its box.

## Examples

### Variants

Each variant shows the logo of one Shopware product.

::component-example{name="brand-variants-example"}
::

### Appearances

The dark appearance shows a white mark on a blue box, the light appearance a blue mark on a white box.

::component-example{name="brand-appearances-example"}
::

### Compact

Only the logo shows. The title shows on hover.

::component-example{name="brand-compact-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use the name of the shop or app as the title.
- Use the subtitle for one short fact, such as the product or the environment.
- Use the variant of the Shopware product the app belongs to.
- Use the `logo` slot for the logo of another brand.

#dont

- Do not put links or actions into the title or subtitle.
- Do not use **Brand** as the heading of a page.

::

## Behavior

- A title or subtitle that does not fit is cut off with an ellipsis. The full title shows on hover.
- When compact, only the logo shows, and the title shows on hover.

## Accessibility

- The logo of every variant is decorative and hidden from screen readers, as the title next to it names the shop.
- When compact, the title and subtitle are hidden visually but still read by screen readers.
- A custom logo in the `logo` slot brings its own accessibility, for example an image with an `alt` text, or an empty `alt` when it only repeats the title.
