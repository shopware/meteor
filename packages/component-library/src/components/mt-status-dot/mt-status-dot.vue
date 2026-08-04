<template>
  <span
    class="mt-status-dot"
    :class="[
      `mt-status-dot--variant-${variant}`,
      `mt-status-dot--size-${size}`,
      { 'mt-status-dot--pulse': pulse },
    ]"
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
     * Adds a pulsating ring around the dot to signal an ongoing, live activity
     * (e.g. something is currently active or processing). The animation is
     * disabled for users who prefer reduced motion.
     */
    pulse?: boolean;
    /**
     * An accessible label describing the status. When omitted the dot is treated
     * as decorative and hidden from assistive technology.
     */
    label?: string;
  }>(),
  {
    variant: "neutral",
    size: "m",
    pulse: false,
    label: undefined,
  },
);
</script>

<style scoped>
.mt-status-dot {
  position: relative;
  display: inline-block;
  flex-shrink: 0;
  border-radius: var(--border-radius-round);
  background-color: var(--mt-status-dot-color);
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
  --mt-status-dot-color: var(--color-icon-primary-disabled);
}

.mt-status-dot--variant-info {
  --mt-status-dot-color: var(--color-icon-brand-default);
}

.mt-status-dot--variant-attention {
  --mt-status-dot-color: var(--color-icon-attention-default);
}

.mt-status-dot--variant-critical {
  --mt-status-dot-color: var(--color-icon-critical-default);
}

.mt-status-dot--variant-positive {
  --mt-status-dot-color: var(--color-icon-positive-default);
}

.mt-status-dot--pulse::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-color: var(--mt-status-dot-color);
  animation: mt-status-dot-pulse 1.5s ease infinite;
}

@keyframes mt-status-dot-pulse {
  0% {
    transform: scale(1);
    opacity: 0.75;
  }

  100% {
    transform: scale(2.25);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mt-status-dot--pulse::after {
    animation: none;
  }
}
</style>
