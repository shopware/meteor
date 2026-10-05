<template>
  <mt-text v-bind="{ color: 'color-text-secondary-default', ...$attrs }" class="mt-text-shimmer">
    <slot />
  </mt-text>
</template>

<script setup lang="ts">
import MtText from "@/components/mt-text/mt-text.vue";

/**
 * Text with a moving highlight that signals running AI work or another background process.
 * All props of `mt-text` pass through; `color` sets the base color of the shimmer.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineOptions({
  inheritAttrs: false,
});

defineSlots<{
  default: null;
}>();
</script>

<style>
.mt-text-shimmer {
  width: fit-content;
}

/*
 * The gradient paints transparent glyphs. Where it cannot render (no color-mix(), forced colors)
 * the text would disappear, so it stays plain there and with reduced motion.
 */
@supports ((background-clip: text) or (-webkit-background-clip: text)) and
  (color: color-mix(in srgb, red, blue)) {
  @media (prefers-reduced-motion: no-preference) and (forced-colors: none) {
    .mt-text-shimmer {
      -webkit-text-fill-color: transparent;
      background: linear-gradient(
        90deg,
        currentColor 40%,
        color-mix(in srgb, var(--color-text-primary-default) 75%, currentColor) 50%,
        currentColor 60%
      );
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      animation: mt-text-shimmer 2s linear infinite;
    }
  }
}

@keyframes mt-text-shimmer {
  from {
    background-position: -50% 0;
  }

  to {
    background-position: 150% 0;
  }
}
</style>
