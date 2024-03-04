<template>
  <a
    v-if="link"
    :href="!disabled ? link : ''"
    target="_blank"
    rel="noopener"
    class="sw-button"
    :class="buttonClasses"
    v-bind="$attrs"
  >
    <span class="sw-button__content">
      <slot />
    </span>
  </a>

  <button
    v-else
    class="sw-button"
    :class="buttonClasses"
    :disabled="disabled || isLoading"
    v-bind="$attrs"
  >
    <sw-loader v-if="isLoading" size="16px" class="sw-button__loader" />
    <span class="sw-button__content" :class="contentVisibilityClass">
      <slot />
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import swLoader from "../../feedback-indicator/sw-loader/sw-loader.vue";
import type { PropType } from "vue";

export default defineComponent({
  name: "SwButton",

  components: {
    "sw-loader": swLoader,
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
    buttonClasses(): Record<string, unknown> {
      return {
        [`sw-button--${this.variant}`]: !!this.variant,
        [`sw-button--${this.variant}-ghost`]: !!this.ghost,
        [`sw-button--${this.size}`]: !!this.size,
        "sw-button--block": this.block,
        "sw-button--disabled": this.disabled,
        "sw-button--square": this.square,
      };
    },

    contentVisibilityClass(): { "is--hidden": boolean } {
      return {
        "is--hidden": this.isLoading,
      };
    },
  },
});
</script>

<style lang="scss">
@import "../../assets/scss/variables.scss";

$sw-button-transition: all 0.15s ease-out;

.sw-button {
  border: 1px solid $color-gray-400;
  background: $color-gray-50;
  color: $color-darkgray-200;
  transition: $sw-button-transition;
  display: inline-block;
  border-radius: $border-radius-default;
  padding: 2px 24px;
  font-size: 14px;
  line-height: 34px;
  outline: none;
  font-weight: 600;
  font-family: $font-family-default;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  margin: 0;
  position: relative;

  .sw-button__content {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    grid-gap: 0 8px;
  }

  .sw-button__content.is--hidden {
    visibility: hidden;
  }

  &:hover:not(.sw-button--disabled),
  &:hover:not([disabled]) {
    background: $color-gray-100;
  }

  &:active:not(.sw-button--disabled) {
    background: $color-gray-200;
    border-color: $color-gray-400;
  }

  &:disabled,
  &.sw-button--disabled {
    color: $color-gray-500;
    border-color: $color-gray-200;
    cursor: not-allowed;

    .sw-icon {
      color: $color-gray-400;
    }
  }

  .sw-icon {
    color: $color-gray-800;
  }

  .sw-button--small {
    line-height: 20px;
  }

  .sw-button--default {
    line-height: 28px;
  }

  .sw-button--large {
    line-height: 44px;
  }

  &.sw-button--primary {
    background: $color-shopware-brand-500;
    color: $color-white;
    line-height: 36px;
    border: 0 none;

    .sw-icon {
      color: $color-white;
    }

    &-ghost {
      background: none;
      border: 1px solid $color-shopware-brand-500;
      color: $color-shopware-brand-500;
    }

    &-ghost:hover {
      background: $color-shopware-brand-50;
    }

    &-ghost:active {
      background: $color-shopware-brand-100;
    }

    &:not(&-ghost):hover {
      background: $color-shopware-brand-700;
    }

    &:not(&-ghost):active {
      background: $color-shopware-brand-800;
    }

    &:disabled,
    &.sw-button--disabled {
      background: $color-shopware-brand-200;
    }

    &.sw-button--square .sw-icon {
      color: $color-white;
    }
  }

  &.sw-button--secondary {
    background: $color-gray-50;
    color: $color-darkgray-200;
    line-height: 36px;
    border: 1px solid $color-gray-400;

    &-ghost {
      background: none;
    }

    .sw-icon {
      color: $color-white;
    }

    &:hover {
      background: $color-gray-200;
    }

    &:active {
      background: $color-gray-100;
    }

    &:disabled,
    &.sw-button--disabled {
      background: #f4f7fa;
      border: 1px solid $color-gray-200;
      color: $color-gray-500;
    }

    &.sw-button--square .sw-icon {
      color: $color-white;
    }
  }

  &.sw-button--critical {
    background: $color-crimson-500;
    color: $color-white;
    line-height: 36px;
    border: 0 none;

    .sw-icon {
      color: $color-white;
    }

    &-ghost {
      background: none;
      border: 1px solid $color-crimson-500;
      color: $color-crimson-500;
    }

    &-ghost:hover {
      background: none;
      border: 1px solid $color-crimson-700;
      color: $color-crimson-700;
    }

    &-ghost:active {
      background: $color-crimson-100;
    }

    &-ghost:disabled {
      border: 1px solid $color-crimson-200;
      color: $color-crimson-200;
    }

    &:not(&-ghost):hover {
      background: $color-crimson-700;
    }

    &:not(&-ghost):active {
      background: $color-crimson-800;
    }

    &:not(&-ghost):disabled {
      background: $color-crimson-200;

      .sw-icon {
        color: $color-white;
      }
    }
  }

  &.sw-button--action {
    border: 1px solid $color-gray-300;
    background-color: $color-white;
    color: $color-black;

    .sw-icon {
      color: $color-darkgray-800;
    }

    &:hover {
      background-color: $color-gray-100;
      color: $color-darkgray-200;
    }

    &:disabled {
      background-color: $color-gray-50;
      color: $color-gray-500;
    }
  }

  &.sw-button--block {
    display: block;
    width: 100%;
  }

  &.sw-button--x-small {
    padding-left: 10px;
    padding-right: 10px;
    font-size: 12px;
    line-height: 18px;

    &.sw-button--square {
      width: 24px;
    }
  }

  &.sw-button--small {
    padding-left: 15px;
    padding-right: 15px;
    font-size: 12px;
    line-height: 26px;

    &.sw-button--square {
      width: 32px;
    }
  }

  &.sw-button--large {
    padding-left: 28px;
    padding-right: 28px;
    line-height: 42px;
    font-size: 15px;

    &.sw-button--square {
      width: 48px;
    }
  }

  &.sw-button--square {
    width: 40px;
    padding-left: 0;
    padding-right: 0;
    text-align: center;

    .sw-button__content {
      display: inline;
    }
  }

  .sw-button__loader {
    border-radius: $border-radius-default;
  }
}
</style>
