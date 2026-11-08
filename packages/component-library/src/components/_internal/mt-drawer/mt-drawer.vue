<template>
  <DrawerRoot :open="open" :modal="false" :swipe-direction="swipeDirection" @update:open="setOpen">
    <DrawerPortal>
      <Transition name="mt-drawer-backdrop" appear>
        <div
          v-show="open"
          ref="backdrop"
          class="mt-drawer__backdrop"
          data-testid="mt-drawer-backdrop"
          aria-hidden="true"
          @click="setOpen(false)"
        />
      </Transition>

      <Transition name="mt-drawer-slide" appear>
        <DrawerContent
          v-show="open"
          ref="panel"
          force-mount
          :initial-focus="false"
          :final-focus="false"
          class="mt-drawer"
          :class="`mt-drawer--${side}`"
          tabindex="-1"
          aria-modal="true"
          :inert="!open || undefined"
          v-bind="{ 'aria-describedby': undefined, ...$attrs }"
          @escape-key-down="preventDismiss"
          @interact-outside="preventDismiss"
        >
          <DrawerTitle class="visually-hidden">{{ title }}</DrawerTitle>

          <div class="mt-drawer__body">
            <slot />
          </div>
        </DrawerContent>
      </Transition>
    </DrawerPortal>
  </DrawerRoot>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, useTemplateRef, watch } from "vue";
import { DrawerContent, DrawerPortal, DrawerRoot, DrawerTitle } from "reka-ui";
import { OVERLAY_ATTRIBUTE, useModalLayer } from "./composables/useModalLayer";

/**
 * A drawer that slides in from the start or the end of the viewport above a backdrop, makes the
 * page behind it inert and returns the focus when it closes. Its content stays mounted while it is
 * closed. Builds on reka-ui's Drawer, which is still an alpha primitive.
 */
const props = defineProps<{
  open: boolean;
  /** The edge the drawer slides in from. */
  side: "start" | "end";
  /** The accessible name of the dialog. */
  title: string;
}>();

const emit = defineEmits<{
  "update:open": [open: boolean];
}>();

defineOptions({ inheritAttrs: false });

defineSlots<{
  default?(): unknown;
}>();

const panel = useTemplateRef<{ $el: HTMLElement }>("panel");
const backdrop = useTemplateRef<HTMLElement>("backdrop");
const panelElement = computed(() => panel.value?.$el ?? null);

const isLayerActive = ref(false);
const isRtl = shallowRef(false);

const swipeDirection = computed(() =>
  (props.side === "start") !== isRtl.value ? "left" : "right",
);

function setOpen(open: boolean) {
  if (open !== props.open) emit("update:open", open);
}

/** Reka keeps the position of a swipe that closed the drawer, so it would open again offset. */
function resetSwipe() {
  const element = panelElement.value;
  if (!element) return;

  element.style.setProperty("--drawer-swipe-movement-x", "0px");
  element.style.setProperty("--drawer-swipe-movement-y", "0px");
  element.removeAttribute("data-swipe-dismissed");
}

// A closed drawer stays mounted and is still a reka layer, so it must not touch events of the page.
function preventDismiss(event: Event) {
  if (props.open) event.preventDefault();
}

/** A closed overlay container, such as a date picker's menu wrapper, has nothing to block. */
function isEmptyContainer(element: Element) {
  return (
    element.tagName === "DIV" && element.childElementCount === 0 && !element.textContent?.trim()
  );
}

function isInertTarget(element: Element) {
  return (
    !(panelElement.value && element.contains(panelElement.value)) &&
    !(backdrop.value && element.contains(backdrop.value)) &&
    !element.hasAttribute(OVERLAY_ATTRIBUTE) &&
    // Hidden overlays, such as a tooltip of the drawer's content, stay usable once they show.
    getComputedStyle(element).display !== "none" &&
    !isEmptyContainer(element)
  );
}

watch(
  () => props.open,
  (open) => {
    if (!open) {
      isLayerActive.value = false;
      return;
    }

    isRtl.value = getComputedStyle(document.body).direction === "rtl";
    resetSwipe();

    // `v-show` reveals the panel only after the post-flush watchers, and focusing an element that
    // is still `display: none` does nothing.
    nextTick(() => {
      isLayerActive.value = props.open;
    });
  },
  { immediate: true, flush: "sync" },
);

useModalLayer({
  panel: panelElement,
  active: computed(() => isLayerActive.value && panelElement.value !== null),
  onEscape: () => setOpen(false),
  inertTargets: () => Array.from(document.body.children).filter(isInertTarget),
});
</script>

<style scoped>
.mt-drawer {
  --mt-drawer-direction: 1;

  position: fixed;
  z-index: 900;
  inset-block: var(--scale-size-8);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  max-width: calc(100vw - var(--scale-size-48));
  overflow: hidden;
  background-color: var(--color-elevation-surface-raised);
  color: var(--color-text-primary-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-card);
  outline: none;
  transform: translate(var(--drawer-swipe-movement-x, 0px), var(--drawer-swipe-movement-y, 0px));
  transition: transform 200ms cubic-bezier(0.05, 0.7, 0.1, 1);
}

[dir="rtl"] .mt-drawer {
  --mt-drawer-direction: -1;
}

.mt-drawer[data-swiping] {
  transition: none;
}

.mt-drawer--start {
  inset-inline-start: var(--scale-size-8);
}

.mt-drawer--end {
  inset-inline-end: var(--scale-size-8);
}

.mt-drawer-slide-leave-active {
  transition: transform 200ms cubic-bezier(0.3, 0, 0.8, 0.15);
}

.mt-drawer--start.mt-drawer-slide-enter-from,
.mt-drawer--start.mt-drawer-slide-leave-to {
  transform: translateX(calc((-100% - var(--scale-size-8)) * var(--mt-drawer-direction)));
}

.mt-drawer--end.mt-drawer-slide-enter-from,
.mt-drawer--end.mt-drawer-slide-leave-to {
  transform: translateX(calc((100% + var(--scale-size-8)) * var(--mt-drawer-direction)));
}

.mt-drawer__backdrop {
  position: fixed;
  inset: 0;
  z-index: 900;
  background-color: var(--color-elevation-backdrop-default);
}

.mt-drawer-backdrop-enter-active {
  transition: opacity 200ms cubic-bezier(0.05, 0.7, 0.1, 1);
}

.mt-drawer-backdrop-leave-active {
  transition: opacity 200ms cubic-bezier(0.3, 0, 0.8, 0.15);
}

.mt-drawer-backdrop-enter-from,
.mt-drawer-backdrop-leave-to {
  opacity: 0;
}

.mt-drawer__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
}

@media (prefers-reduced-motion: reduce) {
  .mt-drawer,
  .mt-drawer-slide-leave-active,
  .mt-drawer-backdrop-enter-active,
  .mt-drawer-backdrop-leave-active {
    transition: none;
  }
}

@media print {
  .mt-drawer,
  .mt-drawer__backdrop {
    display: none;
  }
}
</style>
