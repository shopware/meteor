<template>
  <span class="mt-promo-badge">
    <mt-badge :variant="badgeVariant" :size="size">
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
