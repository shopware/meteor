<template>
  <span class="mt-badge" :class="badgeClasses" v-bind="$attrs">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

export type MtBadgeVariant = "neutral" | "info" | "attention" | "critical" | "positive";
export type MtBadgeSize = "s" | "m" | "l";

const props = withDefaults(
  defineProps<{
    variant?: MtBadgeVariant;
    size?: MtBadgeSize;
  }>(),
  {
    variant: "neutral",
    size: "m",
  },
);

const badgeClasses = computed(() => [
  `mt-badge--variant-${props.variant}`,
  `mt-badge--size-${props.size}`,
]);
</script>

<style scoped>
.mt-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius-s);
  white-space: nowrap;
  vertical-align: middle;
}

/* Size variants */
.mt-badge--size-s {
  padding: 0.125rem 0.375rem;
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
  min-height: 1.25rem;
}

.mt-badge--size-m {
  padding: 0.25rem 0.5rem;
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  min-height: 1.5rem;
}

.mt-badge--size-l {
  padding: 0.375rem 0.75rem;
  font-size: var(--font-size-s);
  line-height: var(--font-line-height-s);
  min-height: 1.75rem;
}

/* Color variants */
.mt-badge--variant-neutral {
  background-color: var(--color-background-secondary-default);
  color: var(--color-text-secondary-default);
  border: 1px solid var(--color-border-secondary-default);
}

.mt-badge--variant-info {
  background-color: var(--color-background-brand-default);
  color: var(--color-text-brand-default);
  border: 1px solid var(--color-border-brand-default);
}

.mt-badge--variant-attention {
  background-color: var(--color-background-attention-default);
  color: var(--color-text-attention-default);
  border: 1px solid var(--color-border-attention-default);
}

.mt-badge--variant-critical {
  background-color: var(--color-background-critical-default);
  color: var(--color-text-critical-default);
  border: 1px solid var(--color-border-critical-default);
}

.mt-badge--variant-positive {
  background-color: var(--color-background-positive-default);
  color: var(--color-text-positive-default);
  border: 1px solid var(--color-border-positive-default);
}
</style>
