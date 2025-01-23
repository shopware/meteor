<template>
  <mt-popover class="mt-context-button" :title="title" :child-views="childViews">
    <template #trigger="{ toggleFloatingUi }">
      <slot name="button">
        <button
          role="button"
          aria-haspopup="menu"
          aria-label="Context menu"
          class="mt-context-button__button"
          @click="toggleFloatingUi"
        >
          <mt-icon :name="icon" small decorative />

          <slot name="button-text" />
        </button>
      </slot>
    </template>

    <template #popover-items__base="{ toggleFloatingUi, changeView }">
      <slot name="default" :change-view="changeView" :toggle-floating-ui="toggleFloatingUi" />
    </template>
  </mt-popover>
</template>

<script setup lang="ts">
import MtIcon from "../../icons-media/mt-icon/mt-icon.vue";
import type { View } from "../../overlay/mt-popover/mt-popover.interfaces";
import MtPopover from "../../overlay/mt-popover/mt-popover.vue";

withDefaults(
  defineProps<{
    menuWidth?: number;
    menuHorizontalAlign?: "right" | "left";
    menuVerticalAlign?: "bottom" | "top";
    icon?: string;
    disabled?: boolean;
    hasError?: boolean;
    autoClose?: boolean;
    title?: string;
    childViews?: View[];
  }>(),
  {
    menuWidth: 220,
    menuHorizontalAlign: "right",
    menuVerticalAlign: "bottom",
    icon: "solid-ellipsis-h-s",
    title: "",
    default: [],
  },
);
</script>

<style scoped>
.mt-context-button__button {
  color: var(--color-icon-primary-default);
  display: flex;
  align-items: baseline;
  border-radius: var(--border-radius-xs);
  height: var(--scale-size-24);
  gap: var(--scale-size-8);
  padding-inline: var(--scale-size-10);
  line-height: var(--font-line-height-xs);
  font-size: var(--font-size-xs);
  font-family: var(--font-family-body);
  transition: background-color 0.15s ease-out;

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-selected);
    outline-offset: 2px;
  }

  &:hover,
  &:focus-visible {
    background-color: var(--color-interaction-secondary-hover);
  }
}
</style>
