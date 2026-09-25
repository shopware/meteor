<template>
  <div
    ref="inline"
    class="mt-app__sidebar"
    :class="`mt-app__sidebar--${side}`"
    :role="isMobile ? undefined : 'complementary'"
    :aria-label="isMobile ? undefined : label"
    :hidden="hidden || isMobile || undefined"
  >
    <div ref="host" class="mt-app__sidebar-content">
      <slot />
    </div>
  </div>

  <mt-drawer-root
    v-if="isMobile"
    :open="isOpen"
    @update:open="(open: boolean) => (open ? layout.open(side) : layout.close())"
  >
    <mt-drawer-content
      :id="id"
      :side="side"
      :variant="drawerVariant"
      :title="label"
      class="mt-app__drawer"
      hide-header
      inset
      keep-mounted
    >
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

      <div ref="drawerBody" />
    </mt-drawer-content>
  </mt-drawer-root>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, useTemplateRef, watch } from "vue";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtDrawerRoot from "@/components/mt-drawer/mt-drawer-root.vue";
import MtDrawerContent from "@/components/mt-drawer/mt-drawer-content.vue";
import MtDrawerClose from "@/components/mt-drawer/mt-drawer-close.vue";
import { useAppLayout, type MtAppSide } from "../composables/useAppLayout";

/**
 * One sidebar region of the shell: an inline `complementary` landmark in the desktop
 * layout and an `mt-drawer` in the mobile layout. The slotted content renders once into
 * a host element that is moved between both places (a disabled `<Teleport>` cannot be
 * hydrated and enabled reliably), so its state survives layout changes and server
 * markup matches the first client render.
 */
const props = defineProps<{
  side: MtAppSide;
  /** the id of the drawer the header trigger points to via `aria-controls` */
  id: string;
  /** the accessible name of the region and drawer */
  label: string;
  /** the accessible name of the drawer's close button */
  closeLabel: string;
  /** hides the region while a view hides it */
  hidden?: boolean;
  /** the look of the drawer in the mobile layout */
  drawerVariant: "default" | "floating";
}>();

defineSlots<{
  default?(): unknown;
}>();

const layout = useAppLayout("mt-app-sidebar");
const inline = useTemplateRef<HTMLElement>("inline");
const host = useTemplateRef<HTMLElement>("host");
const drawerBody = useTemplateRef<HTMLElement>("drawerBody");

const isMobile = computed(() => layout.isMobile.value);
const isOpen = computed(() => isMobile.value && layout.activeSide.value === props.side);

function placeContent() {
  const target = isMobile.value && drawerBody.value ? drawerBody.value : inline.value;

  if (host.value && target && host.value.parentElement !== target) target.append(host.value);
}

watch(
  isMobile,
  (mobile) => {
    if (!mobile) placeContent();
  },
  { flush: "sync" },
);

watch([isMobile, drawerBody], placeContent, { flush: "post" });

const unregister = layout.registerSidebar(props.side);
onBeforeUnmount(unregister);

defineExpose({
  /** Whether the focused element is inside this sidebar, in either layout. */
  containsFocus: () => {
    const active = document.activeElement;
    if (!active) return false;

    return Boolean(host.value?.contains(active));
  },
});
</script>

<style scoped>
.mt-app__sidebar {
  display: flex;
  flex-direction: column;
  flex: none;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
}

.mt-app__sidebar[hidden] {
  display: none;
}

.mt-app__sidebar-content {
  display: flex;
  flex-direction: column;
  min-height: 100%;
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

@media print {
  .mt-app__sidebar {
    display: none;
  }
}
</style>
