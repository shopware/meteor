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
$mt-color-badge-color-fallback: #d1d9e0;
$mt-color-badge-color-warning: #ff9800;
$mt-color-badge-color-critical: #de294c;
$mt-color-badge-color-positive: #37d046;
$mt-color-badge-color-info: #189eff;

.mt-color-badge {
  display: inline-block;
  height: 8px;
  width: 8px;
  margin: 0 0 1px 10px;
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
    padding: 4px 8px;
    border-radius: 8px;

    &.is--warning {
      background-color: #fff3e0;
      color: #e65100;
    }

    &.is--critical,
    &.is--danger {
      background-color: #fbe5ea;
      color: #c80f24;
    }

    &.is--positive {
      background-color: #e7f9e9;
      color: #16b320;
    }

    &.is--info {
      background-color: #e3f3ff;
      color: #0870ff;
    }
  }
}
</style>
