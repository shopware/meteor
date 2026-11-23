<template>
  <div class="mt-table" v-bind="wrapperAttrs">
    <table class="mt-table__table" v-bind="tableAttrs">
      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
/**
 * Experimental: the API of mt-table may still change in a future release.
 */

import { computed, useAttrs, type HTMLAttributes } from "vue";

defineOptions({
  inheritAttrs: false,
});

defineSlots<{
  /**
   * The parts of the table: `mt-table-caption`, `mt-table-header`, `mt-table-body` and `mt-table-footer`.
   */
  default?: () => unknown;
}>();

const attrs = useAttrs();

// `class` and `style` size and place the scroll container, every other attribute
// (e.g. `aria-label`, `aria-labelledby`, `id`) belongs to the native table.
const wrapperAttrs = computed(
  () => ({ class: attrs.class, style: attrs.style }) as Pick<HTMLAttributes, "class" | "style">,
);

const tableAttrs = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== "class" && key !== "style")),
);
</script>

<style scoped>
.mt-table {
  overflow: auto;
}

.mt-table__table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-primary-default);
}
</style>
