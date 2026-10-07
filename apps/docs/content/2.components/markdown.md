---
title: Markdown
description: Rendered Markdown in Meteor's typography, safe for untrusted content such as AI answers.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="markdown-basic-example"}
::

## Usage

**Markdown** renders a Markdown string, typically the answer of an AI model, with headings, lists, tables, code blocks and links in Meteor's typography. Use it wherever Markdown arrives as text, and set `streaming` while the text is still arriving.

It supports GitHub Flavored Markdown: tables, task lists, strikethrough and links written as bare addresses. Raw HTML in the content shows as text.

```ts
import { MtMarkdown } from "@shopware-ag/meteor-component-library";
```

## Examples

### Streaming

Pass the text as it arrives and set `streaming` until the answer is complete. Unfinished syntax at the end renders as if it were complete, so raw Markdown doesn't flash while the answer streams.

::component-example{name="markdown-streaming-example" fullWidth}
::

### Images

No image with a full address loads unless the address starts with one of `allowed-image-prefixes`. Other images show only their alternative text.

::component-example{name="markdown-images-example"}
::

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Use it for text that arrives as Markdown, such as an AI answer, and keep `streaming` set until the answer is complete.
- Allow images only from addresses you control, such as your own media storage, and end each prefix with `/`.

#dont

- Do not convert Markdown to HTML yourself and insert it with `v-html`; that bypasses the security checks.
- Do not use it for text that the user edits; use [**Text Editor**](/components/text-editor) instead.
- Do not wrap it in [**Text**](/components/text); it sets its own typography, and its blocks can't sit inside a paragraph.
- Do not set `streaming` on text that is already complete; it may change how an unfinished construct at the end renders.

::

## Behavior

**Markdown** builds on [Comark](https://comark.dev).

### Streaming

- With `streaming`, unfinished syntax at the end renders as if it were complete, such as `**bold` as bold text. Syntax that has nothing to format yet, such as `**` or `##`, waits until its content arrives.
- A link whose address is still arriving shows as text, and a code block without its closing fence renders as a code block.

### Content

- Line breaks follow CommonMark, as on GitHub: a single line break inside a paragraph becomes a space. End a line with two spaces or a backslash for a hard break.
- Character references, such as `&amp;`, are decoded, except in code.
- Each code block has a button that copies its code. The language from the opening fence is added to the code as a `language-*` class.

### Security

The content is treated as untrusted, because a model's answer can be influenced by the data it reads.

- Raw HTML, such as `<script>`, `<img onerror>` or `<br>`, shows as text.
- Links only use `http`, `https`, `mailto` and `tel`, or have no scheme, like `/orders` or `#top`. Links with any other scheme, such as `javascript:`, show as text. Links with a full `http` or `https` address open in a new tab, without access to the page that opened them.
- Images with a full address load only if it starts with one of `allowed-image-prefixes`. The address of an image loads without a click, so an image in an answer could otherwise send data from the conversation to another server.

## Accessibility

- The content renders as semantic HTML: headings, lists, tables with column headers, quotes and code. Models choose heading levels themselves, so place the component where any heading level is acceptable.
- A wide table or code block scrolls horizontally inside its own box instead of widening the page.
- The copy button of a code block has an accessible name, which changes to "Copied" after copying. It is hidden until the code block is hovered or focused, and always visible on touch screens.
- Task list checkboxes are disabled, because they show a state and can't be changed.

## Related components

- [**Text**](/components/text): for plain text that contains no Markdown.
- [**Text Editor**](/components/text-editor): for rich text that users write and edit.
