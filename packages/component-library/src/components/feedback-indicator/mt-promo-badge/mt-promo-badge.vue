<template>
  <span class="mt-promo-badge" :class="variantClass" v-bind="$attrs">
    <mt-icon
      :name="badgeIcon"
      size="var(--scale-size-16)"
      class="mt-promo-badge__icon"
      decorative
    />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";

const props = withDefaults(
  defineProps<{
    variant?: "new" | "beta" | "shopware-ai";
    size?: "small" | "medium" | "large";
  }>(),
  {
    variant: "new",
    size: "medium",
  },
);

const badgeIcon = computed(() => {
  const iconConfig = {
    new: "solid-party-horn",
    beta: "solid-code",
    "shopware-ai": "solid-sparkles",
  };
  return iconConfig[props.variant];
});

const variantClass = computed(() => [
  `mt-promo-badge--${props.variant}`,
  `mt-promo-badge--${props.size}`,
]);
</script>

<style scoped>
.mt-promo-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--scale-size-4);
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius-xs);
  white-space: nowrap;
  user-select: none;
  transition: all 0.2s ease-in-out;
}

/* Size variants */
.mt-promo-badge--small {
  padding: var(--scale-size-4) var(--scale-size-8);
  font-size: var(--font-size-xxs);
  line-height: var(--font-line-height-xs);
  min-height: var(--scale-size-20);
}

.mt-promo-badge--medium {
  padding: var(--scale-size-6) var(--scale-size-12);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  min-height: var(--scale-size-24);
}

.mt-promo-badge--large {
  padding: var(--scale-size-8) var(--scale-size-16);
  font-size: var(--font-size-s);
  line-height: var(--font-line-height-sm);
  min-height: var(--scale-size-32);
}

/* Icon styling */
.mt-promo-badge__icon {
  flex-shrink: 0;
}

/* Color variants */
.mt-promo-badge--new {
  background-color: var(--color-background-positive-default);
  color: var(--color-text-positive-default);
  border: 1px solid var(--color-border-positive-default);
}

.mt-promo-badge--beta {
  background-color: var(--color-background-brand-default);
  color: var(--color-text-brand-default);
  border: 1px solid var(--color-border-brand-default);
}

.mt-promo-badge--shopware-ai {
  background-color: var(--color-background-secondary-default);
  color: var(--color-text-brand-default);
  border: 1px solid var(--color-border-primary-default);
}
</style>
