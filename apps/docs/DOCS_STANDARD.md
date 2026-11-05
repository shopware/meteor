# Docs content standard

Every public component should have a docs page that helps developers choose the right component, implement it without reading source code, and understand important behavior and accessibility constraints.

This is the authoring standard for the docs site in `apps/docs`.

## Related guides

Two agent skills under `.agents/skills/` automate and standardize this work. Read them before writing or reviewing a page:

- `create-docs` scaffolds and writes documentation pages. Its references are the practical companions to this standard: `references/templates.md` (page templates), `references/mdc-components.md` (MDC component syntax and the components available on this site), and `references/writing-guide.md` (writing style).
- `review-docs` reviews existing pages for clarity, structure, SEO, internationalization, and technical/MDC correctness, and reports issues by priority.

Use `create-docs` when adding a page and `review-docs` before considering it done.

## Where pages live

- Component pages live under `content/2.components/` as Markdown files, one per component.
- The files have no numeric prefix, so the slug is the file name: `button.md` serves at `/components/button`. The sidebar groups and orders them as described in [Frontmatter](#frontmatter).
- The slug also resolves the documented component: `button` maps to `MtButton`. Keep the slug aligned with the component name so `:component-api` and examples resolve automatically.

## Section order

Component pages use this order:

1. Frontmatter
2. Status banner (optional)
3. Basic example
4. Usage
5. Examples (optional)
6. Anatomy (optional)
7. API reference
8. Best practices
9. Behavior (optional)
10. Accessibility (optional)
11. Related components (optional)

`Basic example`, `Usage`, `API reference`, and `Best practices` are always present. `Examples` is included whenever the component has more than its basic usage to show. The optional sections are included when they add value. Keep the order stable: if a section is not needed, omit it instead of moving sections around.

Each section is described below in this order. For a full page that follows the standard, copy the structure of `content/2.components/button.md`.

## Frontmatter

The `title` and `description` frontmatter own the page heading and lead. Do not write your own H1; the page opens with the basic example, and the first heading is `## Usage`.

`title` is the component's display name. `description` is a single sentence that defines what the component is, written so the title and description read together as a pair:

```md
---
title: Button
description: The standard action trigger for Meteor interfaces.
---
```

The sidebar groups the component pages into the sections `Layout`, `Content`, `Navigation`, `Forms`, `Status` and `Overlays`, without changing their URLs. The sections and the pages in each are set in `app/utils/groupComponentNavigation.ts`, and each section lists its pages alphabetically. Add a new component to its section there; until then, it shows after the sections.

Write the description as a definition of the component, not as instructions. Start with a noun phrase ("The standard action trigger for...", "A compact status label for..."), not a verb ("Use this to..."). Keep richer framing for the `Usage` section.

## Status banner

Components that are not generally available carry a status banner as the first content on the page, directly after the frontmatter and before `Import`. Mirror the component's status from the library (the Storybook `status`): `experimental` or `deprecated`. Available components get no banner.

Use a Nuxt UI callout: `::warning` for experimental, `::caution` for deprecated. Every experimental banner starts with the same text. A short page-specific sentence may follow it. When a preferred alternative or replacement exists, link it (see [Prose rules](#prose-rules)); do not invent one if the component has no documented successor.

```md
::warning
**Experimental:** This component is in a testing phase, and its API and behavior are not stable yet. Props, events, slots, visual behavior, or accessibility details may change without notice, and the component may be removed at any time. Prefer [**Action Menu**](/components/action-menu) or [**Floating UI**](/components/floating-ui) when they fit your use case.
::
```

```md
::caution
**Deprecated.** Use [**Snackbar**](/components/snackbar) instead.
::
```

## Basic example

The single most representative usage of the component renders at the top of the page, directly after the frontmatter (and the status banner, when present) and before `Import`. It gives readers an immediate live preview before the reference material that follows.

Show it with `::component-example` and no heading; the page title and description already introduce the component, and any further examples belong in [Examples](#examples):

```md
::component-example{name="action-menu-basic-example"}
::
```

It is a live example like any other, authored as a real Single File Component (see [Examples](#examples) for how the files are created and referenced). Keep it to the single clearest, most representative usage.

## Usage

Write `Usage` as short prose, not a bullet list. Open with a sentence stating what the component does, then cover what to use it for and any constraint worth knowing up front. Keep it tight, a sentence or two; move longer explanations to `Behavior`.

```md
**Action Menu** reveals a short list of contextual actions for a specific record, card, row, or view. Use it for secondary actions like `Duplicate`, `Move`, `Export`, or `Delete` that should stay available without claiming permanent visual priority.
```

Follow the text with the import statement, showing how to import the component from the library:

````md
```ts
import { MtComponentName } from "@shopware-ag/meteor-component-library";
```
````

## Examples

`Examples` holds the additional examples beyond the [basic example](#basic-example) at the top of the page, and is included whenever the component has more than its basic usage to show. Put each example under an `H3` labelled by what it shows. An `H3` may be followed by a short sentence describing what the example demonstrates, when that is not obvious from the heading alone. Keep it to one line and place it above the example.

Live examples are real Single File Components, not inline code blocks:

1. Create the example under `app/components/content/examples/<group>/<PascalName>.vue`, for example `app/components/content/examples/button/ButtonVariantsExample.vue`.
2. Reference it by its kebab-case name, optionally preceded by a one-line description:

   ```md
   ### Variants

   Each variant signals a different level of emphasis and intent.

   ::component-example{name="button-variants-example"}
   ::
   ```

- The component renders a live preview and the example's source as a copyable code block. You do not write the code block yourself; it is extracted from the SFC.
- Keep example SFCs clean, focused, and copy-friendly. Show the minimum markup a developer needs and avoid generating markup through loops.
- Use props to tune the display: `preview`, `source`, `collapse`, `fullWidth`, `inset`, and `class`. By default the code sits behind a "Show code" toggle. `inset` removes the padding of the preview, for full-bleed examples such as a page or the app shell that should reach the border of the preview.
- Provide a manual `#code` slot only when the auto-extracted source is not what a reader should copy.

## Anatomy

Use `Anatomy` when structure, composition, or internal parts need explanation, for example a component with companion exports that are used together.

## API reference

Use the `:component-api` component instead of hand-writing tables:

```md
:component-api
```

- It infers the component from the page slug (`button` resolves `MtButton`). Override with `:component-api{name="MtCustomName"}` when the slug does not match.
- It renders Props, Events, Slots, and Exposed members as separate tables, omitting any section the component does not have.
- Hide internal members with `:component-api{ignore="someProp,anotherProp"}`.
- The metadata, including types, defaults, and descriptions, comes from the component source and its JSDoc comments. Improve the docs by improving the comments in the component, not by editing tables here.

## Best practices

Use the `:do-dont` component for usage guidance. Each slot accepts plain Markdown, either a bullet list or a short paragraph:

```md
::do-dont
#do

- Recommended usage.

#dont

- Discouraged usage.

::
```

- Provide both slots to contrast recommended and discouraged usage; the cards stack vertically. If you provide only one slot, only that card renders.
- Keep entries short and parallel. Prefer concrete guidance over restating the API.

## Behavior

Use `Behavior` when behavior is non-obvious, stateful, or easy to misuse. Explain state changes, defaults that affect outcomes, timing, and edge cases a reader would not infer from the example.

## Accessibility

Use `Accessibility` when keyboard, screen reader, or content constraints are not obvious from the example alone. Explicitly call out:

- keyboard behavior
- screen reader behavior when relevant
- whether the component is appropriate for critical information
- any content limitations that affect usability or accessibility

Do not assume that accessibility behavior is obvious from the example alone.

## Related components

Use `Related components` when users are likely to choose between this component and another public component. Keep it short: a single bullet list, one bullet per related component. Link the component to its page (see [Prose rules](#prose-rules)) and follow it with a brief note on when to reach for that component instead. Do not restate when to use the current component, and do not write a full feature comparison, the whole page already covers the current component.

```md
## Related components

- [**Radio Group**](/components/radio-group): when a small set of options should stay visible so users can compare them directly.
- [**Checkbox**](/components/checkbox): when users toggle independent options on and off rather than choosing from a shared option set.
```

## Blocks

Blocks are templates for whole pages and recurring patterns, built from public components. They are not components of their own: readers copy the code into their application and adapt it.

### Where blocks live

- Each block is a single Single File Component under `app/components/content/blocks/<group>/<Name>Block.vue`, for example `app/components/content/blocks/pages/DetailPageBlock.vue`. The `Block` suffix keeps the names apart from the examples.
- Its page lives under `content/4.blocks/<n>.<group>/<n>.<slug>.md`, for example `content/4.blocks/2.pages/1.detail-page.md`, which serves at `/blocks/pages/detail-page`. Each group folder has a `.navigation.yml` with its title.

### Page structure

1. Frontmatter: `title` is the name of the block, `description` a single sentence that defines it, as for component pages.
2. The preview, with no heading: `::block-preview{name="detail-page-block"}`. It renders the block in an iframe that readers can resize with the handle on its right edge, and shows its code to copy. The preview has the 16:9 ratio of a screen, at least 480px tall and never taller than the window; set `height` in pixels only when a block needs a fixed height.
3. `## Usage`: short prose on when to use the block and what to replace or adapt, such as the sample data or the requests.
4. `## Examples` (optional): further variants of the block, each under an `H3` with a short description and its own `::block-preview`. Each variant is a block of its own, named after the page and the variant, such as `DetailPageContentBlock.vue` for the variant with content of the detail page.
5. `## Components`: a bullet list that links each component the block uses, with what it is used for.

When a page shows several variants, the first preview shows the structure: the slots of the layout components, filled with `placeholder-slot`s named after their slots, such as `Page: actions`. The variants below show it with real content.

Block pages have no table of contents, so the preview can take the whole width. The text below it keeps the usual width of the prose and stays aligned to the left.

### Code

- A page block shows the structure of a page: the shell, the page header, tabs and cards. Fill the cards with `placeholder-slot` instead of real content such as form fields, so the structure stays easy to read. Leave the placeholders without a `name`, and give each a height that suggests the size of its content. Pass `name` only where the label helps, such as in a component example that shows which slot holds what.
- Other blocks, such as the login, show complete content. Keep them ready to copy: import from `@shopware-ag/meteor-component-library`, keep the sample data in the file, and do not use i18n or composables of the docs app.
- Style only with Meteor tokens, in a `<style scoped>` block. Small layout classes such as `.stack` or `.grid` belong into the block itself.
- Mark the places to replace, such as a timeout that stands in for a request, with a short comment.

## Prose rules

- Do not use emojis.
- Do not use em dashes or similar characters. Use commas, parentheses, or separate sentences.
- In body copy, refer to public components by their capitalized display name in bold, such as **Button** or **Badge**. Avoid `mt-*` tag names in prose unless the tag itself is what you are explaining.
- When you mention another component or another docs page that exists on the site, link the name to its page, for example `[**Radio Group**](/components/radio-group)` or `[the introduction](/getting-started/introduction)`. Do not link the current page to itself, and do not link a name when its page does not exist yet.
- Write for a developer who is choosing and implementing the component, not reading its source.
