<template>
  <tbody class="mt-table-body">
    <slot />
  </tbody>
</template>

<script setup lang="ts">
/**
 * Experimental: the API of mt-table-body may still change in a future release.
 */

defineSlots<{
  /**
   * The body rows, each an `mt-table-row` with `mt-table-cell` items.
   */
  default?: () => unknown;
}>();
</script>
