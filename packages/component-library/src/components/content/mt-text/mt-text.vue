<template>
  <component
    :is="as"
    :class="[`mt-text--size-${size}`, `mt-text--weight-${weight}`]"
    :style="{ color: `var(--${color})` }"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { Component } from "vue";

withDefaults(
  defineProps<{
    size?: "2xs" | "xs" | "s" | "m" | "l" | "xl" | "2xl" | "3xl";
    weight?: "bold" | "semibold" | "medium" | "regular";
    color?:
      | "color-text-primary-default"
      | "color-text-primary-disabled"
      | "color-text-secondary-default"
      | "color-text-tertiary-default"
      | "color-text-brand-default"
      | "color-text-brand-hover"
      | "color-text-brand-disabled"
      | "color-text-critical-default"
      | "color-text-critical-disabled"
      | "color-text-critical-dark"
      | "color-text-attention-default"
      | "color-text-positive-default"
      | "color-text-accent-default"
      | "color-text-static-default"
      | "color-text-inverse-default"
      | string;
    as?: string | Component;
  }>(),
  {
    size: "s",
    weight: "regular",
    color: "color-text-primary-default",
    as: "p",
  },
);
</script>

<style scoped>
.mt-text--weight-bold {
  font-weight: var(--font-weight-bold);
}

.mt-text--weight-semibold {
  font-weight: var(--font-weight-semibold);
}

.mt-text--weight-medium {
  font-weight: var(--font-weight-medium);
}

.mt-text--weight-regular {
  font-weight: var(--font-weight-regular);
}

.mt-text--size-2xs {
  font-family: var(--font-family-body);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
}

.mt-text--size-xs {
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
}

.mt-text--size-s {
  font-family: var(--font-family-body);
  font-size: var(--font-size-s);
  line-height: var(--font-line-height-s);
}

.mt-text--size-m {
  font-family: var(--font-family-body);
  font-size: var(--font-size-m);
  line-height: var(--font-line-height-m);
}

.mt-text--size-l {
  font-family: var(--font-family-body);
  font-size: var(--font-size-l);
  line-height: var(--font-line-height-l);
}

.mt-text--size-xl {
  font-family: var(--font-family-headings);
  font-size: var(--font-size-xl);
  line-height: var(--font-line-height-xl);
}

.mt-text--size-2xl {
  font-family: var(--font-family-headings);
  font-size: var(--font-size-2xl);
  line-height: var(--font-line-height-2xl);
}

.mt-text--size-3xl {
  font-family: var(--font-family-headings);
  font-size: var(--font-size-3xl);
  line-height: var(--font-line-height-3xl);
}
</style>
