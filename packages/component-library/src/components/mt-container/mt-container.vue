<template>
  <component :is="as" :class="['mt-container', `mt-container--width-${width}`]">
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { Component } from "vue";

/**
 * A layout wrapper that fills the available width up to a maximum width and centers itself.
 *
 * @experimental The API may still change in a future release.
 */
withDefaults(
  defineProps<{
    /** The maximum width of the container: `s` (680px), `m` (960px) or `l` (1280px). */
    width?: "s" | "m" | "l";
    /**
     * The element or component that renders the container.
     */
    as?: string | Component;
  }>(),
  {
    width: "m",
    as: "div",
  },
);

defineSlots<{
  default?(): unknown;
}>();
</script>

<style scoped>
.mt-container {
  width: 100%;
  margin-inline: auto;
}

.mt-container--width-s {
  max-width: 42.5rem;
}

.mt-container--width-m {
  max-width: 60rem;
}

.mt-container--width-l {
  max-width: 80rem;
}
</style>
