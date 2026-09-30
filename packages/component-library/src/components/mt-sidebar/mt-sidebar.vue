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
     * Width of the sidebar as a CSS length, for example "300px" or "100%".
     */
    width?: string;
  }>(),
  {
    ariaLabel: "Sidebar",
    width: "300px",
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
  --mt-sidebar-background: var(--color-elevation-surface-sunken);
  --mt-sidebar-padding-inline: var(--scale-size-12);
  --mt-sidebar-padding-block-start: var(--scale-size-24);
  --mt-sidebar-padding-block-end: var(--scale-size-8);

  /* Height of the fade at the top and bottom edge of the scrolling navigation.
     Doubles as the content's vertical padding, so resting content stays fully visible. */
  --mt-sidebar-body-fade: var(--scale-size-20);

  display: flex;
  flex-direction: column;
  width: var(--mt-sidebar-width);
  max-width: 100%;
  height: 100%;
  min-height: 0;
  padding: var(--mt-sidebar-padding-block-start) var(--mt-sidebar-padding-inline)
    var(--mt-sidebar-padding-block-end);
  background: var(--mt-sidebar-background);
  color: var(--color-text-primary-default);
}

.mt-sidebar__header,
.mt-sidebar__footer {
  flex: 0 0 auto;
}

.mt-sidebar__header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-12);
  padding-inline-start: var(--scale-size-10);
}

.mt-sidebar__body {
  position: relative;
  flex: 1 1 0;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.mt-sidebar__body::-webkit-scrollbar {
  display: none;
}

/* The padding lives here, not on the scroll container: padding on the scroll
   container would keep the sticky fades away from the header and footer. */
.mt-sidebar__content {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
  padding: var(--mt-sidebar-body-fade) 0;
}

/* Fades the navigation into the sidebar background at the edge it scrolls past,
   from 4px inside the edge to the body padding. */
.mt-sidebar__scroll-shadow {
  position: sticky;
  left: 0;
  right: 0;
  z-index: 1;
  height: var(--mt-sidebar-body-fade);
  pointer-events: none;
}

.mt-sidebar__scroll-shadow--top {
  top: 0;
  margin-block-end: calc(var(--mt-sidebar-body-fade) * -1);
  background: linear-gradient(
    to bottom,
    var(--mt-sidebar-background) var(--scale-size-4),
    transparent
  );
}

.mt-sidebar__scroll-shadow--bottom {
  bottom: 0;
  margin-block-start: calc(var(--mt-sidebar-body-fade) * -1);
  background: linear-gradient(
    to top,
    var(--mt-sidebar-background) var(--scale-size-4),
    transparent
  );
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

@media (prefers-reduced-motion: reduce) {
  .mt-sidebar-shadow-fade-enter-active,
  .mt-sidebar-shadow-fade-leave-active {
    transition: none;
  }
}
</style>
