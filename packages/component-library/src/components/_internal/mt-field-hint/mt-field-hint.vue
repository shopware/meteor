<template>
  <span class="mt-field-hint">
    <mt-icon
      v-if="!hideIcon"
      class="mt-field-hint__icon"
      name="solid-info-circle"
      size="var(--scale-size-12)"
      color="var(--color-icon-secondary-default)"
      decorative
    />
    <span class="mt-field-hint__text">
      <slot />
    </span>
  </span>
</template>

<script setup lang="ts">
import MtIcon from "@/components/mt-icon/mt-icon.vue";

withDefaults(
  defineProps<{
    /**
     * Hides the default info icon. Used when the hint content is fully custom
     * (e.g. provided via the `#hint` slot with its own icon).
     */
    hideIcon?: boolean;
  }>(),
  {
    hideIcon: false,
  },
);
</script>

<style scoped>
.mt-field-hint {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: var(--scale-size-4);
  padding: var(--scale-size-3);
  min-width: 0;
}

.mt-field-hint__icon {
  flex-shrink: 0;
  /*
   * Keeps the icon optically centered on the first line of the hint instead of
   * on the whole block, so it stays put when the hint text wraps.
   */
  margin-top: calc((var(--font-line-height-xs) - var(--scale-size-12)) / 2);
}

.mt-field-hint__text {
  color: var(--color-text-secondary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs, 14px);
  font-weight: var(--font-weight-regular);
  line-height: var(--font-line-height-xs);
}
</style>
