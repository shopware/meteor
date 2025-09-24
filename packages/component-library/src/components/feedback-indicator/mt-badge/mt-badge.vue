<template>
  <span class="mt-badge" :class="badgeClasses" v-bind="$attrs">
    <span
      v-if="statusIndicator"
      class="mt-badge__indicator"
      aria-hidden="true"
      data-testid="mt-badge__indicator"
    />
    <mt-icon v-if="icon" :name="icon" :size="iconSize" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";

const props = withDefaults(
  defineProps<{
    variant?: "neutral" | "info" | "attention" | "critical" | "positive";
    icon?: string;
    size?: "s" | "m" | "l";
    statusIndicator?: boolean;
  }>(),
  {
    variant: "neutral",
    size: "s",
    icon: undefined,
    statusIndicator: false,
  },
);

defineSlots<{
  default: null;
  icon: { size: number };
}>();

const size = computed(() => {
  const normalizedSize = String(props.size ?? "s").toLowerCase();
  return ["s", "m", "l"].includes(normalizedSize) ? normalizedSize : "s";
});

const iconSize = computed(() => (size.value === "l" ? "12" : "10"));

const badgeClasses = computed(() => [
  `mt-badge--variant-${props.variant}`,
  `mt-badge--size-${size.value}`,
]);
</script>

<style scoped>
.mt-badge {
  display: inline-flex;
  align-items: center;
  border-radius: var(--border-radius-round);
  flex-shrink: 0;
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary-default);
}

.mt-badge--size-s {
  height: var(--scale-size-20);
  padding: 0 var(--scale-size-8);
  gap: var(--scale-size-4);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);

  .mt-badge__indicator {
    width: var(--scale-size-8);
    height: var(--scale-size-8);
  }
}

.mt-badge--size-m {
  height: var(--scale-size-24);
  padding: 0 var(--scale-size-10);
  gap: var(--scale-size-4);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);

  .mt-badge__indicator {
    width: var(--scale-size-8);
    height: var(--scale-size-8);
  }
}

.mt-badge--size-l {
  height: var(--scale-size-28);
  padding: 0 var(--scale-size-12);
  gap: var(--scale-size-6);
  font-size: var(--font-size-s);
  line-height: var(--font-line-height-s);

  .mt-badge__indicator {
    width: var(--scale-size-10);
    height: var(--scale-size-10);
  }
}

.mt-badge--variant-neutral {
  background-color: var(--color-background-secondary-default);
  border: 1px solid var(--color-border-primary-default);

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
