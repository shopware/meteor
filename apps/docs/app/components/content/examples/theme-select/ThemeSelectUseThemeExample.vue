<script setup lang="ts">
import MtThemeSelect from "@shopware-ag/meteor-component-library/MtThemeSelect";
import MtText from "@shopware-ag/meteor-component-library/MtText";
// useTheme has no subpath export, so it is imported from the barrel.
import { useTheme } from "@shopware-ag/meteor-component-library";

// Persistence and global application are disabled so the docs page itself
// stays untouched. Omit these options in your app.
const { theme, resolvedTheme } = useTheme({
  storageKey: null,
  applyToTarget: false,
});
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px">
    <mt-theme-select v-model="theme" label="Color theme" />

    <mt-text>Resolved theme: {{ resolvedTheme }}</mt-text>
  </div>
</template>
