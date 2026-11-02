---
title: Extension Icon
description: A square, rounded frame that shows the icon of an extension, with a placeholder when no icon is available.
---

::component-example{name="extension-icon-basic-example"}
::

## Usage

**Extension Icon** shows the icon of an app or plugin in a consistent square frame with rounded corners and a subtle border. Use it wherever an extension is listed or referenced, such as extension lists, detail pages, or menus, so every icon gets the same shape regardless of the uploaded image.

```ts
import { MtExtensionIcon } from "@shopware-ag/meteor-component-library";
```

## Examples

### Sizes

Set `size` to one of the supported steps of the `--scale-size-*` token scale: 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, or 96. The default is 40. The icon is always square, so one value sets both width and height.

::component-example{name="extension-icon-sizes-example"}
::

### Placeholder

Without a `src`, or when the image fails to load, the icon shows a neutral placeholder in the same frame.

::component-example{name="extension-icon-placeholder-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Set `alt` to the extension name when the icon is not accompanied by a visible name.
- Leave `alt` empty when the extension name is shown next to the icon, so it is not announced twice.
- Use the same `size` for all icons in a list.
- Provide images that follow the [Shopware guidelines for extension icons](https://docs.shopware.com/en/account-en/adding-pictures-and-icons/how-to): a full-bleed square of 112 by 112 pixels, without rounded corners, borders, or shadows. The component adds the frame itself, and images with another aspect ratio are cropped to fill it.

#dont

- Do not use **Extension Icon** for people or accounts; use [**Avatar**](/components/avatar) instead.
- Do not use it for interface icons; use [**Icon**](/components/icon) instead.
- Do not add your own border or border radius around it.

::

## Behavior

- The image always fills the square frame and is cropped when its aspect ratio differs.
- When `src` is missing or the image fails to load, the placeholder is shown. Changing `src` tries to load the new image again.
- The border is drawn on top of the image as a translucent dark overlay, so light images keep a visible edge.

## Accessibility

- The `alt` text is used as the image's text alternative. When the placeholder is shown, the same text is exposed as the accessible name of the frame.
- With an empty `alt`, the icon is decorative and hidden from assistive technology.
- The icon is not interactive and never receives keyboard focus. When wrapping it in a link or button, give that control an accessible name instead of relying on `alt`.
- Do not let the icon carry information on its own. The placeholder looks the same for a missing image and a failed load, so the extension name and status must also be available as text.

## Related components

- [**Avatar**](/components/avatar): for representing people with a profile image or initials.
- [**Icon**](/components/icon): for interface icons from the Meteor icon kit.
