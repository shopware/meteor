<template>
  <div
    :class="['mt-grid-item', { 'mt-grid-item--full': span === 'full' }]"
    :style="{ '--mt-grid-item-span': span === 'full' ? undefined : span }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /**
     * How many columns the item spans. `full` always stretches across the
     * whole row, also when the grid has collapsed to fewer columns.
     */
    span?: number | "full";
  }>(),
  {
    span: 1,
  },
);

defineSlots<{
  default?: null;
}>();
</script>

<style>
.mt-grid-item {
  grid-column: span var(--mt-grid-item-span, 1);
  min-width: 0;
}

.mt-grid-item--full {
  grid-column: 1 / -1;
}
</style>
