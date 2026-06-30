---
title: Avatar
description: A compact visual representation of a person or entity, shown as a profile image or initials.
---

::component-example{name="avatar-basic-example"}
::

## Usage

**Avatar** represents a person or entity as a profile image or initials. Use it to identify users in lists, headers, menus, and chat threads, with an image when recognition matters and a profile picture is available, or initials as a lightweight fallback.

```ts
import { MtAvatar } from "@shopware-ag/meteor-component-library";
```

## Examples

### Sizes

::component-example{name="avatar-sizes-example"}
::

### With image

::component-example{name="avatar-with-image-example"}
::

### Square

::component-example{name="avatar-square-example"}
::

### All background colors

The background color is derived from the provided name, so repeated names get a stable color.

::component-example{name="avatar-background-colors-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Provide an `imageUrl` when possible, photos improve recognition.
- Rely on initials when no image is available, they are concise and readable.
- Pick a size that fits the layout, for example `s` for dense lists or `l` for profile headers.
- Use the `square` variant when the surrounding UI uses sharper corners.

#dont

- Do not treat **Avatar** as a clickable element, wrap it in a button or link if interaction is required.
- Do not place long text inside **Avatar**, it should only contain initials or an image.
- Do not oversize **Avatar** in dense layouts, this harms scanability.

::

## Behavior

- If no `imageUrl` is provided, **Avatar** falls back to initials derived from `firstName` and `lastName`.
- The background color is derived from the provided name, which gives repeated names a stable visual treatment.
- **Avatar** is presentational. If the avatar should trigger an action, place it inside an interactive wrapper instead of making the avatar itself responsible for interaction.

## Accessibility

- If the avatar is only decorative, keep it out of the interaction flow.
- If the avatar represents an important person or entity, make sure the surrounding UI still exposes that identity in text.
- When wrapping the avatar in an interactive control, ensure the control has a clear accessible name.
