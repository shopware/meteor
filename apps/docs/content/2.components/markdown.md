---
title: Markdown
description: Rendered Markdown in Meteor's prose styles, safe for untrusted content such as AI answers.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="markdown-basic-example"}
::

## Usage

**Markdown** renders a Markdown string, typically the answer of an AI model, with headings, lists, tables, code blocks and links in [prose styles](/documentation/design/prose). Use it wherever Markdown arrives as text, for example inside a **Message**, and set `streaming` while the text is still arriving.

It supports GitHub Flavored Markdown: tables, task lists, strikethrough and links written as bare addresses. Raw HTML in the content shows as text.

```ts
import { MtMarkdown } from "@shopware-ag/meteor-component-library";
```

## Examples

### Streaming

Pass the text as it arrives and set `streaming` until the answer is complete. The text still appears word by word, but only once it renders as it will in the finished answer, so raw Markdown never flashes while the answer streams.

::component-example{name="markdown-streaming-example"}
::

### Images

No image loads unless its address starts with one of `allowed-image-prefixes`. Other images show as a link to the image.

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

### Streaming

- With `streaming`, only what already renders as in the finished answer shows. Once `streaming` is off, the complete text renders unchanged.
- Syntax at the end that has nothing to format yet, such as `**`, `##`, `- ` or `- [x]`, waits until its content arrives. Punctuation at the very end can still be the start of syntax, so it appears with the next part of the answer.
- Emphasis, inline code and strikethrough that already have content render as if they were complete. A link whose address is still arriving shows as text, and an image whose address is still arriving is left out.
- A table appears with its header and first row, then row by row.
- A code block without its closing fence renders as a code block up to the end of the text. Its copy button appears once the next block starts or the answer is complete.
- Blocks that are finished don't render again while the answer grows, so long answers stay fast.
- Three constructs only resolve with text that comes later, and models rarely write them. Tables whose rows don't start with `|` show their first line as text until the delimiter row arrives. Headings underlined with `===` or `---` show as a paragraph until the next block starts. Reference links like `[text][1]` show as text until their definition arrives.

### Content

- Line breaks follow CommonMark, as on GitHub: a single line break inside a paragraph becomes a space. End a line with two spaces or a backslash for a hard break.
- Common named character references, such as `&amp;` and `&nbsp;`, are decoded, except in code.
- Each code block has a button that copies its code. The language from the opening fence is added to the code as a `language-*` class.

### Security

The content is treated as untrusted, because a model's answer can be influenced by the data it reads.

- Raw HTML, such as `<script>` or `<img onerror>`, shows as text. The only exception is `<br>`, which becomes a line break, because models often write it into table cells.
- Links only use `http`, `https`, `mailto` and `tel`, or have no scheme, like `/orders` or `#top`. Links with any other scheme, such as `javascript:`, show as text. Links with a full `http` or `https` address open in a new tab, without access to the page that opened them.
- Images load only from `https` addresses that start with one of `allowed-image-prefixes`. The address of an image loads without a click, so an image in an answer could otherwise send data from the conversation to another server.

## Accessibility

- The content renders as semantic HTML: headings, lists, tables with column headers, quotes and code. Models choose heading levels themselves, so place the component where any heading level is acceptable, for example inside a **Message**.
- A wide table or code block scrolls horizontally inside its own box instead of widening the page.
- The copy button of a code block has an accessible name, which changes to "Copied" after copying. It is hidden until the code block is hovered or focused, and always visible on touch screens.
- Task list checkboxes are disabled, because they show a state and can't be changed.

## Related components

- [**Text**](/components/text): for plain text that contains no Markdown.
- [**Text Editor**](/components/text-editor): for rich text that users write and edit.
