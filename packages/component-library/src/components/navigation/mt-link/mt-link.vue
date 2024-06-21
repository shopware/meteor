<template>
  <component
    :is="as"
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
    /**
     * Set the element type of the link
     */
    as: {
      type: String,
      required: false,
      default: "router-link",
    },

    /**
     * Set the to prop of the router/nuxt-link
     */
    to: {
      type: String,
      required: false,
      default: undefined,
    },

    /**
     * Render the link in various styles
     */
    variant: {
      type: String as PropType<"primary" | "critical">,
      required: false,
      default: "primary",
      validator(value: string) {
        if (!value.length) {
          return true;
        }
        return ["primary", "critical"].includes(value);
      },
    },

    /**
     * Make the link unclickable
     */
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    linkClasses() {
      return {
        [`mt-link--${this.variant}`]: !!this.variant,
        "mt-link--disabled": this.disabled,
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

<style lang="scss" scoped>
.mt-link {
  display: inline-block;
  cursor: pointer;
  margin: 0;
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "San Francisco",
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-decoration: underline;

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
