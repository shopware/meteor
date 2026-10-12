<template>
  <aside class="mt-sidebar" :style="{ '--mt-sidebar-width': width }" :aria-label="ariaLabel">
    <header v-if="$slots.header" class="mt-sidebar__header">
      <slot name="header" />
    </header>

    <div ref="scrollContainerRef" class="mt-sidebar__body" @scroll.passive="updateScrollShadows">
      <transition name="mt-sidebar-shadow-fade">
        <div
          v-if="canScrollUp"
          class="mt-sidebar__scroll-shadow mt-sidebar__scroll-shadow--top"
          data-testid="mt-sidebar-scroll-shadow-top"
        />
      </transition>

      <div class="mt-sidebar__content">
        <slot />
      </div>

      <transition name="mt-sidebar-shadow-fade">
        <div
          v-if="canScrollDown"
          class="mt-sidebar__scroll-shadow mt-sidebar__scroll-shadow--bottom"
          data-testid="mt-sidebar-scroll-shadow-bottom"
        />
      </transition>
    </div>

    <footer v-if="$slots.footer" class="mt-sidebar__footer">
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

const canScrollUp = ref(false);
const canScrollDown = ref(false);

const thresholdInPx = 1;

function updateScrollShadows() {
  const element = scrollContainerRef.value;
  if (!element) return;

  const { scrollHeight, clientHeight, scrollTop } = element;

  canScrollUp.value = scrollTop > thresholdInPx;
  canScrollDown.value = scrollHeight - clientHeight - scrollTop > thresholdInPx;
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
  updateScrollShadows,
});
</script>

<style scoped>
.mt-sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: var(--mt-sidebar-width);
  max-width: 100%;
  height: 100%;
  min-height: 0;
  padding: var(--scale-size-24) var(--scale-size-12)
    var(--scale-size-8);
  background: var(--color-elevation-surface-sunken);
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
  scroll-padding-block: var(--scale-size-20);
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.mt-sidebar__body::-webkit-scrollbar {
  display: none;
}

.mt-sidebar__content {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
}

.mt-sidebar__scroll-shadow {
  position: sticky;
  left: 0;
  right: 0;
  z-index: 1;
  height: var(--scale-size-20);
  pointer-events: none;
}

.mt-sidebar__scroll-shadow--top {
  top: 0;
  margin-block-end: calc(var(--scale-size-20) * -1);
  background: linear-gradient(
    to bottom,
    var(--color-elevation-surface-sunken) var(--scale-size-4),
    transparent
  );
}

.mt-sidebar__scroll-shadow--bottom {
  bottom: 0;
  margin-block-start: calc(var(--scale-size-20) * -1);
  background: linear-gradient(
    to top,
    var(--color-elevation-surface-sunken) var(--scale-size-4),
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
