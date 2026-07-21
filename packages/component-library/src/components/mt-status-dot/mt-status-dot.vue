<template>
  <span
    class="mt-status-dot"
    :class="[`mt-status-dot--variant-${variant}`, `mt-status-dot--size-${size}`]"
    v-bind="$attrs"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : true"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /**
     * The semantic color of the status dot.
     *
     * @values neutral, info, attention, critical, positive
     */
    variant?: "neutral" | "info" | "attention" | "critical" | "positive";
    /**
     * The diameter of the dot.
     *
     * @values s, m, l
     */
    size?: "s" | "m" | "l";
    /**
     * An accessible label describing the status. When omitted the dot is treated
     * as decorative and hidden from assistive technology.
     */
    label?: string;
  }>(),
  {
    variant: "neutral",
    size: "m",
    label: undefined,
  },
);
</script>

<style scoped>
.mt-status-dot {
  display: inline-block;
  flex-shrink: 0;
  border-radius: var(--border-radius-round);
}

.mt-status-dot--size-s {
  width: var(--scale-size-6);
  height: var(--scale-size-6);
}

.mt-status-dot--size-m {
  width: var(--scale-size-8);
  height: var(--scale-size-8);
}

.mt-status-dot--size-l {
  width: var(--scale-size-10);
  height: var(--scale-size-10);
}

.mt-status-dot--variant-neutral {
  background-color: var(--color-icon-primary-disabled);
}

.mt-status-dot--variant-info {
  background-color: var(--color-icon-brand-default);
}

.mt-status-dot--variant-attention {
  background-color: var(--color-icon-attention-default);
}

.mt-status-dot--variant-critical {
  background-color: var(--color-icon-critical-default);
}

.mt-status-dot--variant-positive {
  background-color: var(--color-icon-positive-default);
}
</style>
