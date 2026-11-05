<template>
  <div
    :class="[
      'mt-scroll-area',
      `mt-scroll-area--${orientation}`,
      {
        'mt-scroll-area--fade': fadeEdges.length > 0,
        'mt-scroll-area--scrollbar': scrollbar,
      },
    ]"
    :style="fadeStyle"
    :data-overflowing="isOverflowing ? '' : undefined"
  >
    <div ref="viewport" class="mt-scroll-area__viewport" :tabindex="isOverflowing ? 0 : undefined">
      <div ref="content" class="mt-scroll-area__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { useResizeObserver } from "@vueuse/core";

type FadeEdge = "top" | "bottom" | "start" | "end";
type FadeSize = 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64;

const props = withDefaults(
  defineProps<{
    /**
     * The direction the content scrolls in.
     */
    orientation?: "vertical" | "horizontal" | "both";
    /**
     * Shows the native scrollbar of the operating system. By default the scrollbar is hidden
     * and the fade shows that there is more to scroll.
     */
    scrollbar?: boolean;
    /**
     * Fades the content out at the edges while there is more to scroll. `true` fades both
     * edges of each scrolling direction, an edge name fades only that edge, `false` turns the
     * fade off. Start and end follow the reading direction.
     */
    fade?: boolean | FadeEdge;
    /**
     * The size of the fade, as a step of the `--scale-size-*` token scale, either for all
     * edges or per edge. By default the fade takes 12% of the area, up to `--scale-size-40`.
     *
     * @values 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64
     */
    fadeSize?: FadeSize | Partial<Record<FadeEdge, FadeSize>>;
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

const fadeEdges = computed<FadeEdge[]>(() => {
  if (props.fade === false) return [];
  if (props.fade !== true) return [props.fade];

  const edges: FadeEdge[] = [];
  if (props.orientation !== "horizontal") edges.push("top", "bottom");
  if (props.orientation !== "vertical") edges.push("start", "end");
  return edges;
});

const fadeStyle = computed(() => {
  const style: Record<string, string> = {};

  for (const edge of fadeEdges.value) {
    const size = typeof props.fadeSize === "object" ? props.fadeSize[edge] : props.fadeSize;
    style[`--mt-scroll-area-fade-size-${edge}`] = size
      ? `var(--scale-size-${size})`
      : "var(--mt-scroll-area-fade-size-default)";
  }

  return style;
});

const isOverflowing = ref(false);

function updateOverflow() {
  const element = viewport.value;
  if (!element) return;

  const overflowsY = element.scrollHeight > element.clientHeight;
  const overflowsX = element.scrollWidth > element.clientWidth;

  isOverflowing.value =
    (props.orientation !== "horizontal" && overflowsY) ||
    (props.orientation !== "vertical" && overflowsX);
}

useResizeObserver([viewport, content], updateOverflow);

defineExpose({
  /**
   * The scrolling element, for example to scroll programmatically.
   */
  viewport,
});
</script>

<style>
@property --mt-scroll-area-fade-top {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0px;
}

@property --mt-scroll-area-fade-bottom {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 0px;
}

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
  --mt-scroll-area-fade-size-default: min(12%, var(--scale-size-40));
  --mt-scroll-area-fade-size-top: 0px;
  --mt-scroll-area-fade-size-bottom: 0px;
  --mt-scroll-area-fade-size-start: 0px;
  --mt-scroll-area-fade-size-end: 0px;
  --mt-scroll-area-fade-inline-direction: to right;

  display: flex;
  flex-direction: column;
}

.mt-scroll-area:dir(rtl) {
  --mt-scroll-area-fade-inline-direction: to left;
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
}

.mt-scroll-area--horizontal > .mt-scroll-area__viewport {
  overflow: auto hidden;
}

.mt-scroll-area--both > .mt-scroll-area__viewport {
  overflow: auto;
}

.mt-scroll-area:not(.mt-scroll-area--scrollbar) > .mt-scroll-area__viewport {
  scrollbar-width: none;
}

.mt-scroll-area:not(.mt-scroll-area--scrollbar) > .mt-scroll-area__viewport::-webkit-scrollbar {
  display: none;
}

/* Lets the content grow wider than the viewport, so its size reflects horizontal overflow */
.mt-scroll-area--horizontal .mt-scroll-area__content,
.mt-scroll-area--both .mt-scroll-area__content {
  min-width: fit-content;
}

.mt-scroll-area--fade > .mt-scroll-area__viewport {
  mask-image: linear-gradient(
      to bottom,
      transparent,
      #000 var(--mt-scroll-area-fade-top),
      #000 calc(100% - var(--mt-scroll-area-fade-bottom)),
      transparent
    ),
    linear-gradient(
      var(--mt-scroll-area-fade-inline-direction),
      transparent,
      #000 var(--mt-scroll-area-fade-start),
      #000 calc(100% - var(--mt-scroll-area-fade-end)),
      transparent
    );
  mask-composite: intersect;
}

/*
 * Each edge fades in over the first part of the scroll range and out over the last, driven by
 * the viewport's own scroll position. Without overflow the timeline is inactive, so the edges
 * keep their initial value of 0 and nothing fades.
 */
@supports (animation-timeline: scroll()) {
  .mt-scroll-area--fade > .mt-scroll-area__viewport {
    animation-name: mt-scroll-area-fade-top, mt-scroll-area-fade-bottom, mt-scroll-area-fade-start,
      mt-scroll-area-fade-end;
    animation-duration: auto;
    animation-timing-function: linear;
    animation-fill-mode: both;
    animation-timeline: scroll(self block), scroll(self block), scroll(self inline),
      scroll(self inline);
    animation-range:
      0 var(--scale-size-96),
      calc(100% - var(--scale-size-96)) 100%,
      0 var(--scale-size-96),
      calc(100% - var(--scale-size-96)) 100%;
  }
}

/* Without scroll-driven animations, the edges fade statically while the content overflows */
@supports not (animation-timeline: scroll()) {
  .mt-scroll-area--fade[data-overflowing] > .mt-scroll-area__viewport {
    --mt-scroll-area-fade-top: var(--mt-scroll-area-fade-size-top);
    --mt-scroll-area-fade-bottom: var(--mt-scroll-area-fade-size-bottom);
    --mt-scroll-area-fade-start: var(--mt-scroll-area-fade-size-start);
    --mt-scroll-area-fade-end: var(--mt-scroll-area-fade-size-end);
  }
}

@keyframes mt-scroll-area-fade-top {
  from {
    --mt-scroll-area-fade-top: 0px;
  }
  to {
    --mt-scroll-area-fade-top: var(--mt-scroll-area-fade-size-top);
  }
}

@keyframes mt-scroll-area-fade-bottom {
  from {
    --mt-scroll-area-fade-bottom: var(--mt-scroll-area-fade-size-bottom);
  }
  to {
    --mt-scroll-area-fade-bottom: 0px;
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
