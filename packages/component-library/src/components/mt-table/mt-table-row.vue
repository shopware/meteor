<template>
  <tr class="mt-table-row" :class="{ 'mt-table-row--selected': selected }">
    <slot />
  </tr>
</template>

<script setup lang="ts">
/**
 * Experimental: the API of mt-table-row may still change in a future release.
 */

withDefaults(
  defineProps<{
    /**
     * Highlights the row as selected.
     */
    selected?: boolean;
  }>(),
  {
    selected: false,
  },
);

defineSlots<{
  /**
   * The cells of the row: `mt-table-header-cell` in the header, `mt-table-cell` in the body and footer.
   */
  default?: () => unknown;
}>();
</script>

<style scoped>
.mt-table-row--selected {
  background-color: var(--color-background-brand-default);
}
</style>
