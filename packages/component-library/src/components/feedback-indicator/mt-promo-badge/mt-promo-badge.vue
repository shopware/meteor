<template>
  <span class="mt-promo-badge" :style="{ '--mt-promo-badge-icon-color': iconColor }">
    <mt-badge :variant="badgeVariant" :size="size" :icon="badgeIcon">
      {{ promoText }}
    </mt-badge>
  </span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtBadge from "../mt-badge/mt-badge.vue";

const props = withDefaults(
  defineProps<{
    variant?: "new" | "beta" | "shopware-ai";
    size?: "s" | "m" | "l";
  }>(),
  {
    variant: "new",
    size: "s",
  },
);

const size = computed(() => {
  const normalizedSize = String(props.size ?? "s").toLowerCase();
  return ["s", "m", "l"].includes(normalizedSize) ? normalizedSize : "s";
});

const badgeVariant = computed(() =>
  props.variant === "shopware-ai" ? "neutral" : props.variant === "beta" ? "info" : "positive",
);

const promoText = computed(() =>
  props.variant === "shopware-ai" ? "Shopware AI" : props.variant === "new" ? "New" : "Beta",
);

const badgeIcon = computed(() =>
  props.variant === "beta"
    ? "solid-code"
    : props.variant === "shopware-ai"
      ? "solid-sparkles"
      : "solid-party-horn",
);

const iconColor = computed(() =>
  props.variant === "shopware-ai"
    ? "var(--color-icon-brand-default)"
    : "var(--color-icon-primary-default)",
);
</script>

<style scoped>
.mt-promo-badge :deep(.mt-icon) {
  color: var(--mt-promo-badge-icon-color);
}
</style>
