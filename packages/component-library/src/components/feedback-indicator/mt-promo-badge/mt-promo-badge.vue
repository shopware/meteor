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

const badgeVariant = computed(() => {
  if (props.variant === "new") return "positive";
  if (props.variant === "beta") return "info";
  if (props.variant === "shopware-ai") return "neutral";
  return "neutral";
});

const promoText = computed(() => {
  if (props.variant === "new") return "New";
  if (props.variant === "beta") return "Beta";
  if (props.variant === "shopware-ai") return "Shopware AI";
  return "New";
});

const badgeIcon = computed(() => {
  if (props.variant === "beta") return "solid-code";
  if (props.variant === "shopware-ai") return "solid-sparkles";
  return "solid-party-horn";
});

const iconColor = computed(() => {
  if (props.variant === "beta") return "var(--color-icon-primary-default)";
  if (props.variant === "shopware-ai") return "var(--color-icon-brand-default)";
  return "var(--color-icon-primary-default)";
});
</script>

<style scoped>
.mt-promo-badge :deep(.mt-icon) {
  color: var(--mt-promo-badge-icon-color);
}
</style>
