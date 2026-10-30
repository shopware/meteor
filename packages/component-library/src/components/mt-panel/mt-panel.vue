<template>
  <div
    :id="panelId"
    ref="root"
    class="mt-panel"
    :class="{
      'mt-panel--drawer': isInDrawer,
      [`mt-panel--handle-${handleEdge}`]: hasHandle,
      'mt-panel--resizing': isDragging,
      'mt-panel--resetting': isResetting,
    }"
    :style="panelStyle"
  >
    <div class="mt-panel__body">
      <slot />
    </div>

    <div
      v-if="hasHandle"
      class="mt-panel__handle"
      role="separator"
      aria-orientation="vertical"
      tabindex="0"
      :aria-label="t('resize', { label: context?.label() })"
      :aria-controls="panelId"
      :aria-valuenow="renderedWidth ?? undefined"
      :aria-valuemin="smallestWidth"
      :aria-valuemax="isMounted ? largestWidth() : undefined"
      @pointerdown="startDrag"
      @pointermove="drag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
      @lostpointercapture="endDrag"
      @keydown="resizeWithKeyboard"
      @dblclick="reset"
    />
  </div>
</template>

<script lang="ts">
import { PANEL_MARKER } from "./panel-settings";

// Layouts recognize the panel in their slots by this marker, before it renders.
export default {
  [PANEL_MARKER]: true,
};
</script>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onMounted,
  onScopeDispose,
  ref,
  useId,
  useTemplateRef,
  watch,
} from "vue";
import { useMounted, useResizeObserver } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useRenderingRoutePath } from "@/utils/router";
import {
  PANEL_SLIDE_DURATION,
  panelContextKey,
  panelWidthStorageKey,
  type PanelAppearance,
} from "./panel-settings";

/**
 * A panel of `mt-app` or `mt-page`: it names the panel and its trigger, and sets its width, whether
 * it can be resized and whether it can be closed on desktop.
 *
 * @experimental The API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /**
     * The name of the panel's drawer and trigger. Defaults to the name of its slot, such as
     * "Sidebar", translated for English and German.
     */
    label?: string;
    /** The icon of the panel's trigger. Defaults to an icon for its slot. */
    icon?: string;
    /** Shows the panel's trigger also in the desktop layout, where it shows and hides the panel. */
    closable?: boolean;
    /**
     * How the panel is set off from the content: `bordered` in a frame in `mt-app` and with a line
     * on its inner edge in `mt-page`, `plain` without a border. Defaults to `plain` for the
     * navigation and to `bordered` for the other panels.
     *
     * @values bordered, plain
     */
    appearance?: PanelAppearance;
    /** The smallest width in pixels, also when resizing. */
    minWidth?: number;
    /** The largest width in pixels, also when resizing. */
    maxWidth?: number;
    /** Adds a handle on the inner edge to resize the panel in the desktop layout. */
    resizable?: boolean;
  }>(),
  {
    label: undefined,
    icon: undefined,
    closable: false,
    appearance: undefined,
    minWidth: undefined,
    maxWidth: undefined,
    resizable: false,
  },
);

/**
 * The width in pixels. Without it, the panel is as wide as its content. It changes when the user
 * resizes the panel: at the end of a drag, on a key press, or when the handle resets it.
 */
const width = defineModel<number>("width");

defineSlots<{
  /** The content of the panel, which brings its own landmark, such as an `<aside>`. */
  default?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: {
      resize: "Resize {label}",
    },
    de: {
      resize: "Breite von {label} ändern",
    },
  },
});

/** The smallest width when resizing, so a panel can't be dragged out of reach. */
const SMALLEST_WIDTH = 160;
/** How far the arrow keys move the handle, in pixels. */
const KEYBOARD_STEP = 10;
/** The width of the zone at the outer edge that closes the panel when a drag ends in it. */
const CLOSE_ZONE_WIDTH = 24;

const context = inject(panelContextKey, null);
const root = useTemplateRef<HTMLElement>("root");
const panelId = useId();
const isMounted = useMounted();
const renderingRoutePath = useRenderingRoutePath();

// With `v-model:width`, the app keeps the width, so the panel doesn't remember it itself.
const vnodeProps = getCurrentInstance()?.vnode.props ?? {};
const isWidthControlled = "width" in vnodeProps && "onUpdate:width" in vnodeProps;

const startingWidth = width.value;
const renderedWidth = ref<number | null>(null);
// The width while a drag is going on. It is only stored and emitted when the drag ends.
const dragWidth = ref<number | null>(null);
// A panel dragged into the close zone keeps the dragged width while it slides out, and opens again
// with the width it had before the drag.
const closingWidth = ref<number | null>(null);
const isDragging = ref(false);
const isResetting = ref(false);

const isInDrawer = computed(() => context?.isDrawer.value ?? false);
const hasHandle = computed(() => props.resizable && context !== null && !isInDrawer.value);
const canCloseByDrag = computed(() => hasHandle.value && props.closable);
const smallestWidth = computed(() => props.minWidth ?? SMALLEST_WIDTH);

// Panels before the content (navigation, start) are resized at their end edge, the others at their
// start edge.
const handleEdge = computed(() =>
  context?.place === "navigation" || context?.place === "start" ? "end" : "start",
);

const panelStyle = computed(() => {
  // A drawer takes the width the panel started with, not one the user resized it to on desktop.
  const shownWidth = isInDrawer.value
    ? startingWidth
    : dragWidth.value ?? closingWidth.value ?? width.value;

  return {
    "--mt-panel-width": shownWidth === undefined ? undefined : `${shownWidth}px`,
    "--mt-panel-min-width": props.minWidth === undefined ? undefined : `${props.minWidth}px`,
    "--mt-panel-max-width": props.maxWidth === undefined ? undefined : `${props.maxWidth}px`,
  };
});

/** The largest width: `max-width`, and never more than half of the layout next to the panel. */
function largestWidth() {
  const layoutWidth = context?.layoutWidth() ?? window.innerWidth;

  return Math.min(props.maxWidth ?? Infinity, Math.floor(layoutWidth / 2));
}

function clamp(next: number) {
  return Math.round(Math.min(Math.max(next, smallestWidth.value), largestWidth()));
}

// The width is only stored in the browser, so the key is known once the panel has mounted.
let storageKey: string | null = null;

function readStoredWidth() {
  if (!storageKey) return undefined;

  try {
    const stored = Number(localStorage.getItem(storageKey));
    return stored > 0 ? stored : undefined;
  } catch {
    // The browser blocks the storage, so there is no remembered width.
    return undefined;
  }
}

function storeWidth(next: number | undefined) {
  if (!storageKey) return;

  try {
    if (next === undefined) localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, String(next));
  } catch {
    // The browser blocks the storage, so the width lasts until the page reloads.
  }
}

function commit(next: number) {
  width.value = next;
  storeWidth(next);
}

let resetTimeout: ReturnType<typeof setTimeout> | undefined;

function stopResetting() {
  clearTimeout(resetTimeout);
  isResetting.value = false;
}

/** Goes back to the width the panel started with: `width`, or the width of its content. */
function reset() {
  stopResetting();
  isResetting.value = true;
  resetTimeout = setTimeout(stopResetting, PANEL_SLIDE_DURATION);

  width.value = startingWidth;
  storeWidth(undefined);
}

let dragStart: {
  pointerId: number;
  x: number;
  width: number;
  /** The panel's outer edge, opposite the handle, which stays in place during the drag. */
  outerEdge: number;
  userSelect: string;
  cursor: string;
} | null = null;

// Whether the pointer is in the close zone during a drag, or beyond it.
let isInCloseZone = false;

function startDrag(event: PointerEvent) {
  if (event.button !== 0 || dragStart || !root.value) return;

  event.preventDefault();
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

  // Text in the page would otherwise get selected while the pointer moves, and the cursor would
  // change back whenever the pointer runs ahead of the handle.
  const documentStyle = document.documentElement.style;
  const rect = root.value.getBoundingClientRect();
  dragStart = {
    pointerId: event.pointerId,
    x: event.clientX,
    width: rect.width,
    outerEdge: handleEdge.value === "end" ? rect.left : rect.right,
    userSelect: documentStyle.userSelect,
    cursor: documentStyle.cursor,
  };
  documentStyle.userSelect = "none";
  documentStyle.cursor = "col-resize";

  isDragging.value = true;
  stopResetting();
  context?.setResizing(true);
}

function drag(event: PointerEvent) {
  if (!dragStart || event.pointerId !== dragStart.pointerId) return;

  const distance = event.clientX - dragStart.x;
  const next = dragStart.width + (handleEdge.value === "end" ? distance : -distance);
  dragWidth.value = clamp(next);

  if (!canCloseByDrag.value) return;

  // Past its smallest width, the panel slides out with the pointer, as a preview of closing it.
  context?.slideOut(Math.max(smallestWidth.value - next, 0));

  // Beyond the outer edge, up to and past the edge of the screen, the distance is negative.
  const towardsInside = handleEdge.value === "end" ? 1 : -1;
  isInCloseZone = (event.clientX - dragStart.outerEdge) * towardsInside <= CLOSE_ZONE_WIDTH;
}

/** Ends a drag. Releasing the pointer in the close zone closes the panel instead of resizing it. */
function endDrag(event?: PointerEvent) {
  if (!dragStart || (event && event.pointerId !== dragStart.pointerId)) return;

  document.documentElement.style.userSelect = dragStart.userSelect;
  document.documentElement.style.cursor = dragStart.cursor;
  dragStart = null;

  const draggedWidth = dragWidth.value;
  const closes = event?.type === "pointerup" && isInCloseZone;
  dragWidth.value = null;
  isDragging.value = false;
  isInCloseZone = false;
  context?.setResizing(false);
  context?.release(closes);

  if (closes) {
    closingWidth.value = draggedWidth;

    // The layout may keep the panel open, for example while a view hides it.
    nextTick(() => {
      if (context?.isOpen()) closingWidth.value = null;
    });
  } else if (draggedWidth !== null) {
    commit(draggedWidth);
  }
}

function resizeWithKeyboard(event: KeyboardEvent) {
  const current = width.value ?? renderedWidth.value ?? smallestWidth.value;
  const grow = handleEdge.value === "end" ? "ArrowRight" : "ArrowLeft";
  const shrink = handleEdge.value === "end" ? "ArrowLeft" : "ArrowRight";

  let next: number;

  switch (event.key) {
    case grow:
      next = current + KEYBOARD_STEP;
      break;
    case shrink:
      next = current - KEYBOARD_STEP;
      break;
    case "Home":
      next = smallestWidth.value;
      break;
    case "End":
      next = largestWidth();
      break;
    default:
      return;
  }

  event.preventDefault();
  commit(clamp(next));
}

useResizeObserver(root, ([entry]) => {
  if (entry) {
    renderedWidth.value = Math.round(
      entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width,
    );
  }
});

watch(
  () => context?.isOpen(),
  (isOpen) => {
    if (isOpen) closingWidth.value = null;
  },
);

// The remembered width only exists in the browser. The router knows the page that renders the
// panel once the page has mounted.
onMounted(async () => {
  if (!context || isWidthControlled) return;

  await nextTick();

  // Without a router, the URL path names the page.
  storageKey = panelWidthStorageKey(context.place, renderingRoutePath() ?? location.pathname);
  if (!props.resizable) return;

  const stored = readStoredWidth();
  if (stored !== undefined) width.value = clamp(stored);
});

// The layout reads the options from its slot while it renders. A panel inside another component
// is only known from these.
if (context) {
  onScopeDispose(
    context.registerOptions(() => ({
      label: props.label,
      icon: props.icon,
      closable: props.closable,
      appearance: props.appearance,
    })),
  );
}

// A drag that is cut off, for example when the panel unmounts, mustn't keep the page unselectable.
onScopeDispose(() => {
  endDrag();
  stopResetting();
});
</script>

<style scoped>
.mt-panel {
  --mt-panel-handle-width: var(--scale-size-16);

  position: relative;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  box-sizing: border-box;
  width: var(--mt-panel-width, auto);
  min-width: var(--mt-panel-min-width, 0);
  /* Half of the page around it, or of the viewport. */
  max-width: min(var(--mt-panel-max-width, 50cqw), 50cqw);
  min-height: 0;
  border-radius: inherit;
}

/* In a drawer, the panel is at most as wide as the drawer, which ends before the screen's edge. */
.mt-panel--drawer {
  max-width: min(var(--mt-panel-max-width, 100%), 100%);
}

.mt-panel--resetting {
  transition: width var(--mt-panel-slide-duration) var(--mt-panel-slide-easing);
}

.mt-panel__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  /* Clips the content to the corners of a framed region. */
  border-radius: inherit;
}

.mt-panel__handle {
  position: absolute;
  z-index: 1;
  inset-block: 0;
  width: var(--mt-panel-handle-width);
  cursor: col-resize;
  outline: none;
  touch-action: none;
}

/*
 * The handle reaches 4px over the nearest visible edge on the side of the scrollbar next to it (the
 * panel's own one at its end, the neighbor's one at its start), and 12px over the other side. The
 * layout sets the distance to that edge as `--mt-panel-edge-offset`.
 */
.mt-panel--handle-end > .mt-panel__handle {
  inset-inline-end: calc(-1 * var(--scale-size-12) - var(--mt-panel-edge-offset, 0px));
}

.mt-panel--handle-start > .mt-panel__handle {
  inset-inline-start: calc(-1 * var(--scale-size-4) - var(--mt-panel-edge-offset, 0px));
}

/* A line on the edge, fading out towards the top and the bottom. */
.mt-panel__handle::after {
  content: "";
  position: absolute;
  inset-block: 0;
  inset-inline-start: calc(var(--scale-size-4) - var(--scale-size-2) / 2);
  width: var(--scale-size-2);
  background-image: linear-gradient(
    to bottom,
    transparent,
    var(--color-border-primary-default) 30%,
    var(--color-border-primary-default) 70%,
    transparent
  );
  opacity: 0;
  transition: opacity 100ms ease-out;
}

.mt-panel__handle:hover::after,
.mt-panel__handle:focus-visible::after,
.mt-panel--resizing > .mt-panel__handle::after {
  opacity: 1;
}

.mt-panel__handle:focus-visible::after {
  background-image: none;
  background-color: var(--color-border-brand-default);
}

/*
 * The cursor changes right away, while the line follows after a moment, so passing the edge doesn't
 * flash it. Keyboard focus and dragging show it at once.
 */
.mt-panel__handle:hover::after {
  transition-delay: 300ms;
}

.mt-panel__handle:focus-visible::after,
.mt-panel--resizing > .mt-panel__handle::after {
  transition-delay: 0ms;
}

@media (prefers-reduced-motion: reduce) {
  .mt-panel--resetting,
  .mt-panel__handle::after {
    transition: none;
  }
}
</style>
