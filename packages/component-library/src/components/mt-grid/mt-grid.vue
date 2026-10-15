<template>
  <div
    :class="['mt-grid', `mt-grid--align-${align}`]"
    :style="{
      '--mt-grid-template-columns': templateColumns,
      '--mt-grid-row-gap': `var(--${rowGap ?? gap})`,
      '--mt-grid-column-gap': `var(--${columnGap ?? gap})`,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SpacingSize } from "../../utils/spacing";

const props = withDefaults(
  defineProps<{
    /**
     * The column layout. A number creates that many equal columns, which
     * collapse into fewer columns when the grid gets narrower than
     * `minColumnWidth` allows. A string is used as the `grid-template-columns`
     * value directly, for example `"1fr auto"`, and is not responsive.
     */
    columns?: number | string;
    /**
     * The narrowest a column may get before the grid drops a column.
     * Only applies when `columns` is a number.
     */
    minColumnWidth?: SpacingSize;
    /**
     * Spacing token used between rows and columns.
     */
    gap?: SpacingSize;
    /**
     * Spacing token used between rows. Overrides `gap` for rows.
     */
    rowGap?: SpacingSize;
    /**
     * Spacing token used between columns. Overrides `gap` for columns.
     */
    columnGap?: SpacingSize;
    /**
     * How items align vertically inside their row. The default `end` lines up
     * the inputs of fields whose labels, hints, or heights differ.
     */
    align?: "start" | "center" | "end" | "stretch";
  }>(),
  {
    columns: 2,
    minColumnWidth: "scale-size-192",
    gap: "scale-size-32",
    rowGap: undefined,
    columnGap: undefined,
    align: "end",
  },
);

defineSlots<{
  /**
   * The grid items. Wrap an item in `mt-grid-item` to span several columns.
   */
  default?: null;
}>();

const templateColumns = computed(() => {
  if (typeof props.columns === "string") return props.columns;

  // Each column gets an equal share of the width minus one gap. That share is
  // always a bit smaller than the exact column width, so `columns` columns fit
  // but never one more. Once the share falls below the minimum column width,
  // auto-fit drops columns one by one instead of squeezing them.
  const share = `calc(100% / ${props.columns} - var(--mt-grid-column-gap))`;
  const minWidth = `var(--${props.minColumnWidth})`;

  return `repeat(auto-fit, minmax(max(${share}, ${minWidth}), 1fr))`;
});
</script>

<style>
.mt-grid {
  display: grid;
  grid-template-columns: var(--mt-grid-template-columns);
  row-gap: var(--mt-grid-row-gap);
  column-gap: var(--mt-grid-column-gap);
}

.mt-grid--align-start {
  align-items: start;
}

.mt-grid--align-center {
  align-items: center;
}

.mt-grid--align-end {
  align-items: end;
}

.mt-grid--align-stretch {
  align-items: stretch;
}
</style>
