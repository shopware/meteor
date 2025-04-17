<template>
  <div class="mt-grid" :style="{ '--_mt-grid-columns': `calc(100% / ${columns})` }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { defineSlots } from "vue";

defineProps<{
  columns: number;
}>();

defineSlots<{
  default(): any;
}>();
</script>

<style>
.mt-grid {
  --_mt-grid-gap: 32px;
  --_mt-grid-columns-without-gap: calc(var(--_mt-grid-columns) - var(--_mt-grid-gap));

  gap: var(--_mt-grid-gap);
  align-items: end;
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(max(var(--_mt-grid-columns-without-gap), 200px), 1fr)
  );
}
</style>
