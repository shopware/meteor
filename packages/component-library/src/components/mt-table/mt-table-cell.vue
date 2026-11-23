<template>
  <td class="mt-table-cell" :class="`mt-table-cell--align-${align}`">
    <slot />
  </td>
</template>

<script setup lang="ts">
/**
 * Experimental: the API of mt-table-cell may still change in a future release.
 */

withDefaults(
  defineProps<{
    /**
     * Horizontal alignment of the content. `end` also renders digits with equal widths, so numbers line up.
     * @values start, center, end
     */
    align?: "start" | "center" | "end";
  }>(),
  {
    align: "start",
  },
);

defineSlots<{
  /**
   * The content of the cell.
   */
  default?: () => unknown;
}>();
</script>

<style scoped>
.mt-table-cell {
  padding: var(--scale-size-12) var(--scale-size-16);
  border-bottom: var(--scale-size-1) solid var(--color-border-secondary-default);
  text-align: start;
  vertical-align: middle;
}

.mt-table-cell--align-center {
  text-align: center;
}

.mt-table-cell--align-end {
  text-align: end;
  font-variant-numeric: tabular-nums;
}

.mt-table-body > tr:last-child > .mt-table-cell {
  border-bottom: 0;
}

.mt-table-footer .mt-table-cell {
  border-bottom: 0;
  font-weight: var(--font-weight-medium);
}

.mt-table-footer > tr:first-child > .mt-table-cell {
  border-top: var(--scale-size-1) solid var(--color-border-secondary-default);
}
</style>
