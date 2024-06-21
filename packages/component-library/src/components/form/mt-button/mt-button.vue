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
      <slot />
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
     * @values small, default, large
     */
    size: {
      type: String,
      required: false,
      default: "small",
      validator(value: string) {
        if (!value.length) {
          return true;
        }
        return ["small", "default", "large"].includes(value);
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
  },
});
</script>

<style lang="scss">
$mt-button-transition: all 0.15s ease-out;

.mt-button {
  border: 1px solid #c2ccd6;
  background: #f9fafb;
  color: #52667a;
  transition: $mt-button-transition;
  display: inline-block;
  border-radius: 4px;
  padding: 2px 24px;
  font-size: 14px;
  line-height: 34px;
  outline: none;
  font-weight: 600;
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "San Francisco",
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    sans-serif;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  margin: 0;
  position: relative;

  .mt-button__content {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    grid-gap: 0 8px;
  }

  .mt-button__content--hidden {
    visibility: hidden;
  }

  &:hover:not(.mt-button--disabled),
  &:hover:not([disabled]) {
    background: #f0f2f5;
  }

  &:disabled,
  &.mt-button--disabled {
    color: #f9fafb0;
    border-color: #e0e6eb;
    cursor: not-allowed;

    .mt-icon {
      color: #c2ccd6;
    }
  }

  .mt-icon {
    color: #8599ad;
  }

  .mt-button--small {
    line-height: 20px;
  }

  .mt-button--default {
    line-height: 28px;
  }

  .mt-button--large {
    line-height: 44px;
  }

  &.mt-button--primary {
    background: var(--color-interaction-primary-default);
    color: var(--color-text-static-default);
    line-height: 36px;
    border-color: var(--color-interaction-primary-default);

    .mt-icon {
      color: var(--color-icon-static-default);
    }

    &:is(:hover, :focus-visible, :active) {
      background: var(--color-interaction-primary-hover);
      border-color: var(--color-interaction-primary-hover);
    }

    &:focus-visible {
      border-color: var(--color-border-brand-selected);
      box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
    }

    &:disabled,
    &.mt-button--disabled {
      background: var(--color-interaction-primary-disabled);
      border-color: var(--color-interaction-primary-disabled);
    }
  }

  &.mt-button--primary-ghost {
    background: transparent;
    border-color: var(--color-border-brand-selected);
    color: var(--color-text-brand-default);

    &:is(:hover, :focus-visible, :active) {
      background: var(--color-background-brand-default);
    }

    &:focus-visible {
      box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
    }

    &:disabled,
    &.mt-button--disabled {
      color: var(--color-text-brand-disabled);
      border-color: var(--color-border-brand-disabled);
      background: transparent;

      .mt-icon {
        color: var(--color-icon-brand-disabled);
      }
    }

    .mt-icon {
      color: var(--color-icon-brand-default);
    }
  }

  &.mt-button--secondary {
    background: var(--color-interaction-secondary-default);
    color: var(--color-text-primary-default);
    line-height: 36px;
    border-color: var(--color-border-primary-default);

    &:is(:hover, :focus-visible, :active) {
      background: var(--color-interaction-secondary-hover);
    }

    &:focus-visible {
      border-color: var(--color-border-brand-selected);
      box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
    }

    &:disabled,
    &.mt-button--disabled {
      color: var(--color-text-primary-disabled);
      background: var(--color-interaction-secondary-disabled);

      .mt-icon {
        color: var(--color-icon-primary-disabled);
      }
    }

    .mt-icon {
      color: var(--color-icon-primary-default);
    }
  }

  &.mt-button--critical {
    background: var(--color-interaction-critical-default);
    color: var(--color-text-static-default);
    line-height: 36px;
    border-color: var(--color-interaction-critical-default);

    &:is(:hover, :focus-visible, :active) {
      background: var(--color-interaction-critical-hover);
      border-color: var(--color-interaction-critical-hover);
    }

    &:focus-visible {
      border-color: var(--color-border-brand-selected);
      box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
    }

    &:disabled,
    &.mt-button--disabled {
      background: var(--color-interaction-critical-disabled);
      border-color: var(--color-interaction-critical-disabled);

      .mt-icon {
        color: var(--color-icon-static-default);
      }
    }

    .mt-icon {
      color: var(--color-icon-static-default);
    }
  }

  &.mt-button--critical-ghost {
    background: transparent;
    border-color: var(--color-border-critical-default);
    color: var(--color-text-critical-default);

    &:is(:hover, :focus-visible, :active) {
      background-color: var(--color-background-critical-dark);
    }

    &:focus-visible {
      border-color: var(--color-border-brand-selected);
      box-shadow: 0 0 4px 0 rgba(255, 0, 0, 0.3);
    }

    &:disabled,
    &.mt-button--disabled {
      color: var(--color-text-critical-disabled);
      border-color: var(--color-border-critical-disabled);

      .mt-icon {
        color: var(--color-icon-critical-disabled);
      }
    }

    .mt-icon {
      color: var(--color-icon-critical-default);
    }
  }

  &.mt-button--action {
    border: 1px solid #d1d9e0;
    background-color: #fff;
    color: #000;

    .mt-icon {
      color: #14191f;
    }

    &:hover {
      background-color: #f0f2f5;
      color: #52667a;
    }

    &:disabled {
      background-color: #f9fafb;
      color: #f9fafb0;
    }
  }

  &.mt-button--block {
    display: block;
    width: 100%;
  }

  &.mt-button--x-small {
    padding-left: 10px;
    padding-right: 10px;
    font-size: 12px;
    line-height: 18px;

    &.mt-button--square {
      width: 24px;
    }
  }

  &.mt-button--small {
    padding-left: 15px;
    padding-right: 15px;
    font-size: 12px;
    line-height: 26px;

    &.mt-button--square {
      width: 32px;
    }
  }

  &.mt-button--large {
    padding-left: 28px;
    padding-right: 28px;
    line-height: 42px;
    font-size: 15px;

    &.mt-button--square {
      width: 48px;
    }
  }

  &.mt-button--square {
    width: 40px;
    padding-left: 0;
    padding-right: 0;
    text-align: center;

    .mt-button__content {
      display: inline;
    }
  }

  .mt-button__loader {
    border-radius: 4px;
  }
}
</style>
