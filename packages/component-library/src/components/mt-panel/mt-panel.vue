<template>
  <div
    :id="panelId"
    ref="root"
    class="mt-panel"
    :class="{
      'mt-panel--drawer': isInDrawer,
      [`mt-panel--handle-${handleEdge}`]: hasHandle,
      'mt-panel--resizing': dragWidth !== null,
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
      :aria-valuemin="minimum"
      :aria-valuemax="isMounted ? maximum() : undefined"
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

let hasWarnedOnServer = false;

/**
 * On the server, the layout renders the triggers before a panel inside another component reports
 * its options, so the server markup lacks them until the app has loaded.
 */
function warnOnServer() {
  if (typeof window !== "undefined" || hasWarnedOnServer) return;

  hasWarnedOnServer = true;
  console.warn(
    "[MtPanel] Put <mt-panel> directly into the panel slot, so its label, icon and closable setting are part of the server-rendered page.",
  );
}
</script>

<script setup lang="ts">
import {
  computed,
  inject,
  onMounted,
  onScopeDispose,
  ref,
  useId,
  useTemplateRef,
  watch,
} from "vue";
import { useMounted, useResizeObserver } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useRouteRecordPath } from "@/components/mt-app/composables/useAppRouter";
import { panelContextKey, panelWidthStorageKey, type PanelAppearance } from "./panel-settings";

/**
 * A panel of `mt-app` (in its `navigation` or `sidebar` slot) or of `mt-page` (in its `start` or
 * `end` slot), with its label, the icon of its trigger, whether it is closable, and its width.
 *
 * - Put it directly into the slot. The layout then knows its label, icon and closable setting
 *   before anything inside renders, also on the server.
 * - Without `width`, the panel is as wide as its content. `min-width` and `max-width` limit it,
 *   and it never takes more than half of the viewport next to the content.
 * - `resizable` adds a handle on the inner edge in the desktop layout, centered on the nearest
 *   visible edge. The panel remembers the width in the browser, one width per use (for a page's
 *   panels per page), and emits it for `v-model:width`.
 * - A panel that is `closable` and `resizable` also closes by drag: past its smallest width, it
 *   slides out with the pointer, and it closes when the drag ends in the zone at its outer edge,
 *   or beyond it.
 * - The panel scrolls its content itself, so the handle can reach over the panel's edge.
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
    /** The width in pixels. Without it, the panel is as wide as its content. */
    width?: number;
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
    width: undefined,
    minWidth: undefined,
    maxWidth: undefined,
    resizable: false,
  },
);

const emit = defineEmits<{
  /** The user resized the panel: at the end of a drag, on a key press, or by resetting it. */
  "update:width": [width: number];
}>();

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
/** The length of the animation back to the starting width, as long as the panel's slide. */
const RESET_DURATION = 250;

const context = inject(panelContextKey, null);
const root = useTemplateRef<HTMLElement>("root");
const panelId = useId();
const isMounted = useMounted();

const isInDrawer = computed(() => context?.isMobile.value ?? false);
const hasHandle = computed(() => props.resizable && context !== null && !isInDrawer.value);
const canCloseByDrag = computed(() => hasHandle.value && props.closable);

// Panels before the content (navigation, start) are resized at their end edge, the others at their
// start edge.
const handleEdge = computed(() =>
  context?.place === "navigation" || context?.place === "start" ? "end" : "start",
);

// Starts as `width` and follows it, but the panel also keeps a resized width when the app doesn't
// bind `v-model:width`. `undefined` lets the content decide.
const startingWidth = props.width;
const currentWidth = ref(props.width);

watch(
  () => props.width,
  (width) => {
    currentWidth.value = width;
  },
);

// The width while a drag is going on. It is only emitted when the drag ends.
const dragWidth = ref<number | null>(null);

// Whether the pointer is in the close zone during a drag, or beyond it.
let isInCloseZone = false;

// A panel dragged into the close zone keeps the dragged width while it slides out, and opens again
// with the width it had before the drag.
const closingWidth = ref<number | null>(null);

watch(
  () => context?.isOpen(),
  (isOpen) => {
    if (isOpen) closingWidth.value = null;
  },
);

const renderedWidth = ref<number | null>(null);

useResizeObserver(root, ([entry]) => {
  if (entry) {
    renderedWidth.value = Math.round(
      entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width,
    );
  }
});

const minimum = computed(() => props.minWidth ?? SMALLEST_WIDTH);

/** The largest width: `max-width`, and never more than half of the viewport. */
function maximum() {
  return Math.min(props.maxWidth ?? Infinity, Math.floor(window.innerWidth / 2));
}

function clamp(width: number) {
  return Math.round(Math.min(Math.max(width, minimum.value), maximum()));
}

const panelStyle = computed(() => {
  // A drawer takes the width the panel started with, not one the user resized it to on desktop.
  const width = isInDrawer.value
    ? startingWidth
    : dragWidth.value ?? closingWidth.value ?? currentWidth.value;

  return {
    "--mt-panel-width": width === undefined ? undefined : `${width}px`,
    "--mt-panel-min-width": props.minWidth === undefined ? undefined : `${props.minWidth}px`,
    "--mt-panel-max-width": props.maxWidth === undefined ? undefined : `${props.maxWidth}px`,
  };
});

// The kind of page the panel belongs to, such as `/orders/:id`, read while the page sets up.
const routeRecordPath = useRouteRecordPath();

// The width is only stored in the browser, so the key is known once the panel has mounted.
let storageKey: string | null = null;

function readStoredWidth() {
  if (!storageKey) return undefined;

  try {
    const width = Number(localStorage.getItem(storageKey));
    return width > 0 ? width : undefined;
  } catch {
    // The browser blocks the storage, so there is no remembered width.
    return undefined;
  }
}

function storeWidth(width: number | undefined) {
  if (!storageKey) return;

  try {
    if (width === undefined) localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, String(width));
  } catch {
    // The browser blocks the storage, so the width lasts until the page reloads.
  }
}

function commit(width: number) {
  currentWidth.value = width;
  storeWidth(width);
  emit("update:width", width);
}

// The remembered width only exists in the browser, so it applies once the panel has mounted.
onMounted(() => {
  // Without a router, the URL path names the page.
  if (context)
    storageKey = panelWidthStorageKey(context.place, routeRecordPath ?? location.pathname);
  if (!props.resizable) return;

  const stored = readStoredWidth();
  if (stored === undefined) return;

  const width = clamp(stored);
  currentWidth.value = width;
  if (width !== props.width) emit("update:width", width);
});

let dragStart: {
  x: number;
  width: number;
  /** The panel's outer edge, opposite the handle, which stays in place during the drag. */
  outerEdge: number;
  userSelect: string;
  cursor: string;
} | null = null;

function startDrag(event: PointerEvent) {
  if (event.button !== 0 || !root.value) return;

  event.preventDefault();
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

  // Text in the page would otherwise get selected while the pointer moves, and the cursor would
  // change back whenever the pointer runs ahead of the handle.
  const documentStyle = document.documentElement.style;
  const rect = root.value.getBoundingClientRect();
  dragStart = {
    x: event.clientX,
    width: rect.width,
    outerEdge: handleEdge.value === "end" ? rect.left : rect.right,
    userSelect: documentStyle.userSelect,
    cursor: documentStyle.cursor,
  };
  documentStyle.userSelect = "none";
  documentStyle.cursor = "col-resize";

  dragWidth.value = clamp(dragStart.width);
  stopResetting();
  context?.setResizing(true);
}

function drag(event: PointerEvent) {
  if (!dragStart) return;

  const distance = event.clientX - dragStart.x;
  const width = dragStart.width + (handleEdge.value === "end" ? distance : -distance);
  dragWidth.value = clamp(width);

  if (!canCloseByDrag.value) return;

  // Past its smallest width, the panel slides out with the pointer, as a preview of closing it.
  context?.slideOut(Math.max(minimum.value - width, 0));

  // The distance from the pointer to the outer edge, towards the inside of the panel. Beyond the
  // edge, up to and past the edge of the screen, it is negative.
  const towardsInside = handleEdge.value === "end" ? 1 : -1;
  isInCloseZone = (event.clientX - dragStart.outerEdge) * towardsInside <= CLOSE_ZONE_WIDTH;
}

/** Ends a drag. Releasing the pointer in the close zone closes the panel instead of resizing it. */
function endDrag(event?: PointerEvent) {
  if (!dragStart) return;

  document.documentElement.style.userSelect = dragStart.userSelect;
  document.documentElement.style.cursor = dragStart.cursor;
  dragStart = null;

  const width = dragWidth.value;
  const closes = event?.type === "pointerup" && isInCloseZone;
  dragWidth.value = null;
  isInCloseZone = false;
  context?.setResizing(false);
  context?.release(closes);

  if (closes) closingWidth.value = width;
  else if (width !== null) commit(width);
}

function resizeWithKeyboard(event: KeyboardEvent) {
  const width = currentWidth.value ?? renderedWidth.value ?? minimum.value;
  const grow = handleEdge.value === "end" ? "ArrowRight" : "ArrowLeft";
  const shrink = handleEdge.value === "end" ? "ArrowLeft" : "ArrowRight";

  let next: number;

  switch (event.key) {
    case grow:
      next = width + KEYBOARD_STEP;
      break;
    case shrink:
      next = width - KEYBOARD_STEP;
      break;
    case "Home":
      next = minimum.value;
      break;
    case "End":
      next = maximum();
      break;
    default:
      return;
  }

  event.preventDefault();
  commit(clamp(next));
}

// Going back to the starting width animates, unless the panel is as wide as its content (`auto`).
const isResetting = ref(false);
let resetTimeout: ReturnType<typeof setTimeout> | undefined;

function stopResetting() {
  clearTimeout(resetTimeout);
  isResetting.value = false;
}

/** Goes back to the width the panel started with: `width`, or the width of its content. */
function reset() {
  stopResetting();
  isResetting.value = true;
  resetTimeout = setTimeout(stopResetting, RESET_DURATION);

  currentWidth.value = startingWidth;
  storeWidth(undefined);
  if (startingWidth !== undefined) emit("update:width", startingWidth);
}

// A drag that is cut off, for example when the panel unmounts, mustn't keep the page unselectable.
onScopeDispose(() => {
  endDrag();
  stopResetting();
});

// Inside another component, the layout can't see the panel in its slot, so it reports its options.
if (context && !context.isFoundInSlot()) {
  const release = context.registerOptions(() => ({
    label: props.label,
    icon: props.icon,
    closable: props.closable,
    appearance: props.appearance,
  }));

  onScopeDispose(release);
  warnOnServer();
}
</script>

<style scoped>
.mt-panel {
  --mt-panel-handle-width: var(--scale-size-24);

  position: relative;
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  box-sizing: border-box;
  width: var(--mt-panel-width, auto);
  min-width: var(--mt-panel-min-width, 0);
  max-width: min(var(--mt-panel-max-width, 50vw), 50vw);
  min-height: 0;
  border-radius: inherit;
}

/* In a drawer, the panel is at most as wide as the drawer, which ends before the screen's edge. */
.mt-panel--drawer {
  max-width: min(var(--mt-panel-max-width, 100%), 100%);
}

.mt-panel--resetting {
  transition: width 250ms cubic-bezier(0.3, 0, 0, 1);
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
 * Centered on the nearest visible edge: the panel's own border, or the neighbor's next to it. The
 * layout sets the distance to it as `--mt-panel-edge-offset`.
 */
.mt-panel--handle-end > .mt-panel__handle {
  inset-inline-end: calc(var(--mt-panel-handle-width) / -2 - var(--mt-panel-edge-offset, 0px));
}

.mt-panel--handle-start > .mt-panel__handle {
  inset-inline-start: calc(var(--mt-panel-handle-width) / -2 - var(--mt-panel-edge-offset, 0px));
}

/*
 * While the pointer is on the handle, it is focused or dragged, a line in its middle marks the
 * panel's edge, fading out towards the top and the bottom.
 */
.mt-panel__handle::after {
  content: "";
  position: absolute;
  inset-block: 0;
  inset-inline-start: calc(50% - 1px);
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

/*
 * The cursor changes right away, while the line follows the pointer after a moment, so passing the
 * edge doesn't flash it. Keyboard focus and dragging show it at once.
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
