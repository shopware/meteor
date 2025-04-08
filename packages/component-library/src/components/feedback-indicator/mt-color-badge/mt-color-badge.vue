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

<style>
.mt-color-badge {
  display: inline-block;
  height: var(--scale-size-8);
  width: var(--scale-size-8);
  margin: 0 0 1px var(--scale-size-10);
  border-radius: 2px;
  background-color: #d1d9e0;

  &.is--rounded {
    border-radius: 100%;
  }

  &.is--warning {
    background-color: #ff9800;
  }

  &.is--critical,
  &.is--danger {
    background-color: #de294c;
  }

  &.is--positive {
    background-color: #37d046;
  }

  &.is--info {
    background-color: #189eff;
  }

  &.has--text {
    height: auto;
    width: auto;
    padding: var(--scale-size-4) var(--scale-size-8);
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
