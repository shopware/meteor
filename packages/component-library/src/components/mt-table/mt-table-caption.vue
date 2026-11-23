<template>
  <caption class="mt-table-caption">
    <slot />
  </caption>
</template>

<script setup lang="ts">
/**
 * Experimental: the API of mt-table-caption may still change in a future release.
 */

defineSlots<{
  /**
   * The caption names the table for assistive technology. Add the `visually-hidden` class to hide it visually.
   */
  default?: () => unknown;
}>();
</script>

<style scoped>
/* Same inline padding as the cells, so the caption lines up with the text of the first column */
.mt-table-caption {
  padding: 0 var(--scale-size-16) var(--scale-size-8);
  color: var(--color-text-secondary-default);
  text-align: start;
}
</style>
