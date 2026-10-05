---
title: Context Usage
description: A small ring in a button that shows how much of a model's context window is used.
---

::warning
**Experimental.** The API may still change in a future release.
::

::component-example{name="context-usage-basic-example"}
::

## Usage

**Context Usage** shows how much of a model's context window a conversation uses, so users know when to start a new one. It is a small ring in a button with the token counts in a tooltip, made for the `tools` slot of a [**Prompt Field**](/components/prompt-field), next to the **+** menu.

```ts
import { MtContextUsage } from "@shopware-ag/meteor-component-library";
```

## API reference

:component-api

## Best practices

::do-dont{vertical}
#do

- Set `total` to the context window of the selected model.
- Take `used` from the usage of the latest response, because every request sends the whole conversation.
- Place it in the `tools` slot of the [**Prompt Field**](/components/prompt-field), next to the **+** menu.

#dont

- Do not use **Context Usage** for other progress; use [**Progress Bar**](/components/progress-bar).

::

## Behavior

- `used` and `total` are token counts. The ring fills with `used / total`, clamped to 100%.
- The ring turns to the attention color at 80% and to the critical color at 95%.
- The tooltip shows the counts in a short, localized form, for example "84K of 200K tokens used (42%)".
- Listeners such as `@click` reach the button, for example to offer starting a new conversation.

## Accessibility

- The button is named "Context usage" (or `label`) and described by the same summary as the tooltip.
- The tooltip opens on hover and when the button receives the focus.
- The color is never the only signal; the percentage is always part of the summary.

## Related components

- [**Prompt Field**](/components/prompt-field): for the prompt whose `tools` slot usually holds the button.
- [**Progress Bar**](/components/progress-bar): when you show the progress of a task rather than the usage of a context window.
