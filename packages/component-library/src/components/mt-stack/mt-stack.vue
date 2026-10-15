<template>
  <div
    :class="[
      'mt-stack',
      `mt-stack--${direction}`,
      `mt-stack--align-${align}`,
      `mt-stack--justify-${justify}`,
    ]"
    :style="{ '--mt-stack-gap': `var(--${gap})` }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { SpacingSize } from "../../utils/spacing";

withDefaults(
  defineProps<{
    /**
     * Whether the items stack vertically (one below the other) or
     * horizontally (side by side in one row).
     */
    direction?: "vertical" | "horizontal";
    /**
     * Spacing token used between the items.
     */
    gap?: SpacingSize;
    /**
     * How items align on the cross axis: horizontally for a vertical stack,
     * vertically for a horizontal one.
     */
    align?: "start" | "center" | "end" | "stretch";
    /**
     * How items are distributed along the main axis: vertically for a
     * vertical stack, horizontally for a horizontal one. `end` pushes a row of
     * buttons to the right, `space-between` spreads items across the width.
     */
    justify?: "start" | "center" | "end" | "space-between";
  }>(),
  {
    direction: "vertical",
    gap: "scale-size-32",
    align: "stretch",
    justify: "start",
  },
);

defineSlots<{
  default?: null;
}>();
</script>

<style>
.mt-stack {
  display: flex;
  gap: var(--mt-stack-gap);
}

.mt-stack--vertical {
  flex-direction: column;
}

.mt-stack--horizontal {
  flex-direction: row;
}

.mt-stack--align-start {
  align-items: flex-start;
}

.mt-stack--align-center {
  align-items: center;
}

.mt-stack--align-end {
  align-items: flex-end;
}

.mt-stack--align-stretch {
  align-items: stretch;
}

.mt-stack--justify-start {
  justify-content: flex-start;
}

.mt-stack--justify-center {
  justify-content: center;
}

.mt-stack--justify-end {
  justify-content: flex-end;
}

.mt-stack--justify-space-between {
  justify-content: space-between;
}
</style>
