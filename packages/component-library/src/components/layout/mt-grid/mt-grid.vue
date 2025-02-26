<template>
  <div class="mt-grid">
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

  gap: var(--_mt-grid-gap);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(max(calc(33% - 32px), 300px), 1fr));
}
</style>
