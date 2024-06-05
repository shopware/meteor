<template>
  <component
    :is="elementType"
    class="mt-link"
    :class="linkClasses"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    v-bind="to ? { ...$attrs, to } : $attrs"
    @click="onClick"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";

export default defineComponent({
  name: "MtLink",

  props: {
    to: {
      type: String,
      required: false,
      default: undefined,
    },
    size: {
      type: String,
      required: false,
      default: "default",
      validator(value: string) {
        if (!value.length) {
          return true;
        }
        return ["small", "default", "large"].includes(value);
      },
    },
    variant: {
      type: String as PropType<"primary" | "secondary" | "critical">,
      required: false,
      default: "primary",
      validator(value: string) {
        if (!value.length) {
          return true;
        }
        return ["primary", "secondary", "critical"].includes(value);
      },
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    underline: {
      type: Boolean,
      required: false,
      default: false,
    },
    elementType: {
      type: String,
      required: false,
      default: "router-link",
    },
  },
  computed: {
    linkClasses() {
      return {
        [`mt-link--${this.variant}`]: !!this.variant,
        [`mt-link--${this.size}`]: !!this.size,
        "mt-link--disabled": this.disabled,
        "mt-link--underline": this.underline,
      };
    },
  },

  methods: {
    onClick(event: MouseEvent) {
      if (this.disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }

      this.$emit("click", event);
    },
  },
});
</script>

<style lang="scss">
.mt-link {
  display: inline-block;
  text-decoration: none;
  font-family: $font-family-default;
  margin: 0;
  cursor: pointer;

  &.mt-link--underline {
    text-decoration: underline;
  }

  &.mt-link--small {
    font-size: $font-size-xxs;
    font-weight: $font-weight-regular;
  }

  &.mt-link--default {
    font-size: $font-size-xs;
    font-weight: $font-weight-medium;
  }

  &.mt-link--large {
    font-size: $font-size-s;
    font-weight: $font-weight-medium;
  }

  &:focus-visible {
    border-color: var(--color-border-brand-selected);
    outline: none;
  }

  &:disabled,
  &.mt-link--disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  &.mt-link--primary {
    color: var(--color-text-brand-default);

    &:hover,
    &:active {
      color: var(--color-text-brand-hover);
    }

    &:disabled,
    &.mt-link--disabled {
      color: var(--color-text-brand-disabled);
    }
  }

  &.mt-link--secondary {
    color: var(--color-text-secondary-default);

    &:hover,
    &:active {
      color: var(--color-text-secondary-hover);
    }

    &:disabled,
    &.mt-link--disabled {
      color: var(--color-text-secondary-disabled);
    }
  }

  &.mt-link--critical {
    color: var(--color-text-critical-default);

    &:hover,
    &:active {
      color: var(--color-text-critical-hover);
    }

    &:disabled,
    &.mt-link--disabled {
      color: var(--color-text-critical-disabled);
    }
  }
}
</style>
