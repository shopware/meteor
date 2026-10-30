<template>
  <div
    :id="isMobile ? undefined : id"
    ref="inline"
    class="mt-app__region"
    :class="[
      `mt-app__region--${panel}`,
      { 'mt-app__region--bordered': bordered, 'mt-app__region--with-panel': hasPanel },
    ]"
    :hidden="hidden || isMobile || undefined"
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
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, provide, useTemplateRef, watch } from "vue";
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
  /** Hides the panel in the desktop layout, because it is closed or a view hides it. */
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

// An `MtPanel` in the slot learns where it is and talks to its layout through this.
provide(panelContextKey, {
  place: props.panel,
  isMobile,
  label: () => props.controller.panelLabel(props.panel),
  isFoundInSlot: () => props.controller.hasPanelInSlot(props.panel),
  registerOptions: (options) => props.controller.registerPanelOptions(props.panel, options),
  setResizing: (resizing) => props.controller.setResizing(resizing),
});

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
