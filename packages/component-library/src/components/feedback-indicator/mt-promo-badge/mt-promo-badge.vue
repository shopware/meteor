<template>
  <span class="mt-promo-badge">
    <mt-badge :variant="badgeVariant" :size="badgeSize">
      {{ promoText }}
      <template #icon>
        <mt-icon :name="badgeIcon" size="var(--scale-size-10)" :color="iconColor" />
      </template>
    </mt-badge>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import MtBadge from "../mt-badge/mt-badge.vue";

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

const badgeSize = computed(() => {
  if (props.size === "small") return "s";
  if (props.size === "medium") return "m";
  if (props.size === "large") return "l";
  return "s";
});

const badgeVariant = computed(() => {
  if (props.variant === "new") return "positive";
  if (props.variant === "beta") return "info";
  if (props.variant === "shopware-ai") return "neutral";
  return "neutral";
});

const promoText = computed(() => {
  const textConfig = {
    new: "New",
    beta: "Beta",
    "shopware-ai": "Shopware AI",
  };
  return textConfig[props.variant];
});

const badgeIcon = computed(() => {
  const iconConfig = {
    new: "solid-party-horn",
    beta: "solid-code",
    "shopware-ai": "solid-sparkles",
  };
  return iconConfig[props.variant];
});

const iconColor = computed(() => {
  const colorConfig = {
    new: "var(--color-icon-primary-default)",
    beta: "var(--color-icon-primary-default)",
    "shopware-ai": "var(--color-icon-brand-default)",
  };
  return colorConfig[props.variant];
});
</script>

<style scoped>
/* .mt-promo-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--scale-size-4);
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius-round);
  white-space: nowrap;
  user-select: none;
  transition: all 0.2s ease-in-out;
}

.mt-promo-badge--small {
  padding: 0 var(--scale-size-8);
  font-size: var(--font-size-xxs);
  line-height: var(--font-line-height-xs);
}

.mt-promo-badge--medium {
  padding: 0 var(--scale-size-8);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
}

.mt-promo-badge--large {
  padding: 0 var(--scale-size-8);
  font-size: var(--font-size-s);
  line-height: var(--font-line-height-sm);
}

.mt-promo-badge__icon {
  flex-shrink: 0;
}

.mt-promo-badge--new {
  background-color: var(--color-background-positive-default);
  color: var(--color-text-primary-default);
  border: 1px solid var(--color-border-positive-default);
}

.mt-promo-badge--beta {
  background-color: var(--color-background-brand-default);
  color: var(--color-text-primary-default);
  border: 1px solid var(--color-border-brand-default);
}

.mt-promo-badge--shopware-ai {
  background-color: var(--color-background-secondary-default);
  color: var(--color-text-primary-default);
  border: 1px solid var(--color-border-primary-default);
} */
</style>
