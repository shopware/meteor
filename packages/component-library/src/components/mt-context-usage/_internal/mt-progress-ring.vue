<template>
  <svg
    class="mt-progress-ring"
    :class="`mt-progress-ring--${variant}`"
    viewBox="0 0 20 20"
    :width="size"
    :height="size"
    aria-hidden="true"
  >
    <circle class="mt-progress-ring__track" cx="10" cy="10" :r="RADIUS" />
    <circle
      class="mt-progress-ring__indicator"
      cx="10"
      cy="10"
      :r="RADIUS"
      :stroke-dasharray="CIRCUMFERENCE"
      :stroke-dashoffset="CIRCUMFERENCE * (1 - percent / 100)"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const RADIUS = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** A decorative ring; the component that uses it provides the accessible value. */
const props = withDefaults(
  defineProps<{
    /** The progress in percent; values outside 0–100 are clamped. */
    value: number;
    variant?: "default" | "attention" | "critical";
    size?: string;
  }>(),
  {
    variant: "default",
    size: "16px",
  },
);

const percent = computed(() => Math.min(100, Math.max(0, props.value || 0)));
</script>

<style>
.mt-progress-ring {
  flex: none;
  transform: rotate(-90deg);
}

.mt-progress-ring__track,
.mt-progress-ring__indicator {
  fill: none;
  stroke-width: 2.5;
}

.mt-progress-ring__track {
  stroke: var(--color-border-primary-default);
}

.mt-progress-ring__indicator {
  stroke: var(--color-icon-primary-default);
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease-out;
}

.mt-progress-ring--attention .mt-progress-ring__indicator {
  stroke: var(--color-icon-attention-default);
}

.mt-progress-ring--critical .mt-progress-ring__indicator {
  stroke: var(--color-icon-critical-default);
}

@media (prefers-reduced-motion: reduce) {
  .mt-progress-ring__indicator {
    transition: none;
  }
}
</style>
