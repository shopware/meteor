<template>
  <thead class="mt-table-header">
    <slot />
  </thead>
</template>

<script setup lang="ts">
/**
 * Experimental: the API of mt-table-header may still change in a future release.
 */

defineSlots<{
  /**
   * The header rows, usually one `mt-table-row` with `mt-table-header-cell` items.
   */
  default?: () => unknown;
}>();
</script>

<style scoped>
/*
 * Sticks once the table's scroll container is limited in height, without a limit it scrolls with the page.
 * Set `--mt-table-background` on the table or an ancestor when the table sits on another surface.
 */
.mt-table-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: var(--mt-table-background, var(--color-elevation-surface-default));
}
</style>
