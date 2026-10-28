---
title: User
description: A user shown as avatar, name and an optional secondary line.
---

::warning
**Experimental:** This component is in a testing phase, and its API and behavior are not stable yet. Props, events, slots, visual behavior, or accessibility details may change without notice, and the component may be removed at any time.
::

::component-example{name="user-basic-example"}
::

## Usage

**User** identifies a person with an [**Avatar**](/components/avatar), their name and an optional secondary line such as a role, an email address or a workspace. Use it in places that show who is signed in, such as in the footer of [**Sidebar**](/components/sidebar) or in [**User Menu**](/components/user-menu).

```ts
import { MtUser } from "@shopware-ag/meteor-component-library";
```

## Examples

### Compact

`compact` hides the name and the subtitle visually, for example in a collapsed navigation.

::component-example{name="user-compact-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Keep the subtitle to one short piece of information, such as a role or an email address.

#dont

- Do not build your own user menu from **User**. Use [**User Menu**](/components/user-menu) instead.

::

## Behavior

- The avatar shows the initials of the first and the last word of `name`, or the image of `image-url` when it is set.
- Long names and subtitles are cut off with an ellipsis on one line.

## Accessibility

- The avatar is hidden from assistive technology, because the name is shown as text next to it.
- With `compact`, the name and the subtitle are hidden visually but stay available to assistive technology.

## Related components

- [**Avatar**](/components/avatar): when only a profile image or initials are needed, without a name.
- [**User Menu**](/components/user-menu): when the user opens a menu with entries such as the profile and the logout.
