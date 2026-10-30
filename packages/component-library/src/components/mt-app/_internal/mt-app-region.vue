<template>
  <Transition
    name="mt-app-region-slide"
    @enter="setSlideDistance"
    @before-leave="setSlideDistance"
    @after-leave="endSettling"
    @leave-cancelled="endSettling"
  >
    <div
      v-show="!hidden"
      :id="isMobile ? undefined : id"
      ref="inline"
      class="mt-app__region"
      :class="[
        `mt-app__region--${panel}`,
        `mt-app__region--at-${side}`,
        {
          'mt-app__region--bordered': bordered,
          'mt-app__region--with-panel': hasPanel,
          'mt-app__region--settling': settleDuration !== null,
        },
      ]"
      :style="{
        '--mt-app-region-drag-offset': dragOffset ? `${dragOffset}px` : undefined,
        '--mt-app-region-settle-duration':
          settleDuration === null ? undefined : `${settleDuration}ms`,
      }"
      :hidden="isMobile || undefined"
    >
      <div ref="host" class="mt-app__region-content">
        <slot />
      </div>

      <!--
        Inside the panel element, so the region has a single root that the layouts can style. The
        drawer renders no element here: its backdrop and panel are teleported to the body, so they
        show although this element is hidden in the mobile layout.
      -->
      <mt-drawer-root
        v-if="isMobile"
        :open="isOpen"
        @update:open="(open: boolean) => (open ? controller.open(panel) : controller.close(panel))"
      >
        <mt-drawer-content
          :id="id"
          :side="side"
          variant="floating"
          :title="label"
          class="mt-app__drawer"
          hide-header
          inset
          keep-mounted
        >
          <div class="mt-app__drawer-layout">
            <div class="mt-app__drawer-chrome" :class="`mt-app__drawer-chrome--${side}`">
              <mt-drawer-close
                :as="MtButton"
                variant="tertiary"
                size="small"
                square
                :aria-label="closeLabel"
              >
                <mt-icon name="regular-times-s" size="var(--scale-size-10)" decorative />
              </mt-drawer-close>
            </div>

            <div ref="drawerBody" class="mt-app__drawer-body" />
          </div>
        </mt-drawer-content>
      </mt-drawer-root>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref, useTemplateRef, watch } from "vue";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtDrawerRoot from "@/components/_internal/mt-drawer/mt-drawer-root.vue";
import MtDrawerContent from "@/components/_internal/mt-drawer/mt-drawer-content.vue";
import MtDrawerClose from "@/components/_internal/mt-drawer/mt-drawer-close.vue";
import { panelContextKey, type PanelPlace } from "@/components/mt-panel/panel-settings";
import type { PanelController } from "../composables/useAppPanels";

/**
 * One panel of the shell or of a page: an element next to the content in the desktop layout and a
 * drawer in the mobile layout. It adds no landmark, so the slot content brings its own, such as
 * `mt-nav` or an `<aside>`. The slot content renders once into a host element that moves
 * between both places, so its state survives layout changes and the server markup matches the
 * first client render (a disabled `<Teleport>` can't be hydrated and enabled reliably).
 */
const props = defineProps<{
  panel: PanelPlace;
  /** The layout the panel belongs to, which owns its open state. */
  controller: PanelController;
  /** The edge the drawer slides in from. */
  side: "start" | "end";
  /**
   * The id of the panel in the desktop layout and of its drawer in the mobile layout, which the
   * trigger points to with `aria-controls`.
   */
  id: string;
  /** The accessible name of the drawer. */
  label: string;
  /** The accessible name of the drawer's close button. */
  closeLabel: string;
  /**
   * Hides the panel in the desktop layout, because it is closed or a view hides it. The panel
   * slides out and in when it changes. It doesn't depend on the layout, so switching to the
   * drawers and back doesn't slide.
   */
  hidden?: boolean;
  /** Sets the panel off from the content with a border, which the layout draws. */
  bordered?: boolean;
  /** Whether the slot holds an `mt-panel`, which scrolls its content itself. */
  hasPanel?: boolean;
}>();

defineSlots<{
  default?(): unknown;
}>();

const inline = useTemplateRef<HTMLElement>("inline");
const host = useTemplateRef<HTMLElement>("host");
const drawerBody = useTemplateRef<HTMLElement>("drawerBody");

const isMobile = computed(() => props.controller.isMobile.value);
const isOpen = computed(() => isMobile.value && props.controller.isOpen(props.panel));

/** The length of the slide when the panel opens or closes, in milliseconds. */
const SLIDE_DURATION = 400;
/** The shortest settle after a drag, so a panel that is nearly there doesn't snap. */
const SHORTEST_SETTLE_DURATION = 150;

// How far a drag past the panel's smallest width has pushed it out over its outer edge, in pixels.
const dragOffset = ref(0);

// While set, the panel settles after such a drag, from where the pointer left it.
const settleDuration = ref<number | null>(null);
let settleTimeout: ReturnType<typeof setTimeout> | undefined;

// An `MtPanel` in the slot learns where it is and talks to its layout through this.
provide(panelContextKey, {
  place: props.panel,
  isMobile,
  label: () => props.controller.panelLabel(props.panel),
  isFoundInSlot: () => props.controller.hasPanelInSlot(props.panel),
  registerOptions: (options) => props.controller.registerPanelOptions(props.panel, options),
  setResizing: (resizing) => props.controller.setResizing(resizing),
  isOpen: () => props.controller.isOpen(props.panel),
  slideOut,
  release,
});

/**
 * The panel slides as far as it is wide, and over the gap next to it, so the content takes its
 * whole place.
 */
function slideDistance(element: Element) {
  const gap = parseFloat(getComputedStyle(element.parentElement ?? element).columnGap) || 0;

  return element.getBoundingClientRect().width + gap;
}

/** Set when a slide starts, while the panel is shown. */
function setSlideDistance(element: Element) {
  (element as HTMLElement).style.setProperty(
    "--mt-app-region-slide",
    `${slideDistance(element)}px`,
  );
}

/** Pushes the panel out over its outer edge during a drag, following the pointer. */
function slideOut(offset: number) {
  endSettling();
  dragOffset.value = offset > 0 && inline.value ? Math.min(offset, slideDistance(inline.value)) : 0;
}

/**
 * Ends a drag that pushed the panel out: closes the panel from where it is, or slides it back. As
 * the panel is already moving, the settle decelerates from the start, and it is shorter the less
 * is left of the slide.
 */
function release(close: boolean) {
  const offset = dragOffset.value;
  if (!close && offset === 0) return;

  const distance = inline.value ? slideDistance(inline.value) : offset;
  const remaining = distance > 0 ? (close ? distance - offset : offset) / distance : 0;
  const duration = Math.max(Math.round(SLIDE_DURATION * remaining), SHORTEST_SETTLE_DURATION);

  clearTimeout(settleTimeout);
  settleDuration.value = duration;
  settleTimeout = setTimeout(() => {
    settleDuration.value = null;
  }, duration);

  // A closing panel leaves from its current offset, which is cleared once it has left.
  if (close) props.controller.close(props.panel);
  else dragOffset.value = 0;
}

function endSettling() {
  clearTimeout(settleTimeout);
  settleDuration.value = null;
  dragOffset.value = 0;
}

/** Moves the slot content into the drawer in the mobile layout, and back inline otherwise. */
function placeContent() {
  const target = isMobile.value && drawerBody.value ? drawerBody.value : inline.value;

  if (host.value && target && host.value.parentElement !== target) target.append(host.value);
}

// Back inline before the drawer unmounts, so the content isn't removed with it.
watch(
  isMobile,
  (mobile) => {
    if (!mobile) placeContent();
  },
  { flush: "sync" },
);

watch([isMobile, drawerBody], placeContent, { flush: "post" });

// A drawer that disappears while it is open would leave the focus nowhere.
onBeforeUnmount(() => {
  clearTimeout(settleTimeout);
  if (!isOpen.value) return;

  props.controller.close(props.panel);
  props.controller.focusContent();
});

defineExpose({
  /** Whether the focused element is inside this panel, in either layout. */
  containsFocus: () => {
    const active = document.activeElement;

    return Boolean(active && host.value?.contains(active));
  },
});
</script>

<style scoped>
.mt-app__region {
  display: flex;
  flex-direction: column;
  flex: none;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
}

.mt-app__region[hidden] {
  display: none;
}

/* A drag past the panel's smallest width pushes it out over its outer edge, with the pointer. */
.mt-app__region--at-start {
  margin-inline-start: calc(var(--mt-app-region-drag-offset, 0px) * -1);
}

.mt-app__region--at-end {
  margin-inline-end: calc(var(--mt-app-region-drag-offset, 0px) * -1);
}

/*
 * Opening and closing next to the content, the panel slides in and out over its outer edge while
 * the content grows into its place. The transition starts with the `-to` classes, so measuring the
 * distance at the start doesn't animate.
 */
.mt-app-region-slide-enter-to,
.mt-app-region-slide-leave-to {
  transition: margin 400ms cubic-bezier(0.3, 0, 0, 1);
}

.mt-app__region--at-start.mt-app-region-slide-enter-from,
.mt-app__region--at-start.mt-app-region-slide-leave-to {
  margin-inline-start: calc(var(--mt-app-region-slide, 0px) * -1);
}

.mt-app__region--at-end.mt-app-region-slide-enter-from,
.mt-app__region--at-end.mt-app-region-slide-leave-to {
  margin-inline-end: calc(var(--mt-app-region-slide, 0px) * -1);
}

/*
 * After such a drag, the panel settles from where the pointer left it. It is already moving, so it
 * decelerates from the start.
 */
.mt-app__region--settling,
.mt-app__region--settling.mt-app-region-slide-leave-to {
  transition: margin var(--mt-app-region-settle-duration) cubic-bezier(0, 0, 0, 1);
}

@media (prefers-reduced-motion: reduce) {
  .mt-app-region-slide-enter-to,
  .mt-app-region-slide-leave-to,
  .mt-app__region--settling,
  .mt-app__region--settling.mt-app-region-slide-leave-to {
    transition: none;
  }
}

.mt-app__region-content {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
}

.mt-app__drawer-layout {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.mt-app__drawer-body {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
}

.mt-app__drawer-chrome {
  display: flex;
  align-items: center;
  min-height: var(--scale-size-48);
  padding: var(--scale-size-8);
}

.mt-app__drawer-chrome--end {
  justify-content: flex-end;
}

/*
 * An mt-panel scrolls its content itself, so its resize handle can reach over the panel's edge. The
 * region around it then neither scrolls nor clips, and passes its height and corners on to it.
 */
.mt-app__region--with-panel {
  overflow: visible;
}

.mt-app__region--with-panel > .mt-app__region-content {
  flex: 1 1 0;
  min-height: 0;
  border-radius: inherit;
}

@media print {
  .mt-app__region {
    display: none;
  }
}
</style>
