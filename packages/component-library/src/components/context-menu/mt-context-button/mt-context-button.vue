<template>
  <mt-popover class="mt-context-button" :title="title" :child-views="childViews">
    <template #trigger="{ toggleFloatingUi }">
      <slot name="button">
        <button
          type="button"
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

<style>
.mt-context-button {
  &.is--open .mt-context-button__button {
    border-color: var(--color-border-primary-default);
  }

  & .mt-context-button__button {
    position: relative;
    color: var(--color-icon-primary-default);
    background: 0 none;
    border: 1px solid transparent;
    border-radius: var(--border-radius-xs);
    cursor: pointer;
    height: var(--scale-size-24);
    line-height: 20px;
    padding: 0 var(--scale-size-8);
    outline: none;
    font-family: var(--font-family-body);

    &:hover {
      border-color: var(--color-border-primary-default);
    }
  }
}
</style>
