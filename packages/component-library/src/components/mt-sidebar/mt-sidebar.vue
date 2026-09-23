<template>
  <aside
    class="mt-sidebar"
    :class="{
      'mt-sidebar--has-header': !!$slots.header,
      'mt-sidebar--has-footer': !!$slots.footer,
    }"
    :style="{ '--mt-sidebar-width': width }"
    :aria-label="ariaLabel"
  >
    <header v-if="$slots.header" class="mt-sidebar__header">
      <!-- @slot Fixed area at the top of the sidebar, for example a logo or a title -->
      <slot name="header" />
    </header>

    <div ref="scrollContainerRef" class="mt-sidebar__body" @scroll.passive="updateScrollShadows">
      <transition name="mt-sidebar-shadow-fade">
        <div
          v-if="['bottom', 'middle'].includes(scrollPosition)"
          class="mt-sidebar__scroll-shadow mt-sidebar__scroll-shadow--top"
          data-testid="mt-sidebar-scroll-shadow-top"
        />
      </transition>

      <div class="mt-sidebar__content">
        <!-- @slot The navigation of the sidebar. Scrolls on its own when it is taller than the sidebar -->
        <slot />
      </div>

      <transition name="mt-sidebar-shadow-fade">
        <div
          v-if="['top', 'middle'].includes(scrollPosition)"
          class="mt-sidebar__scroll-shadow mt-sidebar__scroll-shadow--bottom"
          data-testid="mt-sidebar-scroll-shadow-bottom"
        />
      </transition>
    </div>

    <footer v-if="$slots.footer" class="mt-sidebar__footer">
      <!-- @slot Fixed area at the bottom of the sidebar, for example a user menu or a logout button -->
      <slot name="footer" />
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

withDefaults(
  defineProps<{
    /**
     * Accessible name of the sidebar, announced by screen readers.
     */
    ariaLabel?: string;
    /**
     * Width of the sidebar as a CSS length, for example "16rem" or "100%".
     */
    width?: string;
  }>(),
  {
    ariaLabel: "Sidebar",
    width: "16rem",
  },
);

defineSlots<{
  header?: null;
  default?: null;
  footer?: null;
}>();

const scrollContainerRef = ref<HTMLElement | null>(null);

/**
 * Where the scrollable body currently is:
 * - "none": everything fits, no scrolling needed
 * - "top": scrolled to the top, more content below
 * - "bottom": scrolled to the bottom, more content above
 * - "middle": more content in both directions
 */
const scrollPosition = ref<"none" | "top" | "middle" | "bottom">("none");

const thresholdInPx = 1;

function updateScrollShadows() {
  const element = scrollContainerRef.value;
  if (!element) return;

  const { scrollHeight, clientHeight, scrollTop } = element;

  const isScrollable = scrollHeight - clientHeight > thresholdInPx;
  if (!isScrollable) {
    scrollPosition.value = "none";
    return;
  }

  const reachedTop = scrollTop <= thresholdInPx;
  const reachedBottom = scrollHeight - scrollTop - clientHeight <= thresholdInPx;

  if (reachedTop) {
    scrollPosition.value = "top";
  } else if (reachedBottom) {
    scrollPosition.value = "bottom";
  } else {
    scrollPosition.value = "middle";
  }
}

let resizeObserver: ResizeObserver | null = null;

onMounted(async () => {
  await nextTick();
  updateScrollShadows();

  // Recheck when the sidebar or its content changes size, e.g. when
  // a navigation group is expanded or the window gets smaller.
  if (typeof ResizeObserver === "undefined" || !scrollContainerRef.value) return;

  resizeObserver = new ResizeObserver(() => updateScrollShadows());
  resizeObserver.observe(scrollContainerRef.value);

  const content = scrollContainerRef.value.querySelector(".mt-sidebar__content");
  if (content) resizeObserver.observe(content);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

defineExpose({
  /**
   * Re-evaluates the scroll shadows, e.g. after the navigation changed
   * in a way the sidebar cannot detect on its own.
   */
  updateScrollShadows,
});
</script>

<style scoped>
.mt-sidebar {
  --mt-sidebar-padding-inline: var(--scale-size-16);
  --mt-sidebar-padding-block: var(--scale-size-16);

  display: flex;
  flex-direction: column;
  width: var(--mt-sidebar-width);
  max-width: 100%;
  height: 100%;
  min-height: 0;
  background: var(--color-elevation-surface-raised);
  border-inline-end: 1px solid var(--color-border-secondary-default);
  color: var(--color-text-primary-default);
}

.mt-sidebar__header,
.mt-sidebar__footer {
  flex: 0 0 auto;
  padding: var(--mt-sidebar-padding-block) var(--mt-sidebar-padding-inline);
}

.mt-sidebar__header {
  border-block-end: 1px solid var(--color-border-secondary-default);
}

.mt-sidebar__footer {
  border-block-start: 1px solid var(--color-border-secondary-default);
}

.mt-sidebar__body {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}

.mt-sidebar__content {
  padding: var(--mt-sidebar-padding-block) var(--mt-sidebar-padding-inline);
}

.mt-sidebar__scroll-shadow {
  position: sticky;
  left: 0;
  right: 0;
  z-index: 1;
  height: var(--scale-size-4);
  margin-top: calc(var(--scale-size-4) * -1);
  filter: blur(3px);
  background-color: var(--color-elevation-shadow-default);
  pointer-events: none;
}

.mt-sidebar__scroll-shadow--top {
  top: 0;
}

.mt-sidebar__scroll-shadow--bottom {
  bottom: 0;
}

.mt-sidebar-shadow-fade-enter-active {
  transition: opacity 400ms cubic-bezier(0.05, 0.7, 0.1, 1);
}

.mt-sidebar-shadow-fade-leave-active {
  transition: opacity 200ms cubic-bezier(0.3, 0, 0.8, 0.15);
}

.mt-sidebar-shadow-fade-enter-from,
.mt-sidebar-shadow-fade-leave-to {
  opacity: 0;
}
</style>
