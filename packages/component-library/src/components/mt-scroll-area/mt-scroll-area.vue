<template>
  <div
    v-bind="pickAttrs('root')"
    :class="[
      'mt-scroll-area',
      `mt-scroll-area--${orientation}`,
      {
        'mt-scroll-area--fade': fadeEdges.length > 0,
        'mt-scroll-area--scrollbar': scrollbar,
      },
    ]"
    :style="fadeStyle"
    :data-overflowing="overflowingAxes"
  >
    <div
      ref="viewport"
      :tabindex="overflowingAxes && !hasFocusableContent ? 0 : undefined"
      v-bind="pickAttrs('viewport')"
      class="mt-scroll-area__viewport"
    >
      <div ref="content" class="mt-scroll-area__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs, useTemplateRef, watch } from "vue";
import { useMutationObserver, useResizeObserver } from "@vueuse/core";

defineOptions({ inheritAttrs: false });

type FadeEdge = "top" | "bottom" | "start" | "end";
type FadeSize = 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64 | 72 | 80 | 96 | 128;

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
     * @values 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96, 128
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

// Role, label and tabindex describe the scrolling element, and its scroll and focus events do
// not bubble up to the root. Everything else goes to the root.
const VIEWPORT_ATTRS =
  /^(role|tabindex|aria(-|[A-Z]).*|on(Scroll|Scrollend|Focus|Blur)(Passive|Capture|Once)*)$/;

const attrs = useAttrs();

function pickAttrs(target: "root" | "viewport") {
  return Object.fromEntries(
    Object.entries(attrs)
      .map(([name, value]) => [name === "tabIndex" ? "tabindex" : name, value] as const)
      .filter(([name]) => VIEWPORT_ATTRS.test(name) === (target === "viewport")),
  );
}

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

const FOCUSABLE =
  ":is(a[href], button, input, select, textarea, summary, [tabindex], [contenteditable]):not([tabindex^='-'], :disabled)";

// The axes that overflow and scroll: "x", "y" or "x y"
const overflowingAxes = ref<string>();
const hasFocusableContent = ref(false);

function update() {
  const element = viewport.value;
  if (!element) return;

  // Scroll and client sizes are rounded, so content that fits can still differ by a pixel
  const overflowsX = element.scrollWidth - element.clientWidth > 1;
  const overflowsY = element.scrollHeight - element.clientHeight > 1;

  const axes: string[] = [];
  if (props.orientation !== "vertical" && overflowsX) axes.push("x");
  if (props.orientation !== "horizontal" && overflowsY) axes.push("y");
  overflowingAxes.value = axes.join(" ") || undefined;

  // Focusable content already takes keyboard users through the area, so it needs no tab stop
  hasFocusableContent.value = content.value?.querySelector(FOCUSABLE) != null;
}

useResizeObserver([viewport, content], update);
useMutationObserver(content, update, { childList: true, subtree: true });
watch(() => props.orientation, update, { flush: "post" });

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

  /* Keeps content that scrolls into view, for example on focus, out of the fade */
  scroll-padding-block: var(--mt-scroll-area-fade-size-top) var(--mt-scroll-area-fade-size-bottom);
  scroll-padding-inline: var(--mt-scroll-area-fade-size-start) var(--mt-scroll-area-fade-size-end);
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
.mt-scroll-area--horizontal > .mt-scroll-area__viewport > .mt-scroll-area__content,
.mt-scroll-area--both > .mt-scroll-area__viewport > .mt-scroll-area__content {
  min-width: fit-content;
}

/* A mask clips everything inside the viewport, even popups, so it is only set while it can fade */
.mt-scroll-area--fade[data-overflowing] > .mt-scroll-area__viewport {
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
    /* Capped to the scroll range, so a short range still starts with the full end fade */
    animation-range:
      0 min(var(--scale-size-96), 100%),
      max(0%, calc(100% - var(--scale-size-96))) 100%,
      0 min(var(--scale-size-96), 100%),
      max(0%, calc(100% - var(--scale-size-96))) 100%;
  }
}

/* Without scroll-driven animations, the edges of an axis fade statically while it overflows */
@supports not (animation-timeline: scroll()) {
  .mt-scroll-area--fade[data-overflowing~="y"] > .mt-scroll-area__viewport {
    --mt-scroll-area-fade-top: var(--mt-scroll-area-fade-size-top);
    --mt-scroll-area-fade-bottom: var(--mt-scroll-area-fade-size-bottom);
  }

  .mt-scroll-area--fade[data-overflowing~="x"] > .mt-scroll-area__viewport {
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
