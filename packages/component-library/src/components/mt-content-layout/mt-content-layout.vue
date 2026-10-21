<template>
  <div
    class="mt-content-layout"
    :class="{
      'mt-content-layout--start': hasSlot('start'),
      'mt-content-layout--end': hasSlot('end'),
    }"
  >
    <div class="mt-content-layout__grid">
      <div
        v-if="hasSlot('start')"
        class="mt-content-layout__sidebar mt-content-layout__sidebar--start"
      >
        <slot name="start" />
      </div>

      <div class="mt-content-layout__content">
        <slot />
      </div>

      <div v-if="hasSlot('end')" class="mt-content-layout__sidebar mt-content-layout__sidebar--end">
        <slot name="end" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUpdate } from "vue";
import { hasSlotContent } from "@/utils/slot";

type ContentLayoutSidebar = "start" | "end";

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
let slotPresence: Record<ContentLayoutSidebar, boolean> | undefined;

onBeforeUpdate(() => {
  slotPresence = undefined;
});

function hasSlot(name: ContentLayoutSidebar) {
  slotPresence ??= {
    start: hasSlotContent(slots.start),
    end: hasSlotContent(slots.end),
  };

  return slotPresence[name];
}
</script>

<style scoped>
.mt-content-layout {
  width: 100%;
  container: mt-content-layout / inline-size;
}

.mt-content-layout__grid,
.mt-content-layout__sidebar,
.mt-content-layout__content {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--scale-size-16);
}

.mt-content-layout__grid {
  align-items: start;
}

.mt-content-layout__sidebar,
.mt-content-layout__content {
  align-content: start;
}

/* A sidebar is 18.75rem (300px) and the content keeps at least 30rem (480px), so the breakpoints
   are their sums with the gaps. Two sidebars move next to the content together. */
@container mt-content-layout (width >= 49.75rem) {
  .mt-content-layout--start:not(.mt-content-layout--end) > .mt-content-layout__grid {
    grid-template-columns: 18.75rem minmax(0, 1fr);
  }

  .mt-content-layout--end:not(.mt-content-layout--start) > .mt-content-layout__grid {
    grid-template-columns: minmax(0, 1fr) 18.75rem;
  }
}

@container mt-content-layout (width >= 69.5rem) {
  .mt-content-layout--start.mt-content-layout--end > .mt-content-layout__grid {
    grid-template-columns: 18.75rem minmax(0, 1fr) 18.75rem;
  }
}
</style>
