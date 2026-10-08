<template>
  <component
    :is="panel === 'navigation' ? 'nav' : 'aside'"
    ref="inline"
    class="mt-app__region"
    :class="`mt-app__region--${panel}`"
    :aria-label="label"
    :hidden="hidden || isMobile || undefined"
  >
    <div ref="host" class="mt-app__region-content">
      <slot />
    </div>
  </component>

  <mt-drawer-root
    v-if="isMobile"
    :open="isOpen"
    @update:open="(open: boolean) => (open ? app.open(panel) : app.close(panel))"
  >
    <mt-drawer-content
      :id="id"
      :side="panel === 'navigation' ? 'start' : 'end'"
      variant="floating"
      :title="label"
      class="mt-app__drawer"
      hide-header
      inset
      keep-mounted
    >
      <div class="mt-app__drawer-layout">
        <div class="mt-app__drawer-chrome" :class="`mt-app__drawer-chrome--${panel}`">
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
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, useTemplateRef, watch } from "vue";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtDrawerRoot from "@/components/_internal/mt-drawer/mt-drawer-root.vue";
import MtDrawerContent from "@/components/_internal/mt-drawer/mt-drawer-content.vue";
import MtDrawerClose from "@/components/_internal/mt-drawer/mt-drawer-close.vue";
import { useAppContext } from "../composables/useAppContext";
import type { MtAppPanel } from "../composables/useMtApp";

/**
 * One panel of the shell: a `navigation` or `complementary` landmark in the desktop layout and a
 * drawer in the mobile layout. The slot content renders once into a host element that moves
 * between both places, so its state survives layout changes and the server markup matches the
 * first client render (a disabled `<Teleport>` can't be hydrated and enabled reliably).
 */
const props = defineProps<{
  panel: MtAppPanel;
  /** The id of the drawer, which the header trigger points to with `aria-controls`. */
  id: string;
  /** The accessible name of the landmark and the drawer. */
  label: string;
  /** The accessible name of the drawer's close button. */
  closeLabel: string;
  /** Hides the panel in the desktop layout, because it is closed or a view hides it. */
  hidden?: boolean;
}>();

defineSlots<{
  default?(): unknown;
}>();

const app = useAppContext("mt-app-region");
const inline = useTemplateRef<HTMLElement>("inline");
const host = useTemplateRef<HTMLElement>("host");
const drawerBody = useTemplateRef<HTMLElement>("drawerBody");

const isMobile = computed(() => app.isMobile.value);
const isOpen = computed(() => isMobile.value && app.isOpen(props.panel));

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

  app.close(props.panel);
  app.focusContent();
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

.mt-app__drawer-chrome--sidebar {
  justify-content: flex-end;
}

@media print {
  .mt-app__region {
    display: none;
  }
}
</style>
