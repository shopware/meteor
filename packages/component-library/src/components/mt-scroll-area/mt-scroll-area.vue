<template>
  <div
    :class="[
      'mt-scroll-area',
      `mt-scroll-area--${orientation}`,
      {
        'mt-scroll-area--fade': fade !== false,
        'mt-scroll-area--fade-start': fade === true || fade === 'start',
        'mt-scroll-area--fade-end': fade === true || fade === 'end',
        'mt-scroll-area--scrollbar': scrollbar,
      },
    ]"
    :style="
      fadeSize ? { '--mt-scroll-area-fade-size': `var(--scale-size-${fadeSize})` } : undefined
    "
    :data-overflowing="isOverflowing || undefined"
  >
    <div ref="viewport" :tabindex="isOverflowing ? 0 : undefined" class="mt-scroll-area__viewport">
      <div ref="content" class="mt-scroll-area__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { useResizeObserver } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    /**
     * The direction the content scrolls in.
     */
    orientation?: "vertical" | "horizontal";
    /**
     * Shows the native scrollbar of the operating system. By default the scrollbar is hidden
     * and the fade shows that there is more to scroll.
     */
    scrollbar?: boolean;
    /**
     * Fades the content out at the edges while there is more to scroll. `true` fades both
     * edges, `start` or `end` fades only that edge, `false` turns the fade off. Start is the
     * top of a vertical area, and follows the reading direction in a horizontal one.
     */
    fade?: boolean | "start" | "end";
    /**
     * The size of the fade, as a step of the `--scale-size-*` token scale. By default the fade
     * takes 12% of the area, up to `--scale-size-40`.
     *
     * @values 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96, 128
     */
    fadeSize?: 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64 | 72 | 80 | 96 | 128;
  }>(),
  {
    orientation: "vertical",
    scrollbar: false,
    fade: true,
    fadeSize: undefined,
  },
);

defineSlots<{
  default?: () => unknown;
}>();

const viewport = useTemplateRef("viewport");
const content = useTemplateRef("content");

const isOverflowing = ref(false);

useResizeObserver([viewport, content], () => {
  const element = viewport.value;
  if (!element) return;

  // Scroll and client sizes are rounded, so content that fits can still differ by a pixel
  isOverflowing.value =
    props.orientation === "horizontal"
      ? element.scrollWidth - element.clientWidth > 1
      : element.scrollHeight - element.clientHeight > 1;
});

defineExpose({
  /**
   * The scrolling element, for example to scroll programmatically.
   */
  viewport,
});
</script>

<style>
@property --mt-scroll-area-fade-start {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0px;
}

@property --mt-scroll-area-fade-end {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0px;
}

.mt-scroll-area {
  --mt-scroll-area-fade-size: min(12%, var(--scale-size-40));
  --mt-scroll-area-fade-size-start: 0px;
  --mt-scroll-area-fade-size-end: 0px;
  --mt-scroll-area-fade-direction: to bottom;

  display: flex;
  flex-direction: column;
}

.mt-scroll-area--horizontal {
  --mt-scroll-area-fade-direction: to right;
}

.mt-scroll-area--horizontal:dir(rtl) {
  --mt-scroll-area-fade-direction: to left;
}

.mt-scroll-area--fade-start {
  --mt-scroll-area-fade-size-start: var(--mt-scroll-area-fade-size);
}

.mt-scroll-area--fade-end {
  --mt-scroll-area-fade-size-end: var(--mt-scroll-area-fade-size);
}

/* The mask would also hide a focus ring on the viewport itself */
.mt-scroll-area:has(> .mt-scroll-area__viewport:focus-visible) {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(-1 * var(--scale-size-2));
}

.mt-scroll-area__viewport {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  outline: none;
}

.mt-scroll-area--vertical > .mt-scroll-area__viewport {
  overflow: hidden auto;
  scroll-padding-block: var(--mt-scroll-area-fade-size-start) var(--mt-scroll-area-fade-size-end);
}

.mt-scroll-area--horizontal > .mt-scroll-area__viewport {
  overflow: auto hidden;
  scroll-padding-inline: var(--mt-scroll-area-fade-size-start) var(--mt-scroll-area-fade-size-end);
}

.mt-scroll-area:not(.mt-scroll-area--scrollbar) > .mt-scroll-area__viewport {
  scrollbar-width: none;
}

.mt-scroll-area:not(.mt-scroll-area--scrollbar) > .mt-scroll-area__viewport::-webkit-scrollbar {
  display: none;
}

/* So the observed content size reflects horizontal overflow */
.mt-scroll-area--horizontal > .mt-scroll-area__viewport > .mt-scroll-area__content {
  min-width: fit-content;
}

/* A mask also clips popups inside the viewport, so it is only set while overflowing */
.mt-scroll-area--fade[data-overflowing] > .mt-scroll-area__viewport {
  mask-image: linear-gradient(
    var(--mt-scroll-area-fade-direction),
    transparent,
    #000 var(--mt-scroll-area-fade-start),
    #000 calc(100% - var(--mt-scroll-area-fade-end)),
    transparent
  );
}

@supports (animation-timeline: scroll()) {
  .mt-scroll-area--fade > .mt-scroll-area__viewport {
    animation-name: mt-scroll-area-fade-start, mt-scroll-area-fade-end;
    animation-duration: auto;
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: scroll(self block);
    /* Capped to the scroll range, so a short range still starts with the full end fade */
    animation-range:
      0 min(var(--scale-size-96), 100%),
      max(0%, calc(100% - var(--scale-size-96))) 100%;
  }

  .mt-scroll-area--fade.mt-scroll-area--horizontal > .mt-scroll-area__viewport {
    animation-timeline: scroll(self inline);
  }
}

@supports not (animation-timeline: scroll()) {
  .mt-scroll-area--fade[data-overflowing] > .mt-scroll-area__viewport {
    --mt-scroll-area-fade-start: var(--mt-scroll-area-fade-size-start);
    --mt-scroll-area-fade-end: var(--mt-scroll-area-fade-size-end);
  }
}

@keyframes mt-scroll-area-fade-start {
  from {
    --mt-scroll-area-fade-start: 0px;
  }
  to {
    --mt-scroll-area-fade-start: var(--mt-scroll-area-fade-size-start);
  }
}

@keyframes mt-scroll-area-fade-end {
  from {
    --mt-scroll-area-fade-end: var(--mt-scroll-area-fade-size-end);
  }
  to {
    --mt-scroll-area-fade-end: 0px;
  }
}
</style>
