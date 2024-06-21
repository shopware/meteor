<template>
  <component
    :is="as"
    :class="linkClasses"
    :aria-disabled="disabled"
    :tabindex="disabled ? -1 : 0"
    v-bind="to ? { ...$attrs, to } : $attrs"
    @click="onClick"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import stylex from "@stylexjs/stylex";
</script>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";

const styles = stylex.create({
  root: {
    borderRadius: "0.25rem",
    outlineOffset: "0.25rem",
    display: "inline-block",
    cursor: "pointer",
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    fontSize: "0.875rem",
    fontWeight: 500,
    textDecoration: "underline",
    ":disabled": {
      cursor: "not-allowed",
      pointerEvents: "none",
    },
    ":focus-visible": {
      outline: "2px solid var(--color-border-brand-selected)",
    },
  },
  variantPrimary: {
    color: "var(--color-text-brand-default)",
    ":hover": {
      color: "var(--color-text-brand-hover)",
    },
    ":active": {
      color: "var(--color-text-brand-hover)",
    },
    ":disabled": {
      color: "var(--color-text-brand-disabled)",
    },
  },
  variantCritical: {
    color: "var(--color-text-critical-default)",
    ":hover": {
      color: "var(--color-text-critical-hover)",
    },
    ":active": {
      color: "var(--color-text-critical-hover)",
    },
    ":disabled": {
      color: "var(--color-text-critical-disabled)",
    },
  },
});

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
      function firstLetterToUpperCase(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      // @ts-expect-error
      return stylex(styles.root, styles[`variant${firstLetterToUpperCase(this.variant)}`]);
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
