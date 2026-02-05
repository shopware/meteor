<template>
  <DropdownMenuGroup
    :class="['mt-action-menu-group', { 'mt-action-menu-group--needs-inset': needsInset }]"
  >
    <slot />
  </DropdownMenuGroup>
</template>

<script setup lang="ts">
import { DropdownMenuGroup } from "reka-ui";
import { provide, ref, readonly, computed } from "vue";

const iconCount = ref(0);
const noIconCount = ref(0);

// Only apply inset when there are BOTH items with icons AND items without icons
const needsInset = computed(() => iconCount.value > 0 && noIconCount.value > 0);

const registerItem = (hasIcon: boolean) => {
  if (hasIcon) {
    iconCount.value++;
  } else {
    noIconCount.value++;
  }
};

provide("mt-action-menu-group", {
  registerItem,
  needsInset: readonly(needsInset),
});
</script>

<style>
.mt-action-menu-group {
  padding-block: var(--scale-size-4);
  border-bottom: 1px solid var(--color-border-secondary-default);
  margin-inline: calc(var(--scale-size-4) * -1);
  padding-inline: var(--scale-size-4);
}

.mt-action-menu-group:last-child {
  border-bottom: none;
  padding-block-end: 0;
}

.mt-action-menu-group:first-child {
  padding-block-start: 0;
}

/* 
  When group has mixed icons (some items with, some without),
  add left padding to items without icons to align text.
*/
.mt-action-menu-group--needs-inset .mt-action-menu-item:not([data-has-icon]) {
  /* 16px icon + 8px gap */
  padding-inline-start: calc(var(--scale-size-10) + 16px + var(--scale-size-8));
}
</style>
