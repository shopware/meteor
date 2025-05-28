<template>
  <a
    v-if="link"
    :href="disabled || isLoading ? '' : link"
    target="_blank"
    rel="noopener"
    class="mt-button"
    :tabindex="(disabled || isLoading) && !isInsideTooltip ? -1 : 0"
    :class="buttonClasses"
    v-bind="$attrs"
  >
    <span class="mt-button__content">
      <span v-if="$slots.iconFront">
        <slot name="iconFront" :size="iconSize" />
      </span>

      <slot />

      <span v-if="$slots.iconBack">
        <slot name="iconBack" :size="iconSize" />
      </span>
    </span>
  </a>

  <button
    v-else
    type="button"
    class="mt-button"
    :class="buttonClasses"
    :disabled="(disabled && !isInsideTooltip) || isLoading"
    :aria-disabled="disabled && isInsideTooltip"
    @click="disabled && isInsideTooltip ? $event.stopImmediatePropagation() : null"
    v-bind="$attrs"
  >
    <mt-loader v-if="isLoading" size="16px" class="mt-button__loader" />
    <span
      class="mt-button__content"
      :class="{
        'mt-button__content--hidden': isLoading,
      }"
    >
      <slot name="iconFront" :size="iconSize" v-if="$slots.iconFront" />
      <slot />
      <slot name="iconBack" :size="iconSize" v-if="$slots.iconBack" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { useIsInsideTooltip } from "@/components/overlay/mt-tooltip/composables/useIsInsideTooltip";
import MtLoader from "../../feedback-indicator/mt-loader/mt-loader.vue";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    variant?: "primary" | "secondary" | "critical" | "action";
    ghost?: boolean;
    size?: "x-small" | "small" | "default" | "large";
    square?: boolean;
    block?: boolean;
    link?: string;
    isLoading?: boolean;
  }>(),
  {
    variant: "secondary",
    // TODO: Update default value to "default"
    size: "small",
  },
);

defineSlots<{
  default: null;
  iconFront: { size: number };
  iconBack: { size: number };
}>();

const allowGhostVariant = computed(() => props.ghost && props.variant !== "secondary");

const buttonClasses = computed(() => {
  return {
    [`mt-button--${props.variant}${allowGhostVariant.value ? "-ghost" : ""}`]: !!props.variant,
    [`mt-button--${props.size}`]: !!props.size,
    "mt-button--block": props.block,
    "mt-button--disabled": props.disabled,
    "mt-button--square": props.square,
  };
});

const iconSize = computed(() => (props.size === "x-small" ? 8 : props.size === "large" ? 12 : 10));

const isInsideTooltip = useIsInsideTooltip();
</script>

<style lang="css" scoped>
.mt-button {
  transition: all 0.15s ease-out;
  display: inline-grid;
  place-items: center;
  width: max-content;
  border-radius: var(--border-radius-button);
  padding: var(--scale-size-2) var(--scale-size-24);
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
  position: relative;
}

.mt-button__content {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  column-gap: var(--scale-size-8);
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
  align-items: center;
}

.mt-button--x-small {
  padding-left: var(--scale-size-10);
  padding-right: var(--scale-size-10);
  font-size: var(--font-size-2xs);
  min-height: 24px;
}

.mt-button--x-small.mt-button--square {
  width: var(--scale-size-24);
  height: var(--scale-size-24);
}

.mt-button--small {
  padding-left: 15px;
  padding-right: 15px;
  font-size: var(--font-size-2xs);
  min-height: 32px;
}

.mt-button--small.mt-button--square {
  width: var(--scale-size-32);
  height: var(--scale-size-32);
}

.mt-button--default {
  padding-inline: var(--scale-size-16);
  font-size: var(--font-size-xs);
  min-height: 2.5rem;
}

.mt-button--default.mt-button-square {
  width: var(--scale-size-40);
  height: var(--scale-size-40);
}

.mt-button--large {
  padding-left: var(--scale-size-28);
  padding-right: var(--scale-size-28);
  min-height: 3rem;
  font-size: var(--font-size-2xs);
}

.mt-button--large.mt-button--square {
  width: var(--scale-size-48);
  height: var(--scale-size-48);
}

.mt-button--square {
  width: var(--scale-size-40);
  height: var(--scale-size-40);
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
