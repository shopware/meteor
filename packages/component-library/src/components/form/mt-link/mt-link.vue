<template>
  <component
    :is="elementType"
    v-if="to"
    :to="to"
    class="mt-link"
    :class="linkClasses"
    v-bind="$attrs"
  >
    <slot />
  </component>
  <mt-button v-else :variant="variant" :size="size" :disabled="disabled" v-bind="$attrs">
    <slot />
  </mt-button>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import MtButton from "../mt-button/mt-button.vue";
import type { PropType } from "vue";

export default defineComponent({
  name: "MtLink",

  components: {
    "mt-button": MtButton,
  },

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
      type: String as PropType<"primary" | "secondary" | "critical" | "action">,
      required: false,
      default: "primary",
      validator(value: string) {
        if (!value.length) {
          return true;
        }
        return ["primary", "secondary", "critical", "action"].includes(value);
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
  },
  computed: {
    elementType(): string {
      return this.disabled ? "span" : this.to ? "router-link" : "span";
    },
    linkClasses() {
      return {
        [`mt-link--${this.variant}`]: !!this.variant,
        [`mt-link--${this.size}`]: !!this.size,
        "mt-link--disabled": this.disabled,
        "mt-link--underline": this.underline,
      };
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

  &.mt-link--action {
    color: var(--color-text-action-default);

    &:hover,
    &:active {
      color: var(--color-text-action-hover);
    }

    &:disabled,
    &.mt-link--disabled {
      color: var(--color-text-action-disabled);
    }
  }
}
</style>
