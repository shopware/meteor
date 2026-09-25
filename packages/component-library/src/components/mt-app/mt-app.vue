<template>
  <div
    class="mt-app"
    :class="{ 'mt-app--responsive': mobileBreakpoint > 0 }"
    :data-layout="isMounted ? (isMobile ? 'mobile' : 'desktop') : undefined"
    :data-drawer="activeSide ?? undefined"
  >
    <div v-if="hasContent()" class="mt-app__skip">
      <mt-button variant="secondary" size="small" @click="focusContent">
        {{ t("skipToContent") }}
      </mt-button>
    </div>

    <header
      v-if="hasHeader() || showTriggers()"
      class="mt-app__header"
      :hidden="(hiddenRegions.header && !showTriggers()) || undefined"
    >
      <mt-app-trigger
        v-if="isMobile && isSidebarVisible('start')"
        side="start"
        :label="t('openSidebar', { label: startLabel })"
        :expanded="activeSide === 'start'"
        :controls="drawerIds.start"
        icon="regular-bars"
        @click="drawer.toggle('start')"
      />

      <div
        v-if="hasHeader()"
        ref="headerContent"
        class="mt-app__header-content"
        :hidden="hiddenRegions.header || undefined"
      >
        <slot name="header" v-bind="headerSlotProps" />
      </div>

      <mt-app-trigger
        v-if="isMobile && isSidebarVisible('end')"
        side="end"
        :label="t('openSidebar', { label: endLabel })"
        :expanded="activeSide === 'end'"
        :controls="drawerIds.end"
        icon="regular-panel-right"
        @click="drawer.toggle('end')"
      />
    </header>

    <div class="mt-app__body">
      <mt-app-sidebar
        v-if="hasSidebar('start')"
        :id="drawerIds.start"
        ref="startSidebar"
        side="start"
        :label="startLabel"
        :close-label="t('closeSidebar', { label: startLabel })"
        :drawer-variant="startDrawerVariant"
        :hidden="hiddenRegions.sidebarStart || undefined"
      >
        <slot name="sidebar-start" v-bind="sidebarSlotProps('start')" />
      </mt-app-sidebar>

      <main v-if="hasContent()" ref="main" class="mt-app__content" tabindex="-1">
        <slot name="content" />
      </main>

      <mt-app-sidebar
        v-if="hasSidebar('end')"
        :id="drawerIds.end"
        ref="endSidebar"
        side="end"
        :label="endLabel"
        :close-label="t('closeSidebar', { label: endLabel })"
        :drawer-variant="endDrawerVariant"
        :hidden="hiddenRegions.sidebarEnd || undefined"
      >
        <slot name="sidebar-end" v-bind="sidebarSlotProps('end')" />
      </mt-app-sidebar>
    </div>

    <slot name="global" />

    <mt-snackbar />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUpdate,
  onMounted,
  provide,
  ref,
  shallowReactive,
  useId,
  useTemplateRef,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtSnackbar from "@/components/mt-snackbar/mt-snackbar.vue";
import { provideFutureFlags, type FutureFlagsInput } from "@/composables/useFutureFlags";
import { useTheme } from "@/composables/useTheme";
import { hasSlotContent } from "@/utils/slot";
import MtAppSidebar from "./_internal/mt-app-sidebar.vue";
import MtAppTrigger from "./_internal/mt-app-trigger.vue";
import { useAppDrawer } from "./composables/useAppDrawer";
import {
  appLayoutKey,
  useBreakpoint,
  type MtAppRegions,
  type MtAppSide,
} from "./composables/useAppLayout";
import { useAppRouter } from "./composables/useAppRouter";
import { provideMtApp } from "./composables/useMtApp";

/**
 * The root shell of a standalone Meteor application. It arranges the header,
 * both sidebars and the content area, turns the sidebars into off-canvas
 * drawers below the mobile breakpoint, and provides theme, future flags
 * and the snackbar host to everything inside. Use one shell per application.
 */
const props = withDefaults(
  defineProps<{
    /**
     * Future flags for every Meteor component inside the shell. All flags,
     * including upcoming ones, are enabled by default; the given flags override
     * that, e.g. `{ removeCardWidth: false }` keeps every other flag enabled and
     * `{ all: false }` disables all of them.
     */
    future?: FutureFlagsInput;
    /**
     * The viewport width in pixels below which the shell switches to the mobile
     * layout and the sidebars become off-canvas drawers. `0` disables the
     * mobile layout.
     */
    mobileBreakpoint?: number;
    /**
     * The look of the start sidebar's drawer in the mobile layout. `floating` keeps an
     * 8px distance to the viewport edges and gets a border with rounded corners.
     */
    startDrawerVariant?: "default" | "floating";
    /**
     * The look of the end sidebar's drawer in the mobile layout. `floating` keeps an
     * 8px distance to the viewport edges and gets a border with rounded corners.
     */
    endDrawerVariant?: "default" | "floating";
  }>(),
  {
    future: undefined,
    mobileBreakpoint: 1280,
    startDrawerVariant: "default",
    endDrawerVariant: "default",
  },
);

interface SidebarSlotProps {
  /** Whether the shell uses the mobile layout. */
  isMobile: boolean;
  /** Whether the sidebar is open as a drawer. */
  isOpen: boolean;
  /** Closes the drawer. */
  close: () => void;
}

const slots = defineSlots<{
  /** The header bar. In the mobile layout the drawer triggers are placed at its start and end. */
  header?(props: { isMobile: boolean }): unknown;
  /** The start sidebar, usually the navigation. Becomes a drawer in the mobile layout. */
  "sidebar-start"?(props: SidebarSlotProps): unknown;
  /** The scrollable main content. */
  content?(): unknown;
  /** The end sidebar, for example an assistant or contextual tools. Becomes a drawer in the mobile layout. */
  "sidebar-end"?(props: SidebarSlotProps): unknown;
  /** App-wide hosts without a layout box, such as keyboard shortcut listeners. */
  global?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: {
      sidebarStart: "Primary sidebar",
      sidebarEnd: "Secondary sidebar",
      openSidebar: "Open {label}",
      closeSidebar: "Close {label}",
      skipToContent: "Skip to content",
    },
    de: {
      sidebarStart: "Primäre Seitenleiste",
      sidebarEnd: "Sekundäre Seitenleiste",
      openSidebar: "{label} öffnen",
      closeSidebar: "{label} schließen",
      skipToContent: "Zum Inhalt springen",
    },
  },
});

const headerContentElement = useTemplateRef<HTMLElement>("headerContent");
const mainElement = useTemplateRef<HTMLElement>("main");
const startSidebar = useTemplateRef<InstanceType<typeof MtAppSidebar>>("startSidebar");
const endSidebar = useTemplateRef<InstanceType<typeof MtAppSidebar>>("endSidebar");

const drawerIds = { start: useId(), end: useId() };

// The viewport is unknown on the server, so it is only read after mounting:
// the server markup and the first client render then use the same layout.
const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});

const isMobile = useBreakpoint(() => props.mobileBreakpoint, isMounted);
const drawer = useAppDrawer({
  isMobile,
  isAvailable: (side) => !isSidebarHidden(side),
});
const activeSide = drawer.activeSide;

const startLabel = computed(() => t("sidebarStart"));
const endLabel = computed(() => t("sidebarEnd"));

const regionRequests = shallowReactive(new Map<symbol, () => MtAppRegions>());

const hiddenRegions = computed<Required<MtAppRegions>>((previous) => {
  const requested = Array.from(regionRequests.values(), (regions) => regions());
  const next = {
    header: requested.some((regions) => regions.header === false),
    sidebarStart: requested.some((regions) => regions.sidebarStart === false),
    sidebarEnd: requested.some((regions) => regions.sidebarEnd === false),
  };

  const isUnchanged =
    previous?.header === next.header &&
    previous.sidebarStart === next.sidebarStart &&
    previous.sidebarEnd === next.sidebarEnd;

  return isUnchanged ? previous : next;
});

function isSidebarHidden(side: MtAppSide) {
  return side === "start" ? hiddenRegions.value.sidebarStart : hiddenRegions.value.sidebarEnd;
}

function requestRegions(regions: () => MtAppRegions) {
  const id = Symbol("mt-app-regions");
  regionRequests.set(id, regions);

  return () => {
    regionRequests.delete(id);
  };
}

watch(hiddenRegions, (next, previous) => {
  if (activeSide.value && isSidebarHidden(activeSide.value)) drawer.close();

  const active = document.activeElement;
  if (!active) return;

  const isHidingFocus =
    (next.header && !previous.header && headerContentElement.value?.contains(active)) ||
    (next.sidebarStart && !previous.sidebarStart && startSidebar.value?.containsFocus()) ||
    (next.sidebarEnd && !previous.sidebarEnd && endSidebar.value?.containsFocus());

  if (isHidingFocus) nextTick(focusContent);
});

const headerSlotProps = computed(() => ({ isMobile: isMobile.value }));

function sidebarSlotProps(side: MtAppSide): SidebarSlotProps {
  return { isMobile: isMobile.value, isOpen: activeSide.value === side, close: drawer.close };
}

// Detecting empty slots renders them, so their presence is evaluated once per render.
let slotPresence: { header: boolean; start: boolean; end: boolean; content: boolean } | undefined;

onBeforeUpdate(() => {
  slotPresence = undefined;
});

function getSlotPresence() {
  slotPresence ??= {
    header: hasSlotContent(slots.header, headerSlotProps.value),
    start: hasSlotContent(slots["sidebar-start"], sidebarSlotProps("start")),
    end: hasSlotContent(slots["sidebar-end"], sidebarSlotProps("end")),
    content: hasSlotContent(slots.content),
  };

  return slotPresence;
}

function hasHeader() {
  return getSlotPresence().header;
}

function hasSidebar(side: MtAppSide) {
  return getSlotPresence()[side];
}

function hasContent() {
  return getSlotPresence().content;
}

function isSidebarVisible(side: MtAppSide) {
  return hasSidebar(side) && !isSidebarHidden(side);
}

function showTriggers() {
  return isMobile.value && (isSidebarVisible("start") || isSidebarVisible("end"));
}

function focusContent() {
  mainElement.value?.focus({ preventScroll: true });
}

function registerSidebar(side: MtAppSide) {
  const unregister = drawer.registerSidebar(side);

  return () => {
    const wasActive = activeSide.value === side;
    unregister();

    if (wasActive) nextTick(focusContent);
  };
}

// Sync, so the open drawer is still known here before useAppDrawer closes it for the new layout.
watch(
  isMobile,
  () => {
    if (activeSide.value !== null) nextTick(focusContent);
  },
  { flush: "sync" },
);

provide(appLayoutKey, {
  isMobile,
  activeSide,
  registerSidebar,
  open: drawer.open,
  close: drawer.close,
  requestRegions,
});

useAppRouter({
  scrollContainer: mainElement,
  onNavigate: () => drawer.close(),
});

const { theme, resolvedTheme, setTheme } = useTheme();

provideFutureFlags(() => ({ all: true, ...props.future }));

provideMtApp({
  isMobile,
  activeDrawer: activeSide,
  theme,
  resolvedTheme,
  scrollContainer: mainElement,
  openDrawer: drawer.open,
  closeDrawer: drawer.close,
  setTheme,
});

defineExpose({
  /** Opens the drawer of the given side (mobile layout only). */
  openDrawer: drawer.open,
  /** Closes the open drawer. */
  closeDrawer: drawer.close,
});
</script>

<style scoped>
.mt-app {
  --mt-app-viewport-height: 100vh;

  position: relative;
  display: flex;
  flex-direction: column;
  height: var(--mt-app-height, var(--mt-app-viewport-height));
  background-color: var(--color-elevation-surface-sunken);
  color: var(--color-text-primary-default);
}

@supports (height: 1dvh) {
  .mt-app {
    --mt-app-viewport-height: 100dvh;
  }
}

.mt-app__header {
  display: flex;
  flex: none;
  align-items: center;
  min-width: 0;
}

.mt-app__header-content {
  flex: 1 1 auto;
  min-width: 0;
  overflow-x: clip;
}

.mt-app__body {
  display: flex;
  flex: 1 1 0;
  gap: var(--scale-size-8);
  min-height: 0;
  padding: var(--scale-size-8);
}

.mt-app__header:not([hidden]) + .mt-app__body {
  padding-block-start: 0;
}

.mt-app__content {
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  background-color: var(--color-elevation-surface-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
  outline: none;
}

.mt-app__header[hidden],
.mt-app__header-content[hidden] {
  display: none;
}

.mt-app__skip {
  position: absolute;
  inset-block-start: var(--scale-size-8);
  inset-inline-start: var(--scale-size-8);
  z-index: 1;
}

.mt-app__skip:not(:focus-within) {
  width: var(--scale-size-1);
  height: var(--scale-size-1);
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/*
 * Until the app has mounted, the layout is unknown (see isMounted). Hide the inline
 * sidebars below the default breakpoint so small screens don't show them before the
 * drawers take over. Custom breakpoints only apply once the app has mounted.
 */
@media (width < 1280px) {
  .mt-app--responsive:not([data-layout]) :deep(.mt-app__sidebar) {
    display: none;
  }
}

@media print {
  .mt-app {
    height: auto;
  }

  .mt-app__skip,
  .mt-app__header {
    display: none;
  }

  .mt-app__body {
    padding: 0;
  }

  .mt-app__content {
    overflow: visible;
    border: 0;
    border-radius: var(--border-radius-none);
  }
}
</style>

<style>
/*
 * The document never scrolls while a shell is mounted, only its content panel does,
 * also when body-level overlays (such as a date picker menu) reach beyond the viewport.
 */
:root:has(.mt-app) {
  overflow: hidden;
  background-color: var(--color-elevation-surface-sunken);
}

@media print {
  :root:has(.mt-app) {
    overflow: visible;
  }
}
</style>
