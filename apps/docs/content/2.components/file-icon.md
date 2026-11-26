---
title: File Icon
description: A page with a folded corner that shows the category and format of a file.
---

::component-example{name="file-icon-basic-example"}
::

## Usage

**File Icon** shows what kind of file something is, for example in upload lists, attachments, media items, or when a preview can't be loaded. Pass the file name or MIME type and the component picks the icon and format label for you.

```ts
import { MtFileIcon } from "@shopware-ag/meteor-component-library";
```

## Examples

### Fallbacks

The icon shows as much as it knows about the file. A known format shows its icon and label, a file with only a known category shows the icon alone, and anything else shows the empty page.

::component-example{name="file-icon-fallback-example"}
::

### Categories

Set `category` to show the icon of a category without a format label, or to override the category derived from the file.

::component-example{name="file-icon-categories-example"}
::

### Formats

Set `format` to show a format label, without a leading dot, such as `pdf`.

::component-example{name="file-icon-formats-example"}
::

### Supported formats

These are all formats the component knows, grouped by their category. Open the code to see each extension, since longer labels are cut off.

::component-example{name="file-icon-all-formats-example" class="flex-col items-start!"}
::

### Custom icon and format

Set `icon` to any icon from the icon kit and `format` to any label to show formats the component doesn't know.

::component-example{name="file-icon-custom-example"}
::

### Broken preview

Set `broken` when a file failed to load.

::component-example{name="file-icon-broken-example"}
::

### Sizes

Set `size` to one of the supported steps of the `--scale-size-*` token scale: 24, 32, 40, 48, 56, 64, 72, 80, or 96. The default is 48. The size is the height of the page, which is three quarters as wide, so 48 gives a page of 36 by 48 pixels. The page, icon, and label scale together, and the format label is shown from size 40 up.

::component-example{name="file-icon-sizes-example"}
::

### Fluid size

Set `size` to `fluid` to size the icon with CSS instead, for example in container query units of a media preview. Without a width of your own, it fills its parent.

::component-example{name="file-icon-fluid-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Pass `file-name` or `mime-type` and let the component resolve the icon and label.
- Use the same `size` for all icons in a list.
- Show the file name as text next to the icon.

#dont

- Do not use **File Icon** as a thumbnail when a real preview of the file is available.
- Do not use it for interface actions such as uploading or downloading; use [**Icon**](/components/icon) instead.

::

## Behavior

- An explicit `format` or `category` wins over what the file name or MIME type say, and the file name wins over the MIME type. A file name without a known extension uses the format of the MIME type.
- The extension is the part after the last dot of the file name, so `backup.tar.gz` shows `GZ`. Queries and hashes of URLs are ignored.
- A MIME type without a known format, such as `video/x-unknown`, still resolves its category from the type before the slash.
- A format label needs an icon. A format the component doesn't know shows the empty page unless you also set `icon` or `category`.
- `:show-format="false"` hides the label and shows the category icon alone.
- An `icon` in the solid style, such as `solid-star`, shows in the regular style.

## Accessibility

- Without a `label`, the icon is decorative and hidden from assistive technology. Leave it decorative when the file name is shown next to it.
- With a `label`, such as `PDF file`, the icon gets the `img` role and the label as its accessible name.
- The broken preview only shows a cross. Tell users in text that the file failed to load.

## Related components

- [**Extension Icon**](/components/extension-icon): for the icon of an app or plugin.
- [**Icon**](/components/icon): for interface icons from the Meteor icon kit.
