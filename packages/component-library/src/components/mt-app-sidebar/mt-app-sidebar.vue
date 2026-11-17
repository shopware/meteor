<template>
  <aside class="mt-app-sidebar">
    <header v-if="hasSlotContent($slots.start)" class="mt-app-sidebar__start">
      <slot name="start" />
    </header>

    <div v-if="hasSlotContent($slots.actions)" class="mt-app-sidebar__actions">
      <slot name="actions" />
    </div>

    <mt-scroll-area class="mt-app-sidebar__body">
      <mt-nav :sections="sections" />
    </mt-scroll-area>

    <footer v-if="hasSlotContent($slots.end)" class="mt-app-sidebar__end">
      <slot name="end" />
    </footer>
  </aside>
</template>

<script setup lang="ts">
import MtNav, { type NavSection } from "@/components/mt-nav/mt-nav.vue";
import MtScrollArea from "@/components/mt-scroll-area/mt-scroll-area.vue";
import { hasSlotContent } from "@/utils/slot";

/**
 * The main navigation of an application in a sidebar: a fixed start and end around the navigation,
 * which scrolls between them. It is a complementary landmark (`<aside>`).
 *
 * @experimental The API may still change in a future release.
 */
defineProps<{
  /** The sections of the navigation, each holding its rows, as for `mt-nav`. */
  sections: NavSection[];
}>();

defineSlots<{
  /** A fixed area at the top, for example `mt-brand`. */
  start?(): unknown;
  /** Buttons below the start, for example to open the notifications. */
  actions?(): unknown;
  /** A fixed area at the bottom, for example `mt-user-menu`. */
  end?(): unknown;
}>();
</script>

<style scoped>
.mt-app-sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  /* Fills an mt-panel that sets a width, and is 300px wide otherwise. */
  width: var(--mt-panel-width, 300px);
  max-width: 100%;
  height: 100%;
  min-height: 0;
  padding: var(--scale-size-24) var(--scale-size-12) var(--scale-size-8);
  color: var(--color-text-primary-default);
}

.mt-app-sidebar__start,
.mt-app-sidebar__actions,
.mt-app-sidebar__end {
  flex: 0 0 auto;
}

.mt-app-sidebar__start {
  display: flex;
  min-width: 0;
  padding-inline-start: var(--scale-size-10);
}

.mt-app-sidebar__actions {
  display: flex;
  gap: var(--scale-size-8);
  padding-block-start: var(--scale-size-16);
}

.mt-app-sidebar__body {
  flex: 1 1 0;
  min-height: 0;
}
</style>
