---
title: useFutureFlags
description: Reads the active future flags inside a component so it can adapt to behavior the application has opted into.
---

::note
`useFutureFlags` is internal to the component library and is not exported from the package. It is documented for contributors building or extending Meteor components. Applications opt into flags through the [**Theme Provider**](/utilities/components/theme-provider) `future` prop, not this composable.
::

## Usage

`useFutureFlags` returns the future flags currently provided by the nearest [**Theme Provider**](/utilities/components/theme-provider). Call it inside a component to adapt behavior when a flag is enabled, for example dropping a default margin once `removeDefaultMargin` is on. When no Theme Provider is mounted, every flag falls back to `false`.

```ts
import { computed } from "vue";
import { useFutureFlags } from "../../composables/useFutureFlags";

const futureFlags = useFutureFlags();

const hasDefaultMargin = computed(() => !futureFlags.removeDefaultMargin);
```

## API

`useFutureFlags()` returns a `FutureFlags` object:

| Flag | Type | Default | Description |
| --- | --- | --- | --- |
| `removeCardWidth` | `boolean` | `false` | Removes the maximum width constraint from `mt-card`. |
| `removeDefaultMargin` | `boolean` | `false` | Removes the default outer margin from components such as cards, tabs, checkboxes, switches, and text fields. |
| `removeSwitchMinHeight` | `boolean` | `false` | Removes the minimum height from a non-bordered `mt-switch`. |
| `bannerFullWidth` | `boolean` | `false` | Makes `mt-banner` span the full width of its container. |

## Related

- [**Theme Provider**](/utilities/components/theme-provider): provides the flags this composable reads.
