<template>
  <span class="sw-color-badge" :class="variantClass" v-bind="$attrs" :style="colorStyle">
    <slot />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export type SwColorBadgeVariant = "default" | "warning" | "critical" | "positive" | "info";

export default defineComponent({
  name: "SwColorBadge",
  props: {
    variant: {
      type: String,
      required: false,
      default: "default",
      validator(value: SwColorBadgeVariant) {
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
@import "../../assets/scss/variables.scss";

$sw-color-badge-color-fallback: $color-gray-300;
$sw-color-badge-color-warning: $color-pumpkin-spice-500;
$sw-color-badge-color-critical: $color-crimson-500;
$sw-color-badge-color-positive: $color-emerald-500;
$sw-color-badge-color-info: $color-shopware-brand-500;

.sw-color-badge {
  display: inline-block;
  height: 8px;
  width: 8px;
  margin: 0 0 1px 10px;
  border-radius: 2px;
  background-color: $sw-color-badge-color-fallback;

  &.is--rounded {
    border-radius: 100%;
  }

  &.is--warning {
    background-color: $sw-color-badge-color-warning;
  }

  &.is--critical,
  &.is--danger {
    background-color: $sw-color-badge-color-critical;
  }

  &.is--positive {
    background-color: $sw-color-badge-color-positive;
  }

  &.is--info {
    background-color: $sw-color-badge-color-info;
  }

  &.has--text {
    height: auto;
    width: auto;
    padding: 4px 8px;
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
