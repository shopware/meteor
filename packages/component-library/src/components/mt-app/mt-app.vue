<template>
  <div
    ref="root"
    class="mt-app"
    :class="{
      'mt-app--responsive': mobileBreakpoint > 0,
      'mt-app--lock-document': lockDocument,
    }"
    :data-layout="isMounted ? (isMobile ? 'mobile' : 'desktop') : undefined"
    :data-drawer="activeSide ?? undefined"
  >
    <div v-if="hasContent()" ref="skip" class="mt-app__skip">
      <mt-button variant="secondary" size="small" @click="focusContent">
        {{ t("skipToContent") }}
      </mt-button>
    </div>

    <header
      v-if="hasHeader() || showTriggers()"
      ref="header"
      class="mt-app__header"
      :hidden="(hidden.header && !showTriggers()) || undefined"
    >
      <mt-app-trigger
        v-if="isMobile && isSidebarVisible('start')"
        ref="startTrigger"
        side="start"
        :label="t('openSidebar', { label: startLabel })"
        :expanded="activeSide === 'start'"
        :controls="ids.start"
        icon="regular-bars"
        @click="drawer.toggle('start')"
      />

      <div
        v-if="hasHeader()"
        ref="headerContent"
        class="mt-app__header-content"
        :hidden="hidden.header || undefined"
      >
        <slot name="header" v-bind="headerSlotProps" />
      </div>

      <mt-app-trigger
        v-if="isMobile && isSidebarVisible('end')"
        ref="endTrigger"
        side="end"
        :label="t('openSidebar', { label: endLabel })"
        :expanded="activeSide === 'end'"
        :controls="ids.end"
        icon="regular-panel-right"
        @click="drawer.toggle('end')"
      />
    </header>

    <div class="mt-app__body">
      <div
        v-if="isMobile"
        class="mt-app__backdrop"
        :data-state="activeSide ? 'open' : 'closed'"
        aria-hidden="true"
        data-testid="mt-app-backdrop"
        @click="drawer.close()"
      />

      <mt-app-sidebar
        v-if="hasSidebar('start')"
        :id="ids.start"
        ref="startSidebar"
        side="start"
        :label="startLabel"
        :close-label="t('closeSidebar', { label: startLabel })"
        :hidden="hidden.sidebarStart || undefined"
      >
        <slot name="sidebar-start" v-bind="sidebarSlotProps('start')" />
      </mt-app-sidebar>

      <main v-if="hasContent()" ref="main" class="mt-app__content" tabindex="-1">
        <slot name="content" />
      </main>

      <mt-app-sidebar
        v-if="hasSidebar('end')"
        :id="ids.end"
        ref="endSidebar"
        side="end"
        :label="endLabel"
        :close-label="t('closeSidebar', { label: endLabel })"
        :hidden="hidden.sidebarEnd || undefined"
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
import { hasSlotContent } from "@/utils/slot";
import { useTheme, type Theme } from "@/composables/useTheme";
import { provideFutureFlags, type FutureFlagsInput } from "@/composables/useFutureFlags";
import MtAppSidebar from "./_internal/mt-app-sidebar.vue";
import MtAppTrigger from "./_internal/mt-app-trigger.vue";
import {
  appLayoutKey,
  useBreakpoint,
  type MtAppRegions,
  type MtAppSide,
} from "./composables/useAppLayout";
import { useAppDrawer } from "./composables/useAppDrawer";
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
     * The theme preference. Pass it (or bind `v-model:theme`) to control the
     * theme yourself; omit it to let the shell manage and persist it.
     */
    theme?: Theme;
    /**
     * The `localStorage` key of the persisted theme preference while the theme
     * is not controlled. `null` disables persistence.
     */
    themeStorageKey?: string | null;
    /**
     * Whether the resolved theme is written to the `data-theme` attribute of
     * `<html>`. Disable it for embedded demos that must not touch the page.
     */
    applyTheme?: boolean;
    /**
     * The viewport width in pixels below which the shell switches to the mobile
     * layout and the sidebars become off-canvas drawers. `0` disables the
     * mobile layout.
     */
    mobileBreakpoint?: number;
    /**
     * Whether the shell owns the document: while mounted, the document never
     * scrolls and the page behind the shell uses the shell background. Disable
     * it when the shell is embedded into a page that scrolls itself.
     */
    lockDocument?: boolean;
    /**
     * Whether a navigation closes an open drawer. Works automatically with
     * vue-router; with another router, call `closeDrawer()` from `useMtApp()`.
     */
    closeOnNavigate?: boolean;
  }>(),
  {
    future: undefined,
    theme: undefined,
    themeStorageKey: "mt-theme",
    applyTheme: true,
    mobileBreakpoint: 1280,
    lockDocument: true,
    closeOnNavigate: true,
  },
);

const emit = defineEmits<{
  (e: "update:theme", theme: Theme): void;
  (e: "drawer-change", side: MtAppSide | null): void;
}>();

interface SidebarSlotProps {
  isMobile: boolean;
  /** whether the sidebar is currently open as a drawer */
  isOpen: boolean;
  /** closes the drawer */
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

const rootElement = useTemplateRef<HTMLElement>("root");
const skipElement = useTemplateRef<HTMLElement>("skip");
const headerElement = useTemplateRef<HTMLElement>("header");
const headerContentElement = useTemplateRef<HTMLElement>("headerContent");
const mainElement = useTemplateRef<HTMLElement>("main");
const startSidebar = useTemplateRef<InstanceType<typeof MtAppSidebar>>("startSidebar");
const endSidebar = useTemplateRef<InstanceType<typeof MtAppSidebar>>("endSidebar");
const startTrigger = useTemplateRef<InstanceType<typeof MtAppTrigger>>("startTrigger");
const endTrigger = useTemplateRef<InstanceType<typeof MtAppTrigger>>("endTrigger");

const ids = { start: useId(), end: useId() };

const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
});

const regionRequests = shallowReactive(new Map<symbol, () => MtAppRegions>());

const hidden = computed(() => {
  const requested = Array.from(regionRequests.values(), (regions) => regions());

  return {
    header: requested.some((regions) => regions.header === false),
    sidebarStart: requested.some((regions) => regions.sidebarStart === false),
    sidebarEnd: requested.some((regions) => regions.sidebarEnd === false),
  };
});

function isSidebarHidden(side: MtAppSide) {
  return side === "start" ? hidden.value.sidebarStart : hidden.value.sidebarEnd;
}

const isMobile = useBreakpoint(() => props.mobileBreakpoint, isMounted);
const drawer = useAppDrawer({
  isMobile,
  isAvailable: (side) => !isSidebarHidden(side),
  onChange: (side) => emit("drawer-change", side),
});
const activeSide = drawer.activeSide;

const startLabel = computed(() => t("sidebarStart"));
const endLabel = computed(() => t("sidebarEnd"));

const headerSlotProps = computed(() => ({ isMobile: isMobile.value }));

function sidebarSlotProps(side: MtAppSide): SidebarSlotProps {
  return { isMobile: isMobile.value, isOpen: activeSide.value === side, close: drawer.close };
}

function hasHeader() {
  return hasSlotContent(slots.header, headerSlotProps.value);
}

function hasSidebar(side: MtAppSide) {
  return hasSlotContent(slots[`sidebar-${side}`], sidebarSlotProps(side));
}

function hasContent() {
  return hasSlotContent(slots.content);
}

function isSidebarVisible(side: MtAppSide) {
  return hasSidebar(side) && !isSidebarHidden(side);
}

function showTriggers() {
  return isMobile.value && (isSidebarVisible("start") || isSidebarVisible("end"));
}

function sidebarElement(side: MtAppSide): HTMLElement | null {
  const sidebar = side === "start" ? startSidebar.value : endSidebar.value;

  return (sidebar?.$el as HTMLElement | undefined) ?? null;
}

function focusContent() {
  mainElement.value?.focus();
}

function focusReturnTarget(side: MtAppSide): HTMLElement | null {
  if (activeSide.value !== null) return null;

  const main = mainElement.value ?? null;

  if (!isMobile.value) {
    const active = document.activeElement;
    if (active && active !== document.body && rootElement.value?.contains(active)) return null;

    return main;
  }

  const trigger = (side === "start" ? startTrigger : endTrigger).value?.element ?? null;

  return trigger?.isConnected ? trigger : main;
}

function registerSidebar(side: MtAppSide) {
  const unregister = drawer.registerSidebar(side);

  return () => {
    const wasActive = activeSide.value === side;
    unregister();

    if (wasActive) nextTick(() => mainElement.value?.focus({ preventScroll: true }));
  };
}

function requestRegions(regions: () => MtAppRegions) {
  const id = Symbol("mt-app-regions");
  regionRequests.set(id, regions);

  return () => {
    regionRequests.delete(id);
  };
}

watch(hidden, (next, previous) => {
  if (activeSide.value && isSidebarHidden(activeSide.value)) drawer.close();

  const active = document.activeElement;
  if (!active) return;

  const hiding = [
    next.header && !previous.header ? headerContentElement.value : null,
    next.sidebarStart && !previous.sidebarStart ? sidebarElement("start") : null,
    next.sidebarEnd && !previous.sidebarEnd ? sidebarElement("end") : null,
  ];

  if (hiding.some((element) => element?.contains(active))) {
    nextTick(() => mainElement.value?.focus({ preventScroll: true }));
  }
});

provide(appLayoutKey, {
  isMobile,
  activeSide,
  registerSidebar,
  open: drawer.open,
  close: drawer.close,
  inertTargets: () => [skipElement.value, headerElement.value, mainElement.value],
  focusReturnTarget,
  requestRegions,
});

useAppRouter({
  scrollContainer: mainElement,
  onNavigate: () => {
    if (props.closeOnNavigate) drawer.close();
  },
});

const isThemeControlled = props.theme !== undefined;

const themeState = useTheme({
  storageKey: isThemeControlled ? null : props.themeStorageKey,
  defaultTheme: props.theme ?? "system",
  applyToTarget: props.applyTheme,
});

if (isThemeControlled) {
  watch(
    () => props.theme,
    (theme) => {
      if (theme) themeState.setTheme(theme);
    },
  );
}

function setTheme(theme: Theme) {
  if (!isThemeControlled) themeState.setTheme(theme);

  emit("update:theme", theme);
}

provideFutureFlags(() => ({ all: true, ...props.future }));

provideMtApp({
  isMobile,
  activeDrawer: activeSide,
  theme: computed(() => themeState.theme.value),
  resolvedTheme: themeState.resolvedTheme,
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

.mt-app__header {
  display: flex;
  flex: none;
  align-items: center;
  min-width: 0;
}

.mt-app__header[hidden],
.mt-app__header-content[hidden] {
  display: none;
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

.mt-app__backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--z-index-drawer, 900);
  background-color: var(--color-elevation-backdrop-default);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 150ms cubic-bezier(0, 0, 0, 1),
    visibility 0s linear 150ms;
}

.mt-app__backdrop[data-state="open"] {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transition: opacity 150ms cubic-bezier(0.3, 0, 1, 1);
}

@media (prefers-reduced-motion: reduce) {
  .mt-app__backdrop {
    transition: none;
  }
}

@media (max-width: 1279.98px) {
  .mt-app--responsive:not([data-layout]) .mt-app__sidebar {
    display: none;
  }
}

@media print {
  .mt-app {
    height: auto;
  }

  .mt-app__skip,
  .mt-app__header,
  .mt-app__backdrop {
    display: none;
  }

  .mt-app__body {
    padding: 0;
  }

  .mt-app__content {
    overflow: visible;
    border: 0;
    border-radius: 0;
  }
}
</style>

<style>
:root:has(.mt-app--lock-document) {
  overflow: hidden;
  background-color: var(--color-elevation-surface-sunken);
}

@media print {
  :root:has(.mt-app--lock-document) {
    overflow: visible;
  }
}
</style>
