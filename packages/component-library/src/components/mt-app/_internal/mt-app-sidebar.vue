<template>
  <div
    :id="id"
    ref="panel"
    class="mt-app__sidebar"
    :class="`mt-app__sidebar--${side}`"
    :data-mode="isMobile ? 'drawer' : 'inline'"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-motion="motion ? undefined : 'off'"
    :role="isMobile ? 'dialog' : 'complementary'"
    :aria-modal="isMobile ? 'true' : undefined"
    :aria-label="label"
    :tabindex="isMobile ? -1 : undefined"
    :inert="(isMobile && !isOpen) || undefined"
    @click="onClick"
  >
    <div v-if="isMobile" class="mt-app__sidebar-chrome">
      <mt-button
        variant="tertiary"
        size="small"
        square
        :aria-label="closeLabel"
        @click="layout.close()"
      >
        <mt-icon name="regular-times-s" size="var(--scale-size-10)" decorative />
      </mt-button>
    </div>

    <div class="mt-app__sidebar-body">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from "vue";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import { useAppLayout, type MtAppSide } from "../composables/useAppLayout";
import { isNavigationClick } from "../composables/useAppDrawer";
import { useModalLayer } from "../composables/useModalLayer";

/**
 * One sidebar region of the shell. The same element is an inline
 * `complementary` landmark in the desktop layout and an off-canvas modal
 * drawer in the mobile layout, so the slotted content is never re-mounted
 * when the layout changes.
 */
const props = defineProps<{
  side: MtAppSide;
  /** the element id the header trigger points to via `aria-controls` */
  id: string;
  /** the accessible name of the region and drawer */
  label: string;
  /** the accessible name of the drawer's close button */
  closeLabel: string;
}>();

defineSlots<{
  default?(): unknown;
}>();

const layout = useAppLayout("mt-app-sidebar");
const panelElement = useTemplateRef<HTMLElement>("panel");

const isMobile = computed(() => layout.isMobile.value);
const isOpen = computed(() => isMobile.value && layout.activeSide.value === props.side);

// A layout switch must not animate: entering the drawer mode jumps straight to the closed
// position instead of sliding out of view. Transitions are off for the render that switches
// the mode, and come back once the new position has been applied.
const motion = ref(true);

watch(isMobile, () => {
  motion.value = false;
});

watch(
  isMobile,
  () => {
    // commits the switched styles while transitions are still off
    void panelElement.value?.offsetWidth;
    motion.value = true;
  },
  { flush: "post" },
);

// registering in setup keeps the drawer state aware of this side before the first render
const unregister = layout.registerSidebar(props.side);
onBeforeUnmount(unregister);

useModalLayer({
  target: panelElement,
  active: isOpen,
  onEscape: () => layout.close(),
  returnFocusTo: () => layout.focusReturnTarget(props.side),
});

function onClick(event: MouseEvent) {
  if (!isOpen.value || !layout.closeOnNavigate.value || !panelElement.value) return;

  if (isNavigationClick(event, panelElement.value)) layout.close();
}
</script>

<style scoped>
.mt-app__sidebar {
  display: flex;
  flex-direction: column;
  flex: none;
  min-width: 0;
  min-height: 0;
  /* the panel receives programmatic focus when it opens; no ring for that */
  outline: none;
}

.mt-app__sidebar-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
}

.mt-app__sidebar-chrome {
  display: flex;
  flex: none;
  align-items: center;
  min-height: var(--scale-size-48);
  padding: var(--scale-size-8);
}

/* the close button sits where the header trigger was */
.mt-app__sidebar--end .mt-app__sidebar-chrome {
  justify-content: flex-end;
}

.mt-app__sidebar[data-mode="drawer"] {
  position: fixed;
  inset-block: 0;
  z-index: 900;
  min-width: min(var(--scale-size-256), calc(100% - var(--scale-size-48)));
  /* a strip of the backdrop always stays tappable */
  max-width: calc(100% - var(--scale-size-48));
  background-color: var(--color-elevation-surface-raised);
  /* the open panel must not create a containing block for fixed descendants */
  transform: none;
  visibility: visible;
  transition: transform 200ms cubic-bezier(0.05, 0.7, 0.1, 1);
}

.mt-app__sidebar--start[data-mode="drawer"] {
  inset-inline-start: 0;
  border-inline-end: 1px solid var(--color-border-secondary-default);
}

.mt-app__sidebar--end[data-mode="drawer"] {
  inset-inline-end: 0;
  border-inline-start: 1px solid var(--color-border-secondary-default);
}

/* the panel becomes unreachable exactly when the slide-out ends */
.mt-app__sidebar[data-mode="drawer"][data-state="closed"] {
  visibility: hidden;
  pointer-events: none;
  transition:
    transform 200ms cubic-bezier(0.3, 0, 0.8, 0.15),
    visibility 0s linear 200ms;
}

.mt-app__sidebar--start[data-mode="drawer"][data-state="closed"] {
  transform: translateX(-100%);
}

.mt-app__sidebar--end[data-mode="drawer"][data-state="closed"] {
  transform: translateX(100%);
}

@media (prefers-reduced-motion: reduce) {
  .mt-app__sidebar[data-mode="drawer"] {
    transition: none;
  }
}

/* set for the one render that switches between inline and drawer mode */
.mt-app__sidebar[data-mode][data-state][data-motion="off"] {
  transition: none;
}
</style>
