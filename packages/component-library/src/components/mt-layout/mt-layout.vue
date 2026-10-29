<template>
  <div
    class="mt-layout"
    :class="{
      'mt-layout--start': hasSlot('start'),
      'mt-layout--end': hasSlot('end'),
    }"
  >
    <div class="mt-layout__grid">
      <div v-if="hasSlot('start')" class="mt-layout__sidebar mt-layout__sidebar--start">
        <slot name="start" />
      </div>

      <div class="mt-layout__content">
        <slot />
      </div>

      <div v-if="hasSlot('end')" class="mt-layout__sidebar mt-layout__sidebar--end">
        <slot name="end" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUpdate } from "vue";
import { hasSlotContent } from "@/utils/slot";

type LayoutSidebar = "start" | "end";

/**
 * The content of a page with up to two sidebars of 300px next to it, for example inside `mt-page`
 * or one of its tabs. The layout fills the width of its parent, and each region stacks its blocks.
 *
 * - Unlike the panels of `mt-page`, the sidebars scroll with the content and never become drawers.
 * - When the content gets too narrow, the sidebars wrap: the start sidebar above the content, the
 *   end sidebar below it. Two sidebars wrap together.
 *
 * @experimental The API may still change in a future release.
 */
const slots = defineSlots<{
  /** The main content, in the middle. */
  default?(): unknown;
  /** A sidebar before the content. Moves above it when the content gets too narrow. */
  start?(): unknown;
  /** A sidebar after the content. Moves below it when the content gets too narrow. */
  end?(): unknown;
}>();

// Detecting empty slots renders them, so their presence is evaluated once per render.
let slotPresence: Record<LayoutSidebar, boolean> | undefined;

onBeforeUpdate(() => {
  slotPresence = undefined;
});

function hasSlot(name: LayoutSidebar) {
  slotPresence ??= {
    start: hasSlotContent(slots.start),
    end: hasSlotContent(slots.end),
  };

  return slotPresence[name];
}
</script>

<style scoped>
.mt-layout {
  width: 100%;
  container: mt-layout / inline-size;
}

.mt-layout__grid,
.mt-layout__sidebar,
.mt-layout__content {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
}

.mt-layout__grid {
  align-items: start;
}

.mt-layout__sidebar,
.mt-layout__content {
  align-content: start;
}

/* A sidebar is 18.75rem (300px) and the content keeps at least 30rem (480px), so the breakpoints
   are their sums with the gaps. Two sidebars move next to the content together. */
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
