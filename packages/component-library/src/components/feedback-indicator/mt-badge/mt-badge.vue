<template>
  <span class="mt-badge" :class="badgeClasses" v-bind="$attrs">
    <span v-if="statusIndicator" class="mt-badge__indicator" />
    <slot v-if="$slots.icon" name="icon" :size="iconSize" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    variant?: "neutral" | "info" | "attention" | "critical" | "positive";
    size?: "s" | "m" | "l";
    statusIndicator?: boolean;
  }>(),
  {
    variant: "neutral",
    size: "s",
    statusIndicator: false,
  },
);

defineSlots<{
  default: null;
  icon: { size: number };
}>();

const iconSize = computed(() => (props.size === "s" ? 10 : props.size === "m" ? 12 : 14));

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
  gap: var(--scale-size-4);
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary-default);
  border-radius: var(--border-radius-round);
  white-space: nowrap;
}

.mt-badge--size-s {
  padding-left: var(--scale-size-8);
  padding-right: var(--scale-size-8);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
}

.mt-badge--size-m {
  padding-left: var(--scale-size-10);
  padding-right: var(--scale-size-10);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
}

.mt-badge--size-l {
  padding-left: var(--scale-size-12);
  padding-right: var(--scale-size-12);
  font-size: var(--font-size-s);
  line-height: var(--font-line-height-s);
}

.mt-badge--variant-neutral {
  background-color: var(--color-background-secondary-default);
  border: 1px solid var(--color-border-secondary-default);

  .mt-badge__indicator {
    background-color: var(--color-icon-primary-disabled);
  }
}

.mt-badge--variant-info {
  background-color: var(--color-background-brand-default);
  border: 1px solid var(--color-border-brand-default);

  .mt-badge__indicator {
    background-color: var(--color-icon-brand-default);
  }
}

.mt-badge--variant-attention {
  background-color: var(--color-background-attention-default);
  border: 1px solid var(--color-border-attention-default);

  .mt-badge__indicator {
    background-color: var(--color-icon-attention-default);
  }
}

.mt-badge--variant-critical {
  background-color: var(--color-background-critical-default);
  border: 1px solid var(--color-border-critical-default);

  .mt-badge__indicator {
    background-color: var(--color-icon-critical-default);
  }
}

.mt-badge--variant-positive {
  background-color: var(--color-background-positive-default);
  border: 1px solid var(--color-border-positive-default);

  .mt-badge__indicator {
    background-color: var(--color-icon-positive-default);
  }
}

.mt-badge__indicator {
  width: var(--scale-size-8);
  height: var(--scale-size-8);
  border-radius: var(--border-radius-l);
}
</style>
