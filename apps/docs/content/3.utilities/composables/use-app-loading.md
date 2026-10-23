---
title: useAppLoading
description: A composable that reports loading to the surrounding App shell, which shows its loading bar meanwhile.
---

::warning
**Experimental.** The API may still change in a future release.
::

## Usage

`useAppLoading` reports the loading of a view inside [**App**](/components/app), such as a page that fetches its data. Pass whether the view is loading; while it is, the shell shows its loading bar, if `loading-bar` is on. A page can pass the same state that it passes to `is-loading` of [**Page**](/components/page).

```ts
import { ref } from "vue";
import { useAppLoading } from "@shopware-ag/meteor-component-library";

const isLoading = ref(true);

useAppLoading(isLoading);

async function load() {
  isLoading.value = true;

  try {
    product.value = await fetchProduct(id);
  } finally {
    isLoading.value = false;
  }
}
```

## API

### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `isLoading` | `MaybeRefOrGetter<boolean>` | Whether the view is loading. |

## Behavior

- When several views report loading, the loading bar runs until none of them is loading anymore. Navigations of Vue Router run it as well.
- The loading bar appears only after 200ms, so quick loading doesn't show it, and stays for at least 500ms once shown.
- A view stops reporting loading when it unmounts. A view that `<KeepAlive>` keeps doesn't report it while it isn't shown.
- Outside of a shell, the call does nothing.

## Related components

- [**App**](/components/app): the shell that shows the loading bar.
- [**Page**](/components/page): its `is-loading` prop shows a placeholder in the header while the page loads.
