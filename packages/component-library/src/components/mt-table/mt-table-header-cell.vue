<template>
  <th class="mt-table-header-cell" :class="`mt-table-header-cell--align-${align}`">
    <slot />
  </th>
</template>

<script setup lang="ts">
/**
 * Experimental: the API of mt-table-header-cell may still change in a future release.
 */

withDefaults(
  defineProps<{
    /**
     * Horizontal alignment of the content. Use `end` for numbers so they line up with their cells.
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
   * The content of the header cell.
   */
  default?: () => unknown;
}>();
</script>

<style scoped>
.mt-table-header-cell {
  padding: var(--scale-size-8) var(--scale-size-16);
  border-bottom: var(--scale-size-1) solid var(--color-border-secondary-default);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary-default);
  text-align: start;
  vertical-align: middle;
  white-space: nowrap;
}

.mt-table-header-cell--align-center {
  text-align: center;
}

.mt-table-header-cell--align-end {
  text-align: end;
}

/* Row headers (`scope="row"`) in the body and footer read like the other cells of their row */
.mt-table-body .mt-table-header-cell,
.mt-table-footer .mt-table-header-cell {
  padding: var(--scale-size-12) var(--scale-size-16);
  color: var(--color-text-primary-default);
  white-space: normal;
}

.mt-table-body > tr:last-child > .mt-table-header-cell {
  border-bottom: 0;
}

.mt-table-footer .mt-table-header-cell {
  border-bottom: 0;
}

.mt-table-footer > tr:first-child > .mt-table-header-cell {
  border-top: var(--scale-size-1) solid var(--color-border-secondary-default);
}
</style>
