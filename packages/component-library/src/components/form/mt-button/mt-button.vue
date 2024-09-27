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
    <span
      :class="[
        'mt-button__content',
        {
          'mt-button__content--hidden': !!isLoading,
        },
      ]"
    >
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MtLoader from "../../feedback-indicator/mt-loader/mt-loader.vue";

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    variant?: "primary" | "secondary" | "critical";
    ghost?: boolean;
    size?: "x-small" | "small" | "default" | "large";
    square?: boolean;
    block?: boolean;
    link?: string;
    isLoading?: boolean;
  }>(),
  {
    variant: "primary",
    size: "default",
  },
);

const allowGhostVariant = computed(() => props.ghost && props.variant !== "secondary");

const buttonClasses = computed(() => [
  `mt-button--${props.variant}${allowGhostVariant.value ? "-ghost" : ""}`,
  `mt-button--${props.size}`,
  {
    "mt-button--block": props.block,
    "mt-button--disabled": props.disabled,
    "mt-button--square": props.square,
  },
]);
</script>

<style scoped>
.mt-button {
  transition: all 0.15s ease-out;
  display: inline-block;
  border-radius: var(--border-radius-button);
  padding: 2px 24px;
  font-size: var(--font-size-xs);
  line-height: 34px;
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
  grid-gap: 0 8px;
}

.mt-button__content--hidden {
  visibility: hidden;
}

.mt-button--primary {
  background: var(--color-interaction-primary-default);
  color: var(--color-text-static-default);
  line-height: 36px;
  border-color: var(--color-interaction-primary-default);

  & .mt-icon {
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

.mt-button--primary-ghost {
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

    & .mt-icon {
      color: var(--color-icon-brand-disabled);
    }
  }

  & .mt-icon {
    color: var(--color-icon-brand-default);
  }
}

.mt-button--secondary {
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

    & .mt-icon {
      color: var(--color-icon-primary-disabled);
    }
  }

  & .mt-icon {
    color: var(--color-icon-primary-default);
  }
}

.mt-button--critical {
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

    & .mt-icon {
      color: var(--color-icon-static-default);
    }
  }

  & .mt-icon {
    color: var(--color-icon-static-default);
  }
}

.mt-button--critical-ghost {
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

    & .mt-icon {
      color: var(--color-icon-critical-disabled);
    }
  }

  & .mt-icon {
    color: var(--color-icon-critical-default);
  }
}

.mt-button--block {
  display: block;
  width: 100%;
}

.mt-button--square {
  width: 40px;
  padding-left: 0;
  padding-right: 0;
  text-align: center;

  & .mt-button__content {
    display: inline;
  }
}

.mt-button--large {
  padding-left: 28px;
  padding-right: 28px;
  line-height: 42px;
  font-size: var(--font-size-2xs);

  &.mt-button--square {
    width: 48px;
  }
}

.mt-button--small {
  padding-left: 15px;
  padding-right: 15px;
  font-size: var(--font-size-2xs);
  line-height: 26px;

  &.mt-button--square {
    width: 32px;
  }
}

.mt-button--x-small {
  padding-left: 10px;
  padding-right: 10px;
  font-size: var(--font-size-2xs);
  line-height: 18px;

  &.mt-button--square {
    width: 24px;
  }
}

.mt-button__loader {
  border-radius: var(--border-radius-xs);
}
</style>
