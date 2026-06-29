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

All flags default to `false`, so component behavior is unchanged until you opt in.

## Future flags

| Flag | Effect |
| --- | --- |
| `removeCardWidth` | Removes the maximum width constraint from `mt-card`. |
| `removeDefaultMargin` | Removes the default outer margin from components such as cards, tabs, checkboxes, switches, and text fields. |

## API reference

:component-api
