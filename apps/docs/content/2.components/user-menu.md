---
title: User Menu
description: The logged-in user as a button with avatar, name and subtitle, which opens a menu with the entries of the app.
---

::warning
**Experimental:** This component is in a testing phase, and its API and behavior are not stable yet. Props, events, slots, visual behavior, or accessibility details may change without notice, and the component may be removed at any time.
::

::component-example{name="user-menu-basic-example"}
::

## Usage

**User Menu** shows who is logged in and opens a menu with what concerns their account, such as the profile, the settings and the logout. It is made for the `footer` slot of [**Sidebar**](/components/sidebar) and fills the width of its container.

```ts
import { MtUserMenu } from "@shopware-ag/meteor-component-library";
```

Put the entries into the default slot, built from `mt-action-menu-group` and `mt-action-menu-item` as in an [**Action Menu**](/components/action-menu). The component adds no entries of its own, so the logout is one of your entries.

The `compact` prop shows only the avatar, for example in a collapsed sidebar.

## Examples

### Compact

Only the avatar shows. The menu keeps its own width instead of the width of the button.

::component-example{name="user-menu-compact-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Group the entries, and put the logout into a group of its own at the end.
- Use the `critical` variant for the logout.
- Use `subtitle` for the role or the email address of the user.

#dont

- Do not use **User Menu** for anyone else than the logged-in user.

::

## Behavior

- The menu opens above the button when there is room for it, and is as wide as the button. When compact, it keeps its own width.
- The avatar shows the initials of `first-name` and `last-name`, or the image of `image-url`.
- A name or subtitle that does not fit is cut off with an ellipsis.

## Accessibility

- The button is named by the visible name and subtitle, and screen readers hear that it opens a menu. The avatar is hidden from them.
- When compact, the name and subtitle are hidden visually but still name the button.
- The menu is named after the button. The arrow keys move through the entries, Enter or Space chooses one, and Escape closes the menu and returns to the button.

## Related components

- [**Avatar**](/components/avatar): when only the picture or the initials of a user are needed, without a menu.
- [**Action Menu**](/components/action-menu): when the menu holds actions for a record or a view instead of the logged-in user.
