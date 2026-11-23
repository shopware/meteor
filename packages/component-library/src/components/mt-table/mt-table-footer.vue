<template>
  <tfoot class="mt-table-footer">
    <slot />
  </tfoot>
</template>

<script setup lang="ts">
/**
 * Experimental: the API of mt-table-footer may still change in a future release.
 */

defineSlots<{
  /**
   * The footer rows, e.g. a row with totals.
   */
  default?: () => unknown;
}>();
</script>
