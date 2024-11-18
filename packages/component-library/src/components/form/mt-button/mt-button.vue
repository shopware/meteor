<template>
  <a
    v-if="link"
    :href="!disabled ? link : ''"
    target="_blank"
    rel="noopener"
    class="mt-button"
    :class="buttonClasses"
    v-bind="$attrs"
  >
    <span class="mt-button__content">
      <slot />
    </span>
  </a>

  <button
    v-else
    class="mt-button"
    :class="buttonClasses"
    :disabled="disabled || isLoading"
    v-bind="$attrs"
  >
    <mt-loader v-if="isLoading" size="16px" class="mt-button__loader" />
    <span class="mt-button__content" :class="contentVisibilityClass">
      <slot name="iconFront" :size="iconSize" v-if="$slots.iconFront" />
      <slot></slot>
      <slot name="iconBack" :size="iconSize" v-if="$slots.iconBack" />
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtLoader from "../../feedback-indicator/mt-loader/mt-loader.vue";
import type { PropType } from "vue";

export default defineComponent({
  name: "MtButton",

  components: {
    "mt-loader": MtLoader,
  },

  props: {
    /**
     * Disables the button
     */
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * Change the look of the button
     * Values: primary, secondary, critical, action
     * @values primary, secondary, critical, action
     */
    variant: {
      type: String as PropType<"primary" | "secondary" | "critical" | "action">,
      required: false,
      default: "",
      validator(value: string) {
        if (!value.length) {
          return true;
        }
        return ["primary", "secondary", "critical", "action"].includes(value);
      },
    },
    ghost: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * Change the size of the button
     * @values x-small, small, default, large
     */
    size: {
      type: String,
      required: false,
      default: "small",
      validator(value: string) {
        if (!value.length) {
          return true;
        }
        return ["x-small", "small", "default", "large"].includes(value);
      },
    },
    /**
     * The button will be rendered as a square. You need to consider the text length
     * if you activate this property.
     */
    square: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * Renders the button as a block element instead of an inline-block element. The button
     * fills up all horizontal space.
     */
    block: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * If a link is provided then the user gets redirected to a new tab on a click.
     */
    link: {
      type: String,
      required: false,
      default: null,
    },
    /**
     * Shows a loading indicator instead of the text.
     */
    isLoading: {
      type: Boolean,
      default: false,
      required: false,
    },
  },

  computed: {
    buttonClasses() {
      return {
        [`mt-button--${this.variant}${this.allowGhostVariant ? "-ghost" : ""}`]: !!this.variant,
        [`mt-button--${this.size}`]: !!this.size,
        "mt-button--block": this.block,
        "mt-button--disabled": this.disabled,
        "mt-button--square": this.square,
      };
    },

    allowGhostVariant() {
      return this.ghost && this.variant !== "secondary";
    },

    contentVisibilityClass() {
      return {
        "mt-button__content--hidden": this.isLoading,
      };
    },

    iconSize() {
      return this.size === "x-small" ? 8 : this.size === "large" ? 12 : 10;
    },
  },
});
</script>

<style lang="css" scoped>
.mt-button {
  transition: all 0.15s ease-out;
  display: inline-block;
  border-radius: var(--border-radius-button);
  padding: 2px 24px;
  font-size: var(--font-size-xs);
  border: 1px solid transparent;
  outline: none;
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family-body);
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  margin: 0;
  position: relative;
}

.mt-button__content {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  column-gap: 0.5rem;
}

.mt-button__content--hidden {
  visibility: hidden;
}

.mt-button--primary {
  background: var(--color-interaction-primary-default);
  color: var(--color-text-static-default);
  border-color: var(--color-interaction-primary-default);
}

.mt-button--primary .mt-icon {
  color: var(--color-icon-static-default);
}

.mt-button--primary:hover,
.mt-button--primary:focus-visible,
.mt-button--primary:active {
  background: var(--color-interaction-primary-hover);
  border-color: var(--color-interaction-primary-hover);
}

.mt-button--primary:focus-visible {
  border-color: var(--color-border-brand-selected);
  box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
}

.mt-button--primary:disabled,
.mt-button--primary.mt-button--disabled {
  background: var(--color-interaction-primary-disabled);
  border-color: var(--color-interaction-primary-disabled);
  cursor: not-allowed;
}

.mt-button--primary-ghost {
  background: transparent;
  border: 1px solid var(--color-border-brand-selected);
  border-color: var(--color-border-brand-selected);
  color: var(--color-text-brand-default);
}

.mt-button--primary-ghost:is(:hover, :focus-visible, :active) {
  background: var(--color-background-brand-default);
}

.mt-button--primary-ghost:focus-visible {
  box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
}

.mt-button--primary-ghost:disabled,
.mt-button--primary-ghost.mt-button--disabled {
  color: var(--color-text-brand-disabled);
  border-color: var(--color-border-brand-disabled);
  background: transparent;
}

.mt-button--primary-ghost:disabled .mt-icon,
.mt-button--primary-ghost.mt-button--disabled .mt-icon {
  color: var(--color-icon-brand-disabled);
}

.mt-button--primary-ghost .mt-icon {
  color: var(--color-icon-brand-default);
}

.mt-button--secondary {
  background: var(--color-interaction-secondary-default);
  border: 1px solid var(--color-border-primary-default);
  color: var(--color-text-primary-default);
}

.mt-button--secondary:is(:hover, :focus-visible, :active) {
  background: var(--color-interaction-secondary-hover);
}

.mt-button--secondary:focus-visible {
  border-color: var(--color-border-brand-selected);
  box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
}

.mt-button--secondary:disabled,
.mt-button--secondary.mt-button--disabled {
  color: var(--color-text-primary-disabled);
  background: var(--color-interaction-secondary-disabled);
  cursor: not-allowed;
}

.mt-button--secondary:disabled .mt-icon,
.mt-button--secondary.mt-button--disabled .mt-icon {
  color: var(--color-icon-primary-disabled);
}

.mt-button--secondary .mt-icon {
  color: var(--color-icon-primary-default);
}

.mt-button--critical {
  background: var(--color-interaction-critical-default);
  color: var(--color-text-static-default);
  border: 1px solid var(--color-interaction-critical-default);
}

.mt-button--critical:is(:hover, :focus-visible, :active) {
  background: var(--color-interaction-critical-hover);
  border-color: var(--color-interaction-critical-hover);
}

.mt-button--critical:focus-visible {
  border-color: var(--color-border-brand-selected);
  box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
}

.mt-button--critical:disabled,
.mt-button--critical.mt-button--disabled {
  background: var(--color-interaction-critical-disabled);
  border-color: var(--color-interaction-critical-disabled);
}

.mt-button--critical:disabled .mt-icon,
.mt-button--critical.mt-button--disabled .mt-icon,
.mt-button--critical .mt-icon {
  color: var(--color-icon-static-default);
}

.mt-button--critical-ghost {
  background: transparent;
  border: 1px solid var(--color-border-critical-default);
  color: var(--color-text-critical-default);
}

.mt-button--critical-ghost:is(:hover, :focus-visible, :active) {
  background-color: var(--color-background-critical-dark);
}

.mt-button--critical-ghost:focus-visible {
  border-color: var(--color-border-brand-selected);
  box-shadow: 0 0 4px 0 rgba(255, 0, 0, 0.3);
}

.mt-button--critical-ghost:disabled,
.mt-button--critical-ghost.mt-button--disabled {
  color: var(--color-text-critical-disabled);
  border-color: var(--color-border-critical-disabled);
}

.mt-button--critical-ghost:disabled .mt-icon,
.mt-button--critical-ghost.mt-button--disabled .mt-icon {
  color: var(--color-icon-critical-disabled);
}

.mt-button--critical-ghost .mt-icon {
  color: var(--color-icon-critical-default);
}

.mt-button--action {
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  color: #000000;
}

.mt-button--action .mt-icon {
  color: #1a202c;
}

.mt-button--action:hover {
  background-color: #edf2f7;
  color: #4a5568;
}

.mt-button--action:disabled {
  background-color: #f7fafc;
  color: #a0aec0;
}

.mt-button--block {
  display: block;
  width: 100%;
  display: flex;
  justify-content: center;
}

.mt-button--x-small {
  padding-left: 10px;
  padding-right: 10px;
  font-size: var(--font-size-2xs);
  min-height: 24px;
}

.mt-button--x-small.mt-button--square {
  width: 24px;
  height: 24px;
}

.mt-button--small {
  padding-left: 15px;
  padding-right: 15px;
  font-size: var(--font-size-2xs);
  min-height: 32px;
}

.mt-button--small.mt-button--square {
  width: 32px;
  height: 32px;
}

.mt-button--default {
  padding-inline: 1rem;
  font-size: var(--font-size-xs);
  min-height: 2.5rem;
}

.mt-button--default.mt-button-square {
  width: 2.5rem;
  height: 2.5rem;
}

.mt-button--large {
  padding-left: 1.75rem;
  padding-right: 1.75rem;
  min-height: 3rem;
  font-size: var(--font-size-2xs);
}

.mt-button--large.mt-button--square {
  width: 48px;
  height: 48px;
}

.mt-button--square {
  width: 40px;
  height: 40px;
  padding-left: 0;
  padding-right: 0;
  text-align: center;
}

.mt-button--square .mt-button__content {
  display: inline;
}

.mt-button__loader {
  border-radius: var(--border-radius-xs);
}
</style>
