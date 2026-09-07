---
title: Action Menu
description: A trigger-revealed list of contextual actions for a specific object or view.
---

::component-example{name="action-menu-basic-example"}
::

## Usage

**Action Menu** reveals a short list of contextual actions for a specific record, card, row, or view. Use it for secondary actions like `Duplicate`, `Move`, `Export`, or `Delete` that should stay available without claiming permanent visual priority.

```ts
import { MtActionMenu } from "@shopware-ag/meteor-component-library";
```

## Examples

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

The `mt-action-menu-*` components wrap [Reka UI's Dropdown Menu](https://reka-ui.com/docs/components/dropdown-menu) primitives and forward any additional attributes to them. The tables below therefore list the props each wrapper declares itself, followed by the forwarded Reka UI props and events you can also use. The `mt-dropdown-menu-*` parts are direct re-exports of the Reka UI primitives.

### MtActionMenu

:component-api

#### Forwarded Reka UI props

`mt-action-menu` renders Reka UI's `DropdownMenuContent` (`DropdownMenuSubContent` when `is-sub-menu` is set) and forwards all additional attributes to it. The most useful forwarded props:

| Prop                       | Type                                          | Default                          |
| -------------------------- | --------------------------------------------- | -------------------------------- |
| `side`                     | `"top" \| "right" \| "bottom" \| "left"`      | `"bottom"`                       |
| `side-offset`              | `number`                                      | `8` (set by `mt-action-menu`)    |
| `align`                    | `"start" \| "center" \| "end"`                | `"start"` (set by `mt-action-menu`) |
| `align-offset`             | `number`                                      | `0` (`-5` for submenus)          |
| `avoid-collisions`         | `boolean`                                     | `true`                           |
| `collision-padding`        | `number \| object`                            | `0`                              |
| `collision-boundary`       | `Element \| Element[] \| null`                | `[]`                             |
| `sticky`                   | `"partial" \| "always"`                       | `"partial"`                      |
| `hide-when-detached`       | `boolean`                                     | `false`                          |
| `position-strategy`        | `"absolute" \| "fixed"`                       | `"fixed"`                        |
| `update-position-strategy` | `"optimized" \| "always"`                     | `"optimized"`                    |
| `prioritize-position`      | `boolean`                                     | `false`                          |
| `reference`                | `Element \| VirtualElement`                   | —                                |
| `loop`                     | `boolean`                                     | `false`                          |
| `force-mount`              | `boolean`                                     | —                                |

Forwarded events: `@escape-key-down`, `@pointer-down-outside`, `@focus-outside`, `@interact-outside`, and `@close-auto-focus`.

Attributes you pass take precedence over the defaults `mt-action-menu` sets, so `side-offset` and `align` can be overridden. Exception: submenus (`is-sub-menu`) position themselves automatically, so `side` and `align` have no effect there.

### MtActionMenuItem

:component-api{name="MtActionMenuItem"}

#### Forwarded Reka UI props

`mt-action-menu-item` renders Reka UI's `DropdownMenuItem` (`DropdownMenuSubTrigger` when `is-sub-trigger` is set) and forwards all additional attributes to it:

| Prop / Event | Type                    | Description                                                                                                                       |
| ------------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `@select`    | `(event: Event) => void` | Fires when the action is selected via click or keyboard. Call `event.preventDefault()` to keep the menu open after the selection. |
| `text-value` | `string`                | Overrides the text used for typeahead matching when the visible label is not plain text.                                           |
| `as-child`   | `boolean`               | Merges the item behavior into its child element instead of rendering its own element.                                              |

`@select` is not emitted for `is-sub-trigger` items, because sub-triggers open a submenu instead of performing an action.

### MtActionMenuGroup

:component-api{name="MtActionMenuGroup"}

`mt-action-menu-group` renders Reka UI's `DropdownMenuGroup` and additionally accepts its `as` and `as-child` props.

### MtDropdownMenuRoot

Re-export of Reka UI's [`DropdownMenuRoot`](https://reka-ui.com/docs/components/dropdown-menu#root). It manages the open state for the whole menu.

| Prop           | Type                  | Default | Description                                                                                                       |
| -------------- | --------------------- | ------- | ----------------------------------------------------------------------------------------------------------------- |
| `open`         | `boolean`             | —       | Controlled open state, usable as `v-model:open`.                                                                   |
| `default-open` | `boolean`             | `false` | Initial open state when uncontrolled.                                                                              |
| `modal`        | `boolean`             | `true`  | When `true`, interaction with elements outside the menu is blocked and page scrolling is locked while it is open.   |
| `dir`          | `"ltr" \| "rtl"`      | —       | Reading direction.                                                                                                  |

Emits `update:open` and exposes the current state through the default slot binding `{ open }`.

### MtDropdownMenuTrigger

Re-export of Reka UI's [`DropdownMenuTrigger`](https://reka-ui.com/docs/components/dropdown-menu#trigger). Accepts `as`, `as-child`, and `disabled`. Use `as-child` to turn an existing element, such as a [**Button**](/components/button), into the trigger.

### MtDropdownMenuPortal

Re-export of Reka UI's [`DropdownMenuPortal`](https://reka-ui.com/docs/components/dropdown-menu#portal). Accepts `to` (teleport target, defaults to `body`), `disabled`, `defer`, and `force-mount`.

### MtDropdownMenuSub

Re-export of Reka UI's [`DropdownMenuSub`](https://reka-ui.com/docs/components/dropdown-menu#sub). Wraps a nested submenu and accepts `open` (`v-model:open`) and `default-open`, emits `update:open`, and exposes `{ open }` through its default slot.

## Best practices

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

- **Action Menu** is a compound pattern, not a standalone trigger. It is always composed from the companion exports listed in Anatomy.
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

- [**Floating UI**](/components/floating-ui): when you need a custom popover surface with richer content such as text, filters, form fields, or mixed layout content instead of a menu of actions.
