<template>
  <component :is="as" :class="['mt-container', `mt-container--size-${size}`]">
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { Component } from "vue";

withDefaults(
  defineProps<{
    /**
     * The maximum width of the container: `s` (680px), `m` (960px) or `l` (1280px).
     * The values come from the `--container-size-*` custom properties.
     */
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
  max-width: var(--container-size-s);
}

.mt-container--size-m {
  max-width: var(--container-size-m);
}

.mt-container--size-l {
  max-width: var(--container-size-l);
}
</style>
