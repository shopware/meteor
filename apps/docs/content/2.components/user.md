---
title: User
description: A user shown as avatar, name and an optional secondary line.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="user-basic-example"}
::

## Usage

**User** identifies a person with an [**Avatar**](/components/avatar), their name and an optional secondary line such as a role, an email address or a workspace. Use it in places that show who is signed in or who did something, such as the footer of a sidebar navigation or a user menu.

```ts
import { MtUser } from "@shopware-ag/meteor-component-library";
```

## Examples

### Avatar only

`avatar-only` hides the name and the subtitle visually, for example in a collapsed sidebar. The `suffix` slot stays visible.

::component-example{name="user-avatar-only-example"}
::

### With an action

The `suffix` slot holds trailing content, such as a menu trigger.

::component-example{name="user-suffix-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Keep the subtitle to one short piece of information, such as a role or an email address.
- Give an icon-only action in the `suffix` slot an accessible name.

#dont

- Do not put several interactive elements inside **User**; add one action in the `suffix` slot.

::

## Behavior

- The avatar shows the initials of the first and last word of `name`, or `image-url` when it is set.
- Long names and subtitles are cut off with an ellipsis on one line.

## Accessibility

- The avatar is hidden from assistive technology, because the name is shown as text next to it.
- With `avatar-only`, the name and the subtitle are hidden visually but stay available to assistive technology.

## Related components

- [**Avatar**](/components/avatar): when only a profile image or initials are needed, without a name.
