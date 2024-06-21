<template>
  <a
    v-if="link"
    :href="!disabled ? link : ''"
    target="_blank"
    rel="noopener"
    :class="buttonClasses"
    v-bind="$attrs"
  >
    <slot />
  </a>

  <button v-else :class="buttonClasses" :disabled="disabled || isLoading" v-bind="$attrs">
    <mt-loader v-if="isLoading" size="16px" :class="stylex(styles.loader)" />

    <slot v-else />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MtLoader from "../../feedback-indicator/mt-loader/mt-loader.vue";
import type { PropType } from "vue";
import stylex from "@stylexjs/stylex";
import { first } from "lodash-es";

type Stylex = (...classes: Record<string, unknown>[]) => string;

const styles = stylex.create({
  button: {
    outline: "0 none",
    borderWidth: "0.0625rem",
    borderStyle: "solid",
    transition: "all 0.15s ease-out",
    borderRadius: "0.25rem",
    fontWeight: 600,
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue" ,sans-serif',
    whiteSpace: "nowrap",
    position: "relative",
  },
  // TODO: IMHO we can get rid of the lineHeight and set them differently
  buttonSizeSmall: {
    fontSize: "0.75rem",
    paddingInline: "0.8125rem",
    paddingBlock: "0.375rem",
  },
  buttonSizeDefault: {
    fontSize: "0.875rem",
    paddingInline: "0.9375rem",
    paddingBlock: "0.5rem",
  },
  buttonVariantPrimary: {
    background: "var(--color-interaction-primary-default)",
    color: "var(--color-text-static-default)",
    borderColor: "var(--color-interaction-primary-default)",
    ":is(:hover, :focus-visible, :active)": {
      background: "var(--color-interaction-primary-hover)",
      borderColor: "var(--color-interaction-primary-hover)",
    },
    ":focus-visible": {
      borderColor: "var(--color-border-brand-selected)",
      boxShadow: "0 0 4px 0 rgba(24, 158, 255, 0.3)",
    },
    ":disabled": {
      background: "var(--color-interaction-primary-disabled)",
      borderColor: "var(--color-interaction-primary-disabled)",
    },
  },
  buttonVariantPrimaryGhost: {
    background: "transparent",
    borderColor: "var(--color-border-brand-selected)",
    color: "var(--color-text-brand-default)",
    ":is(:hover, :focus-visible, :active)": {
      background: "var(--color-background-brand-default)",
    },
    ":focus-visible": {
      boxShadow: "0 0 4px 0 rgba(24, 158, 255, 0.3)",
    },
    ":disabled": {
      color: "var(--color-text-brand-disabled)",
      borderColor: "var(--color-border-brand-disabled)",
    },
  },
  buttonVariantSecondary: {
    background: "var(--color-interaction-secondary-default)",
    color: "var(--color-text-primary-default)",
    borderColor: "var(--color-border-primary-default)",
    ":is(:hover, :focus-visible, :active)": {
      background: "var(--color-interaction-secondary-hover)",
    },
    // TODO: I think we can also share this
    ":focus-visible": {
      borderColor: "var(--color-border-brand-selected)",
      boxShadow: "0 0 4px 0 rgba(24, 158, 255, 0.3)",
    },
    ":disabled": {
      color: "var(--color-text-primary-disabled)",
      background: "var(--color-interaction-secondary-disabled)",
    },
  },
  buttonVariantCritical: {
    background: "var(--color-interaction-critical-default)",
    color: "var(--color-text-static-default)",
    borderColor: "var(--color-interaction-critical-default)",
    ":is(:hover, :focus-visible, :active)": {
      background: "var(--color-interaction-critical-hover)",
      borderColor: "var(--color-interaction-critical-hover)",
    },
    ":focus-visible": {
      borderColor: "var(--color-border-brand-selected)",
      boxShadow: "0 0 4px 0 rgba(24, 158, 255, 0.3)",
    },
    ":disabled": {
      background: "var(--color-interaction-critical-disabled)",
      borderColor: "var(--color-interaction-critical-disabled)",
    },
  },
  buttonVariantCriticalGhost: {
    background: "transparent",
    borderColor: "var(--color-border-critical-default)",
    color: "var(--color-text-critical-default)",
    ":is(:hover, :focus-visible, :active)": {
      background: "var(--color-background-critical-dark)",
    },
    ":focus-visible": {
      borderColor: "var(--color-border-brand-selected)",
      boxShadow: "0 0 4px 0 rgba(255, 0, 0, 0.3)",
    },
    ":disabled": {
      color: "var(--color-text-critical-disabled)",
      borderColor: "var(--color-border-critical-disabled)",
    },
  },
  // TODO: IMHO the parent should take care of this
  buttonBlock: {
    display: "block",
    width: "100%",
  },
  buttonSquareSmall: {
    width: "2rem",
    height: "2rem",
  },
  buttonSquareLarge: {
    width: "3rem",
    height: "3rem",
  },
  loader: {
    borderRadius: "0.25rem",
  },
});

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
        if (!value.length) return true;

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
        if (!value.length) return true;

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

  setup(props) {
    if (props.ghost && props.variant === "secondary")
      throw new Error(
        "Failed to render <mt-button />; Cannot use ghost and secondary variant together.",
      );

    return {
      styles,
      stylex: stylex as unknown as Stylex,
    };
  },

  computed: {
    buttonClasses() {
      function firstLetterToUpperCase(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }

      return stylex(
        styles.button,
        //@ts-expect-error
        styles[`buttonSize${firstLetterToUpperCase(this.size)}`],
        //@ts-expect-error
        styles[`buttonVariant${firstLetterToUpperCase(this.variant)}${this.ghost ? "Ghost" : ""}`],
        this.block && styles.buttonBlock,
        //@ts-expect-error
        this.square && [`buttonSquare${firstLetterToUpperCase(this.size)}`],
      );
    },
  },
});
</script>

<style lang="scss">
.mt-button {
  .mt-icon {
    // TODO: find solution
    color: #8599ad;
  }

  &.mt-button--primary {
    // TODO: find solution
    .mt-icon {
      color: var(--color-icon-static-default);
    }
  }

  &.mt-button--primary-ghost {
    &:disabled,
    &.mt-button--disabled {
      .mt-icon {
        color: var(--color-icon-brand-disabled);
      }
    }

    .mt-icon {
      color: var(--color-icon-brand-default);
    }
  }

  &.mt-button--secondary {
    &:disabled,
    &.mt-button--disabled {
      .mt-icon {
        color: var(--color-icon-primary-disabled);
      }
    }

    .mt-icon {
      color: var(--color-icon-primary-default);
    }
  }

  &.mt-button--critical {
    &:disabled,
    &.mt-button--disabled {
      .mt-icon {
        color: var(--color-icon-static-default);
      }
    }

    .mt-icon {
      color: var(--color-icon-static-default);
    }
  }

  &.mt-button--critical-ghost {
    &:disabled,
    &.mt-button--disabled {
      .mt-icon {
        color: var(--color-icon-critical-disabled);
      }
    }

    .mt-icon {
      color: var(--color-icon-critical-default);
    }
  }
}
</style>
