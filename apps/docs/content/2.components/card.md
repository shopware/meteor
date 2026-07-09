---
title: Card
description: A bordered surface that groups related content, metadata, and local actions into one section.
---

::component-example{name="card-basic-example" fullWidth}
::

## Usage

**Card** is a bordered surface that groups related content, metadata, and local actions into one section that reads as a single surface. Use it for settings sections, dashboards, detail views, or other grouped content that needs a local header and should stay visually connected instead of being spread across loose page elements. Use it with tabs when users need to switch between closely related views inside the same section.

```ts
import { MtCard } from "@shopware-ag/meteor-component-library";
```

## Examples

### Header content

Use the header to add context, identity, and one related secondary action.

::component-example{name="card-header-content-example" fullWidth}
::

### Tabs

::component-example{name="card-tabs-example" fullWidth}
::

### Loading

::component-example{name="card-loading-example" fullWidth}
::

### Inheritance

Show the link or unlink toggle when a card represents values that can be inherited or overridden.

::component-example{name="card-inheritance-example" fullWidth}
::

### Inset content

::component-example{name="card-inset-content-example" fullWidth}
::

### Inset footer

::component-example{name="card-inset-footer-example" fullWidth}
::

## Anatomy

**Card** is composed from a few structural regions and optional slots:

- The header can contain an avatar, title, subtitle, and related header content on the right.
- The tabs area sits below the header and can be used for closely related views of the same section.
- The content area holds the main information, form fields, or other section content.

**Card** also exposes [**Inset**](/utilities/components/inset) as a companion layout utility for cases where content inside the card should visually break out to the card edges without hard-coding spacing values.

- Use **Inset** inside the default card content when an inner block should align to the card's outer padding instead of the current content flow.
- Use **Inset** in the `footer` slot when the footer needs its own full-width background or custom padding treatment while still staying aligned to the card spacing tokens.
- **Inset** works by consuming the card's inset spacing variables, so it is most useful inside components such as **Card** that define those values for you.

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Keep each **Card** focused on one topic, entity, or task.
- Use `title` and `subtitle` when they help users scan the section quickly.
- Use the header to add context, identity, or one closely related action for the section.
- Use tabs only when the content stays part of the same overall section.
- Keep the content inside a **Card** concise enough that the surface still feels like one grouped area.

#dont

- Do not overload one **Card** with unrelated content blocks or too many competing actions.
- Do not nest many **Card** components inside each other when a simpler layout would be easier to scan.
- Do not use **Card** as a generic wrapper for unrelated page content.
- Do not add decorative header content if it does not help users understand the section.
- Do not use tabs for unrelated destinations or views that should be separate sections.
- Do not rely on a decorative card title alone when the contained actions need their own clear labels.

::

## Behavior

- The card header is only rendered when `title`, `subtitle`, `avatar`, or their replacement slots are provided.
- The `tabs` slot only renders the tab bar. The surrounding view is responsible for handling tab state and swapping the content.
- The `title` and `subtitle` slots can replace the matching props when you need custom header content.
- `isLoading` overlays the content area with a loader while the card keeps its layout.
- **Inset** pairs naturally with **Card** because the card content and footer define the inset spacing variables that **Inset** consumes.
- `inheritance` shows the link or unlink toggle and emits `update:inheritance` when the toggle is clicked.
- The `before-card` and `after-card` slots are private and should not be used in application code.

## Accessibility

- Prefer using the `title` prop when the card needs a programmatic label, because it is also used as the card's `aria-label`.
- If you render custom controls in `headerRight`, make sure each control has a clear accessible name.
- Keep card titles descriptive so users can understand the section before interacting with controls inside it.
- If you add tabs inside a **Card**, those tabs still need their own keyboard support and clear labels.

## Related components

- [**Inset**](/utilities/components/inset): when you only need spacing or padded grouping inside an existing surface.
