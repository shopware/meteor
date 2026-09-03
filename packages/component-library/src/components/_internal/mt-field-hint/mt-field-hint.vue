<template>
  <span class="mt-field-hint">
    <span v-if="!hideIcon" class="mt-field-hint__icon-wrapper">
      <mt-icon
        class="mt-field-hint__icon"
        :name="icon"
        size="var(--scale-size-12)"
        color="var(--color-icon-secondary-default)"
        decorative
      />
    </span>
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
    /**
     * Icon shown in front of the hint text.
     */
    icon?: string;
  }>(),
  {
    hideIcon: false,
    icon: "solid-info-circle",
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
  color: var(--color-text-secondary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs, 14px);
  font-weight: var(--font-weight-regular);
  line-height: var(--font-line-height-xs);
}

/*
 * The wrapper is exactly one line tall (1lh = the inherited line-height) and
 * centers the icon inside it. For a single line this is plain flex centering,
 * for wrapped text the icon stays on the first line. No fixed values needed.
 */
.mt-field-hint__icon-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 1lh;
}

.mt-field-hint__icon {
  flex-shrink: 0;
}

.mt-field-hint__text {
  min-width: 0;
}
</style>
