<template>
  <div
    class="mt-layout"
    :class="{
      'mt-layout--start': hasSlot('start'),
      'mt-layout--end': hasSlot('end'),
    }"
  >
    <div class="mt-layout__grid">
      <div v-if="hasSlot('start')" class="mt-layout__column mt-layout__column--start">
        <slot name="start" />
      </div>

      <div class="mt-layout__content">
        <slot />
      </div>

      <div v-if="hasSlot('end')" class="mt-layout__column mt-layout__column--end">
        <slot name="end" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hasSlotContent, useRenderCache } from "@/utils/slot";

/**
 * The content of a page with up to two columns of 300px next to it, which move above and below the
 * content when it gets too narrow. Unlike the panels of `mt-page`, they scroll with the content.
 *
 * @experimental The API may still change in a future release.
 */
const slots = defineSlots<{
  /** The main content, in the middle. */
  default?(): unknown;
  /** A column before the content. Moves above it when the content gets too narrow. */
  start?(): unknown;
  /** A column after the content. Moves below it when the content gets too narrow. */
  end?(): unknown;
}>();

const renderedSlots = useRenderCache(() => ({
  start: hasSlotContent(slots.start),
  end: hasSlotContent(slots.end),
}));

function hasSlot(name: "start" | "end") {
  return renderedSlots()[name];
}
</script>

<style scoped>
.mt-layout {
  width: 100%;
  container: mt-layout / inline-size;
}

.mt-layout__grid,
.mt-layout__column,
.mt-layout__content {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
}

.mt-layout__grid {
  align-items: start;
}

.mt-layout__column,
.mt-layout__content {
  align-content: start;
}

/* A column is 18.75rem (300px) and the content keeps at least 30rem (480px), so the breakpoints
   are their sums with the gaps. Two columns move next to the content together. */
@container mt-layout (width >= 49.75rem) {
  .mt-layout--start:not(.mt-layout--end) > .mt-layout__grid {
    grid-template-columns: 18.75rem minmax(0, 1fr);
  }

  .mt-layout--end:not(.mt-layout--start) > .mt-layout__grid {
    grid-template-columns: minmax(0, 1fr) 18.75rem;
  }
}

@container mt-layout (width >= 69.5rem) {
  .mt-layout--start.mt-layout--end > .mt-layout__grid {
    grid-template-columns: 18.75rem minmax(0, 1fr) 18.75rem;
  }
}
</style>
