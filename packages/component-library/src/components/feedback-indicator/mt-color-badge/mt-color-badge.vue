<template>
  <span class="mt-color-badge" :class="variantClass" v-bind="$attrs" :style="colorStyle">
    <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export type MtColorBadgeVariant = "default" | "warning" | "critical" | "positive" | "info";

export default defineComponent({
  name: "MtColorBadge",
  props: {
    variant: {
      type: String,
      required: false,
      default: "default",
      validator(value: MtColorBadgeVariant) {
        return ["default", "warning", "critical", "positive", "info"].includes(value);
      },
    },
    color: {
      type: String,
      required: false,
      default: "",
    },
    rounded: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasText: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  computed: {
    colorStyle(): string {
      if (!this.color.length) {
        return "";
      }
      return `background:${this.color}`;
    },
    variantClass(): Record<string, boolean> {
      return {
        [`is--${this.variant}`]: true,
        "is--rounded": this.rounded,
        "has--text": this.hasText,
      };
    },
  },
});
</script>

<style lang="scss">
$mt-color-badge-color-fallback: $color-gray-300;
$mt-color-badge-color-warning: $color-pumpkin-spice-500;
$mt-color-badge-color-critical: $color-crimson-500;
$mt-color-badge-color-positive: $color-emerald-500;
$mt-color-badge-color-info: $color-shopware-brand-500;

.mt-color-badge {
  display: inline-block;
  height: var(--scale-size-8);
  width: var(--scale-size-8);
  margin: 0 0 1px var(--scale-size-10);
  border-radius: 2px;
  background-color: $mt-color-badge-color-fallback;

  &.is--rounded {
    border-radius: 100%;
  }

  &.is--warning {
    background-color: $mt-color-badge-color-warning;
  }

  &.is--critical,
  &.is--danger {
    background-color: $mt-color-badge-color-critical;
  }

  &.is--positive {
    background-color: $mt-color-badge-color-positive;
  }

  &.is--info {
    background-color: $mt-color-badge-color-info;
  }

  &.has--text {
    height: auto;
    width: auto;
    padding: var(--scale-size-4) var(--scale-size-8);
    border-radius: 8px;

    &.is--warning {
      background-color: $color-pumpkin-spice-50;
      color: $color-pumpkin-spice-900;
    }

    &.is--critical,
    &.is--danger {
      background-color: $color-crimson-50;
      color: $color-crimson-900;
    }

    &.is--positive {
      background-color: $color-emerald-50;
      color: $color-emerald-900;
    }

    &.is--info {
      background-color: $color-shopware-brand-50;
      color: $color-shopware-brand-900;
    }
  }
}
</style>
