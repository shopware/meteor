---
title: useUnsavedChanges
description: A composable that asks the user before unsaved changes in a view get lost.
---

::warning
**Experimental.** The API may still change in a future release.
::

## Usage

`useUnsavedChanges` protects the unsaved changes of a view inside [**App**](/components/app), such as a form. Pass whether the view has unsaved changes; the shell then asks the user whether to discard them before a navigation or a reload loses them. Your application decides what counts as a change, so this works with any form handling.

```ts
import { ref } from "vue";
import { useUnsavedChanges } from "@shopware-ag/meteor-component-library";

const savedProduct = ref(JSON.stringify(product.value));

useUnsavedChanges(() => JSON.stringify(product.value) !== savedProduct.value);
```

To leave the view without a navigation, for example when closing an editor, ask with `confirmLeave` from [**useApp**](/utilities/composables/use-app) first:

```ts
const { confirmLeave } = useApp();

async function close() {
  if (await confirmLeave()) closeEditor();
}
```

## API

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `hasChanges` | `MaybeRefOrGetter<boolean>` | Whether the view has unsaved changes. |

## Behavior

- With Vue Router, the shell asks when a navigation leaves the route that renders the view, or changes the params of that route, for example from one product to the next. Changes to the query or the hash and moves between the child routes of that route don't ask.
- Before a reload or closing the tab, the browser shows its own prompt. The shell only listens for it while there are unsaved changes.
- One question is open at a time. Asking again while it is open waits for the same answer.
- Only "Discard changes" leaves; closing the question in any other way keeps the changes.
- A view that `<KeepAlive>` keeps doesn't ask while it isn't shown.
- Views that no route renders, such as the content of the shell's header, navigation or sidebar, ask before every navigation to another path.
- Global guards that the app registers before the shell mounts run before the question.
- The texts of the question are translated for English and German.
- Outside of a shell, the call does nothing.

## Related components

- [**App**](/components/app): the shell that asks before the changes get lost.
- [**Page**](/components/page): its close button navigates, so the shell asks before it leaves a page with unsaved changes.
