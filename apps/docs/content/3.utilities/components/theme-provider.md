---
title: Theme Provider
description: Provides library-wide settings, such as future flags, to the Meteor components beneath it.
---

## Usage

**Theme Provider** wraps your application, or any subtree, and provides shared settings to the Meteor components inside it. Its main use today is opting into future flags: behavior that becomes the default in the next major release. Enabling them early keeps your application aligned with where the library is heading and reduces the work required when you upgrade.

```vue
<script setup lang="ts">
import { MtThemeProvider } from "@shopware-ag/meteor-component-library";

const future = {
  removeCardWidth: true,
  removeDefaultMargin: true,
};
</script>

<template>
  <MtThemeProvider :future="future">
    <!-- Your application -->
  </MtThemeProvider>
</template>
```

The `future` prop takes an object. All flags default to `false`, so behavior is unchanged until you opt in. The optional `all` key sets the baseline, and any individual flag you list overrides it, so `{ all: true }` enables every current _and_ upcoming flag automatically.

| Goal | `future` value |
| --- | --- |
| Opt out of everything (default) | Omit the prop, or don't mount a Theme Provider |
| Opt into one flag | `{ removeCardWidth: true }` |
| Opt into several flags | `{ removeCardWidth: true, bannerFullWidth: true }` |
| Opt into everything | `{ all: true }` |
| Opt into everything except one | `{ all: true, removeCardWidth: false }` |

## Future flags

| Flag | Effect |
| --- | --- |
| `removeCardWidth` | Removes the maximum width constraint from `mt-card`. |
| `removeDefaultMargin` | Removes the default outer margin from components such as cards, tabs, checkboxes, switches, and text fields. |
| `removeSwitchMinHeight` | Removes the minimum height from a non-bordered `mt-switch`. |
| `bannerFullWidth` | Makes `mt-banner` span the full width of its container. |
