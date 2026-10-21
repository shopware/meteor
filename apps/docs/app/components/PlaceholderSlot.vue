<script setup lang="ts">
import { MtText } from "@shopware-ag/meteor-component-library";

/**
 * Stands in for the content of a slot in the examples: a tinted box that fills the slot, at least
 * as tall as a button, with the name of the slot in its center.
 */
defineProps<{
  /** The name of the slot. */
  name: string;
  /**
   * Keeps 8px away from the edges of the slot, for regions whose edges are visible, such as the
   * framed content of App.
   */
  inset?: boolean;
}>();
</script>

<template>
  <div class="placeholder-slot" :class="{ 'placeholder-slot--inset': inset }">
    <mt-text size="xs" color="color-text-secondary-default">{{ name }}</mt-text>
  </div>
</template>

<style scoped>
.placeholder-slot {
  display: grid;
  flex: 1;
  place-items: center;
  box-sizing: border-box;
  min-height: max(var(--scale-size-40), 100%);
  padding-inline: var(--scale-size-12);
  background-color: var(--color-background-brand-default);
  border-radius: var(--border-radius-m);
}

.placeholder-slot--inset {
  min-height: max(var(--scale-size-40), calc(100% - var(--scale-size-16)));
  margin: var(--scale-size-8);
}
</style>
