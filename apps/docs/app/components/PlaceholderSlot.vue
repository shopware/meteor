<script setup lang="ts">
import { MtText } from "@shopware-ag/meteor-component-library";

/**
 * Stands in for the content of a slot in the examples: a hatched box that fills the slot, at least
 * as tall as a button, with the name of the slot in its center when it is given.
 */
defineProps<{
  /** The name of the slot, shown when the example is about which slot holds what. */
  name?: string;
  /**
   * Keeps 8px away from the edges of the slot, for regions whose edges are visible, such as the
   * framed content of App.
   */
  inset?: boolean;
}>();
</script>

<template>
  <div class="placeholder-slot" :class="{ 'placeholder-slot--inset': inset }">
    <mt-text
      v-if="name"
      class="placeholder-slot__label"
      size="xs"
      color="color-text-secondary-default"
    >
      {{ name }}
    </mt-text>
  </div>
</template>

<style scoped>
.placeholder-slot {
  display: grid;
  flex: 1;
  place-items: center;
  box-sizing: border-box;
  height: 100%;
  min-height: var(--scale-size-40);
  padding-inline: var(--scale-size-12);
  position: relative;
  isolation: isolate;
  background-color: var(--color-elevation-surface-default);
  border: 1px dashed var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
}

/* Diagonal hatching in a token color: the SVG tile masks a colored layer, as a
 * data URI can't read CSS variables. */
.placeholder-slot::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  content: "";
  background-color: var(--color-border-secondary-default);
  border-radius: inherit;
  opacity: 0.5;
  mask-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/svg%3E");
  mask-size: 10px 10px;
}

.placeholder-slot__label {
  padding: var(--scale-size-2) var(--scale-size-8);
  background-color: var(--color-elevation-surface-default);
  border-radius: var(--border-radius-s);
}

.placeholder-slot--inset {
  height: calc(100% - var(--scale-size-16));
  margin: var(--scale-size-8);
}
</style>
