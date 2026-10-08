<template>
  <component :is="as" :class="['mt-container', `mt-container--size-${size}`]">
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { Component } from "vue";

/**
 * A layout wrapper that fills the available width up to a maximum width and centers itself.
 *
 * @experimental Not for public use yet: undocumented, and it may change or be removed without notice.
 */
withDefaults(
  defineProps<{
    /** The maximum width of the container: `s` (680px), `m` (960px) or `l` (1280px). */
    size?: "s" | "m" | "l";
    /**
     * The element or component that renders the container.
     */
    as?: string | Component;
  }>(),
  {
    size: "m",
    as: "div",
  },
);

defineSlots<{
  default?: null;
}>();
</script>

<style scoped>
.mt-container {
  width: 100%;
  margin-inline: auto;
}

.mt-container--size-s {
  max-width: 42.5rem;
}

.mt-container--size-m {
  max-width: 60rem;
}

.mt-container--size-l {
  max-width: 80rem;
}
</style>
