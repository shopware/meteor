---
title: Action Menu
description: A trigger-revealed list of contextual actions for a specific object or view.
---

## Import

```ts
import { MtActionMenu } from "@shopware-ag/meteor-component-library";
```

## Usage

- Use **Action Menu** for secondary or contextual actions tied to a specific record, card, row, or view.
- Use it when the user should choose from a short list of related actions such as `Duplicate`, `Move`, `Export`, or `Delete`.
- Use it when the actions should stay available but do not deserve permanent visual priority.

## Examples

### Basic

::component-example{name="action-menu-basic-example"}
::

### Without icons

::component-example{name="action-menu-without-icons-example"}
::

### Grouped items

Use groups to separate related action sets and keep scanning easy.

::component-example{name="action-menu-grouped-items-example"}
::

### Keyboard shortcuts

::component-example{name="action-menu-keyboard-shortcuts-example"}
::

### States

::component-example{name="action-menu-states-example"}
::

### Nested submenu

::component-example{name="action-menu-nested-submenu-example"}
::

### External links

An item with a `link` prop renders as an external anchor and opens in a new tab.

::component-example{name="action-menu-external-links-example"}
::

### Match trigger width

::component-example{name="action-menu-match-trigger-width-example"}
::

## Anatomy

**Action Menu** is built from a small set of companion exports that work together:

- `mt-dropdown-menu-root` manages the open and closed state for the menu.
- `mt-dropdown-menu-trigger` defines the interactive element that opens the menu, usually a [**Button**](/components/button).
- `mt-dropdown-menu-portal` renders the menu content in an overlay layer outside the surrounding layout flow.
- `mt-action-menu` renders the menu surface itself.
- `mt-action-menu-item` renders individual actions, links, shortcuts, and submenu triggers.
- `mt-action-menu-group` separates related actions and keeps mixed icon alignment consistent inside a group.
- `mt-dropdown-menu-sub` creates nested submenu flows when a second level is truly needed.

These parts are exported together so the pattern can be composed in one place.

## API reference

:component-api

## Do and don't

::do-dont{vertical}
#do

- Keep labels short, specific, and action-oriented.
- Prioritize frequent actions and place destructive actions later in the menu.
- Keep action ordering consistent across similar contexts.
- Keep the menu focused on related actions for the same object or context.
- Use `mt-action-menu-group` to separate action sets when grouping improves scanning.
- Separate destructive actions into their own group when they appear alongside non-destructive actions.
- Use the `critical` variant for destructive actions such as delete or remove.
- Keep icon usage consistent within a visual group whenever possible.
- Use `shortcut` only when the same action is also available from the keyboard elsewhere in the product.

#dont

- Do not use **Action Menu** for the main action on a screen or card.
- Do not hide critical task-completion steps only inside an **Action Menu**.
- Do not group unrelated actions or create groups without a clear purpose.
- Do not create deep or complex hierarchies when a flatter structure would be easier to scan.
- Do not overuse groups or create many single-item groups when a flatter list would scan better.
- Do not use icons, groups, or separators unless they add clarity.
- Do not rely on color, icons, or shortcut labels alone to explain what an action does.

::

## Behavior

- **Action Menu** is a compound pattern, not a standalone trigger. You always compose `mt-action-menu` with `mt-dropdown-menu-root`, `mt-dropdown-menu-trigger`, and `mt-dropdown-menu-portal`.
- `shortcut` accepts a structured object with `modifiers` and `key`.
- Supported modifier values are `mod`, `ctrl`, `alt`, `shift`, and `meta`.
- Use `mod` for cross-platform shortcuts because it maps to `Command` on Mac and `Control` on Windows and Linux. Use `meta` only when you need the platform-specific meta key explicitly.
- Supported special keys are `enter`, `esc`, `tab`, `space`, `backspace`, `delete`, `up`, `down`, `left`, and `right`.
- Shortcut labels are formatted automatically for Mac and PC, and `aria-keyshortcuts` is added for assistive technology.
- An `mt-action-menu-item` with a `link` prop renders as an external anchor and opens in a new tab.
- `is-sub-menu` on `mt-action-menu` and `is-sub-trigger` on `mt-action-menu-item` are used together for nested submenu patterns.
- `match-trigger-width` is useful when the menu should align visually with a wider trigger such as a row action or account switcher.
- Keep nesting shallow. One submenu level is usually enough, and more than two levels should be avoided.

## Accessibility

- The trigger should have a clear accessible name so users understand what actions the menu contains.
- Menu item labels should stay understandable without depending only on icons, color, or shortcut labels.
- If you provide `shortcut`, it supplements the action label rather than replacing it.
- Destructive actions should remain clearly labeled in text, not only visually differentiated through the `critical` variant.
- Use submenu patterns carefully, because deep menu hierarchies are harder to navigate with keyboard and assistive technology.

## Related components

- **Floating UI**: when you need a custom popover surface with richer content such as text, filters, form fields, or mixed layout content instead of a menu of actions.
