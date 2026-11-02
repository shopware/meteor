<template>
  <Transition
    name="mt-panel-region-slide"
    @enter="setSlideDistance"
    @before-leave="setSlideDistance"
    @after-leave="endSettling"
    @leave-cancelled="endSettling"
  >
    <div
      v-show="!hiddenInline"
      :id="isDrawer ? undefined : id"
      ref="inline"
      class="mt-panel-region"
      :class="[
        `mt-panel-region--${place}`,
        `mt-panel-region--at-${side}`,
        {
          'mt-panel-region--bordered': bordered,
          'mt-panel-region--with-panel': hasPanel,
          'mt-panel-region--settling': settleDuration !== null,
        },
      ]"
      :style="{
        '--mt-panel-slide-duration': `${PANEL_SLIDE_DURATION}ms`,
        '--mt-panel-slide-easing': PANEL_SLIDE_EASING,
        '--mt-panel-region-drag-offset': dragOffset ? `${dragOffset}px` : undefined,
        '--mt-panel-region-settle-duration':
          settleDuration === null ? undefined : `${settleDuration}ms`,
      }"
      :hidden="isDrawer || undefined"
    >
      <div ref="host" class="mt-panel-region__content">
        <slot />
      </div>

      <!--
        Its backdrop and panel are teleported to the body, so they show although this element is
        hidden.
      -->
      <mt-drawer
        v-if="isDrawer"
        :id="id"
        :open="isDrawerOpen"
        :side="side"
        :title="label"
        @update:open="(open: boolean) => (open ? controller.open(place) : controller.close(place))"
      >
        <div class="mt-panel-region__drawer-layout">
          <div
            class="mt-panel-region__drawer-chrome"
            :class="`mt-panel-region__drawer-chrome--${side}`"
          >
            <mt-button
              variant="tertiary"
              size="small"
              square
              :aria-label="t('close', { label })"
              @click="controller.close(place)"
            >
              <mt-icon name="regular-times-s" size="var(--scale-size-10)" decorative />
            </mt-button>
          </div>

          <div ref="drawerBody" class="mt-panel-region__drawer-body" />
        </div>
      </mt-drawer>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, provide, ref, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtDrawer from "@/components/_internal/mt-drawer/mt-drawer.vue";
import {
  PANEL_SLIDE_DURATION,
  PANEL_SLIDE_EASING,
  panelContextKey,
  type PanelPlace,
} from "@/components/mt-panel/panel-settings";
import type { PanelController } from "./panel-controller";

/**
 * One panel of the shell or of a page: an element next to the content, or a drawer. The slot
 * content renders once into a host element that moves between both, so its state survives layout
 * changes and the server markup matches the first client render (a disabled `<Teleport>` can't be
 * hydrated and enabled reliably).
 */
const props = defineProps<{
  place: PanelPlace;
  /** The layout the panel belongs to, which owns its open state. */
  controller: PanelController;
  /** The edge the panel sits on, and its drawer slides in from. */
  side: "start" | "end";
  /** The id of the panel next to the content and of its drawer, which its trigger points to. */
  id: string;
  /** The accessible name of the drawer. */
  label: string;
  /**
   * Hides the panel next to the content, because it is closed or a view hides it. The panel slides
   * when it changes, but not when the layout switches to drawers, so it doesn't depend on that.
   */
  hiddenInline?: boolean;
  /** Sets the panel off from the content with a border, which the layout draws. */
  bordered?: boolean;
  /** Whether the slot holds an `mt-panel`, which scrolls its content itself. */
  hasPanel?: boolean;
}>();

defineSlots<{
  default?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: { close: "Close {label}" },
    de: { close: "{label} schließen" },
  },
});

/** The shortest settle after a drag, so a panel that is nearly there doesn't snap. */
const SHORTEST_SETTLE_DURATION = 150;

const inline = useTemplateRef<HTMLElement>("inline");
const host = useTemplateRef<HTMLElement>("host");
const drawerBody = useTemplateRef<HTMLElement>("drawerBody");

const isDrawer = computed(() => props.controller.isDrawer.value);
const isDrawerOpen = computed(() => isDrawer.value && props.controller.isOpen(props.place));

// How far a drag past the panel's smallest width has pushed it out over its outer edge, in pixels.
const dragOffset = ref(0);
// While set, the panel settles after such a drag, from where the pointer left it.
const settleDuration = ref<number | null>(null);
let settleTimeout: ReturnType<typeof setTimeout> | undefined;

/** Whether the panel holds the focus: its content, or its drawer, which takes the focus when it opens. */
function containsFocus() {
  const active = document.activeElement;
  if (!active) return false;

  return Boolean(
    host.value?.contains(active) || document.getElementById(props.id)?.contains(active),
  );
}

/** Moves the slot content into the drawer, and back next to the content. */
function placeContent() {
  const target = isDrawer.value && drawerBody.value ? drawerBody.value : inline.value;

  if (host.value && target && host.value.parentElement !== target) target.append(host.value);
}

/** The panel slides as far as it is wide, and over the gap next to it. */
function slideDistance(element: Element) {
  const gap = parseFloat(getComputedStyle(element.parentElement ?? element).columnGap) || 0;

  return element.getBoundingClientRect().width + gap;
}

function setSlideDistance(element: Element) {
  (element as HTMLElement).style.setProperty(
    "--mt-panel-region-slide",
    `${slideDistance(element)}px`,
  );
}

function slideOut(offset: number) {
  endSettling();
  dragOffset.value = offset > 0 && inline.value ? Math.min(offset, slideDistance(inline.value)) : 0;
}

/** The settle is shorter the less is left of the slide. */
function release(close: boolean) {
  const offset = dragOffset.value;
  if (!close && offset === 0) return;

  const distance = inline.value ? slideDistance(inline.value) : offset;
  const remaining = distance > 0 ? (close ? distance - offset : offset) / distance : 0;
  const duration = Math.max(Math.round(PANEL_SLIDE_DURATION * remaining), SHORTEST_SETTLE_DURATION);

  clearTimeout(settleTimeout);
  settleDuration.value = duration;
  settleTimeout = setTimeout(() => {
    settleDuration.value = null;
  }, duration);

  if (!close) {
    dragOffset.value = 0;
    return;
  }

  // A closing panel leaves from its current offset, which is cleared once it has left.
  props.controller.close(props.place);

  // The layout may keep the panel open, for example while a view hides it.
  nextTick(() => {
    if (!props.hiddenInline) dragOffset.value = 0;
  });
}

function endSettling() {
  clearTimeout(settleTimeout);
  settleDuration.value = null;
  dragOffset.value = 0;
}

provide(panelContextKey, {
  place: props.place,
  isDrawer,
  label: () => props.label,
  layoutWidth: () => inline.value?.parentElement?.clientWidth || window.innerWidth,
  registerOptions: (options) => props.controller.registerPanelOptions(props.place, options),
  setResizing: (resizing) => props.controller.setResizing(resizing),
  isOpen: () => props.controller.isOpen(props.place),
  slideOut,
  release,
});

// Moving the content between the layout and the drawer would leave the focus nowhere. Sync, before
// the content moves.
watch(
  isDrawer,
  () => {
    if (containsFocus()) nextTick(props.controller.focusContent);
  },
  { flush: "sync" },
);

// Back next to the content before the drawer unmounts, so the content isn't removed with it.
watch(
  isDrawer,
  (drawer) => {
    if (!drawer) placeContent();
  },
  { flush: "sync" },
);

watch([isDrawer, drawerBody], placeContent, { flush: "post" });

watch(
  () => props.hiddenInline,
  (hidden) => {
    if (hidden && !isDrawer.value && containsFocus()) nextTick(props.controller.focusContent);
  },
);

onBeforeUnmount(() => {
  clearTimeout(settleTimeout);

  const holdsFocus = containsFocus();
  if (isDrawerOpen.value) props.controller.close(props.place);
  if (holdsFocus) props.controller.focusContent();
});
</script>

<style scoped>
.mt-panel-region {
  display: flex;
  flex-direction: column;
  flex: none;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
}

.mt-panel-region[hidden] {
  display: none;
}

/* A drag past the panel's smallest width pushes it out over its outer edge, with the pointer. */
.mt-panel-region--at-start {
  margin-inline-start: calc(var(--mt-panel-region-drag-offset, 0px) * -1);
}

.mt-panel-region--at-end {
  margin-inline-end: calc(var(--mt-panel-region-drag-offset, 0px) * -1);
}

/*
 * The panel slides out over its outer edge while the content grows into its place. The transition
 * starts with the `-to` classes, so measuring the distance at the start doesn't animate.
 */
.mt-panel-region-slide-enter-to,
.mt-panel-region-slide-leave-to {
  transition: margin var(--mt-panel-slide-duration) var(--mt-panel-slide-easing);
}

.mt-panel-region--at-start.mt-panel-region-slide-enter-from,
.mt-panel-region--at-start.mt-panel-region-slide-leave-to {
  margin-inline-start: calc(var(--mt-panel-region-slide, 0px) * -1);
}

.mt-panel-region--at-end.mt-panel-region-slide-enter-from,
.mt-panel-region--at-end.mt-panel-region-slide-leave-to {
  margin-inline-end: calc(var(--mt-panel-region-slide, 0px) * -1);
}

/* After a drag, the panel is already moving, so it decelerates from the start. */
.mt-panel-region--settling,
.mt-panel-region--settling.mt-panel-region-slide-leave-to {
  transition: margin var(--mt-panel-region-settle-duration) cubic-bezier(0, 0, 0, 1);
}

@media (prefers-reduced-motion: reduce) {
  .mt-panel-region-slide-enter-to,
  .mt-panel-region-slide-leave-to,
  .mt-panel-region--settling,
  .mt-panel-region--settling.mt-panel-region-slide-leave-to {
    transition: none;
  }
}

.mt-panel-region__content {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
}

/*
 * An mt-panel scrolls its content itself, so its resize handle can reach over the panel's edge. The
 * region around it then neither scrolls nor clips, and passes its height and corners on to it.
 */
.mt-panel-region--with-panel {
  overflow: visible;
}

.mt-panel-region--with-panel > .mt-panel-region__content {
  flex: 1 1 0;
  min-height: 0;
  border-radius: inherit;
}

.mt-panel-region__drawer-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mt-panel-region__drawer-chrome {
  display: flex;
  align-items: center;
  min-height: var(--scale-size-48);
  padding: var(--scale-size-8);
}

.mt-panel-region__drawer-chrome--end {
  justify-content: flex-end;
}

.mt-panel-region__drawer-body {
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
}

@media print {
  .mt-panel-region {
    display: none;
  }
}
</style>
