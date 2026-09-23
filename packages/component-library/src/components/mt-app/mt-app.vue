<template>
  <div
    ref="root"
    class="mt-app"
    :data-layout="isMobile ? 'mobile' : 'desktop'"
    :data-drawer="activeSide ?? undefined"
  >
    <header
      v-if="hasHeader() || (isMobile && (hasSidebar('start') || hasSidebar('end')))"
      class="mt-app__header"
      :inert="backgroundInert || undefined"
    >
      <mt-app-trigger
        v-if="isMobile && hasSidebar('start')"
        ref="startTrigger"
        side="start"
        :label="t('openSidebar', { label: startLabel })"
        :expanded="activeSide === 'start'"
        :controls="ids.start"
        icon="regular-bars"
        @click="drawer.toggle('start')"
      />

      <div v-if="hasHeader()" class="mt-app__header-content">
        <slot name="header" v-bind="headerSlotProps" />
      </div>

      <mt-app-trigger
        v-if="isMobile && hasSidebar('end')"
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
        ref="backdrop"
        class="mt-app__backdrop"
        :data-state="activeSide ? 'open' : 'closed'"
        aria-hidden="true"
        data-testid="mt-app-backdrop"
        @click="drawer.close()"
      />

      <mt-app-sidebar
        v-if="hasSidebar('start')"
        :id="ids.start"
        side="start"
        :label="startLabel"
        :close-label="t('closeSidebar', { label: startLabel })"
      >
        <slot name="sidebar-start" v-bind="sidebarSlotProps('start')" />
      </mt-app-sidebar>

      <main
        v-if="hasContent()"
        ref="main"
        class="mt-app__content"
        tabindex="-1"
        :inert="backgroundInert || undefined"
      >
        <slot name="content" />
      </main>

      <mt-app-sidebar
        v-if="hasSidebar('end')"
        :id="ids.end"
        side="end"
        :label="endLabel"
        :close-label="t('closeSidebar', { label: endLabel })"
      >
        <slot name="sidebar-end" v-bind="sidebarSlotProps('end')" />
      </mt-app-sidebar>
    </div>

    <slot name="global" />

    <mt-snackbar v-if="snackbar" />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, provide, useId, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import MtSnackbar from "@/components/mt-snackbar/mt-snackbar.vue";
import { hasSlotContent } from "@/utils/slot";
import { useTheme, type Theme } from "@/composables/useTheme";
import {
  futureFlagsInjectionKey,
  provideFutureFlags,
  type FutureFlags,
  type FutureFlagsInput,
} from "@/composables/useFutureFlags";
import MtAppSidebar from "./_internal/mt-app-sidebar.vue";
import MtAppTrigger from "./_internal/mt-app-trigger.vue";
import {
  appLayoutKey,
  useBreakpoint,
  useDocumentLock,
  type MtAppSide,
} from "./composables/useAppLayout";
import { useAppDrawer } from "./composables/useAppDrawer";
import { provideMtApp } from "./composables/useMtApp";

/**
 * The root shell of a standalone Meteor application. It arranges the header,
 * both sidebars and the content area, turns the sidebars into off-canvas
 * drawers below the breakpoint, and provides theme, future flags
 * and the snackbar host to everything inside.
 */
const props = withDefaults(
  defineProps<{
    /**
     * Future flags for every Meteor component inside the shell. When omitted,
     * the flags of a surrounding provider are inherited.
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
     * The viewport width in pixels below which the sidebars become off-canvas
     * drawers. `0` disables the mobile layout.
     */
    breakpoint?: number;
    /**
     * Whether the shell owns the document: while mounted, the document never
     * scrolls and the page behind the shell uses the shell background. Disable
     * it when the shell is embedded into a page that scrolls itself.
     */
    lockDocument?: boolean;
    /**
     * Whether the shell renders the snackbar host for `useSnackbar()`.
     */
    snackbar?: boolean;
    /**
     * Whether clicking a link inside an open drawer closes the drawer.
     */
    closeOnNavigate?: boolean;
    /**
     * The accessible name of the start sidebar and its drawer.
     */
    sidebarStartLabel?: string;
    /**
     * The accessible name of the end sidebar and its drawer.
     */
    sidebarEndLabel?: string;
  }>(),
  {
    future: undefined,
    theme: undefined,
    themeStorageKey: "mt-theme",
    applyTheme: true,
    breakpoint: 1280,
    lockDocument: true,
    snackbar: true,
    closeOnNavigate: true,
    sidebarStartLabel: undefined,
    sidebarEndLabel: undefined,
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
  /** The end sidebar, for example contextual tools. Becomes a drawer in the mobile layout. */
  "sidebar-end"?(props: SidebarSlotProps): unknown;
  /** App-wide hosts without a layout box, such as notification renderers. */
  global?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: {
      sidebarStart: "Primary sidebar",
      sidebarEnd: "Secondary sidebar",
      openSidebar: "Open {label}",
      closeSidebar: "Close {label}",
    },
    de: {
      sidebarStart: "Primäre Seitenleiste",
      sidebarEnd: "Sekundäre Seitenleiste",
      openSidebar: "{label} öffnen",
      closeSidebar: "{label} schließen",
    },
  },
});

const rootElement = useTemplateRef<HTMLElement>("root");
const mainElement = useTemplateRef<HTMLElement>("main");
const backdropElement = useTemplateRef<HTMLElement>("backdrop");
const startTrigger = useTemplateRef<InstanceType<typeof MtAppTrigger>>("startTrigger");
const endTrigger = useTemplateRef<InstanceType<typeof MtAppTrigger>>("endTrigger");

const ids = { start: useId(), end: useId() };

const isMobile = useBreakpoint(() => props.breakpoint);
useDocumentLock(() => props.lockDocument);
const drawer = useAppDrawer({
  isMobile,
  onChange: (side) => emit("drawer-change", side),
});
const activeSide = drawer.activeSide;
const backgroundInert = computed(() => activeSide.value !== null);

const startLabel = computed(() => props.sidebarStartLabel ?? t("sidebarStart"));
const endLabel = computed(() => props.sidebarEndLabel ?? t("sidebarEnd"));

const headerSlotProps = computed(() => ({ isMobile: isMobile.value }));

function sidebarSlotProps(side: MtAppSide): SidebarSlotProps {
  return { isMobile: isMobile.value, isOpen: activeSide.value === side, close: drawer.close };
}

// Slot presence is checked while rendering: the slots object is not reactive, so a
// computed would not notice a parent adding or removing a `<template #slot v-if>`.
function hasHeader() {
  return hasSlotContent(slots.header, headerSlotProps.value);
}

function hasSidebar(side: MtAppSide) {
  return hasSlotContent(slots[`sidebar-${side}`], sidebarSlotProps(side));
}

function hasContent() {
  return hasSlotContent(slots.content);
}

function focusReturnTarget(side: MtAppSide): HTMLElement | null {
  // another drawer took over; the focus moves into it instead
  if (activeSide.value !== null) return null;

  const main = mainElement.value ?? null;

  if (!isMobile.value) {
    // the drawer turned back into an inline sidebar: keep the focus if it survived inside the shell
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

    // the open drawer disappeared together with the focus; land on the content
    if (wasActive) nextTick(() => mainElement.value?.focus({ preventScroll: true }));
  };
}

provide(appLayoutKey, {
  isMobile,
  activeSide,
  closeOnNavigate: computed(() => props.closeOnNavigate),
  registerSidebar,
  open: drawer.open,
  close: drawer.close,
  focusReturnTarget,
});

// Theme: a `theme` prop at setup time means the host controls it; otherwise the shell
// owns and persists the preference.
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

// Future flags: an omitted prop passes the inherited flags through instead of resetting them.
const inheritedFutureFlags = inject(futureFlagsInjectionKey, null) as FutureFlags | null;
provideFutureFlags(() => props.future ?? inheritedFutureFlags ?? undefined);

provideMtApp({
  isMobile,
  activeDrawer: activeSide,
  theme: computed(() => themeState.theme.value),
  resolvedTheme: themeState.resolvedTheme,
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

if (import.meta.env.DEV) {
  let warnedAboutContainingBlock = false;

  // a transformed ancestor turns the fixed drawer into an absolutely positioned child
  watch(
    activeSide,
    (side) => {
      if (!side || warnedAboutContainingBlock) return;

      const rect = backdropElement.value?.getBoundingClientRect();
      if (!rect || (rect.top === 0 && rect.left === 0)) return;

      warnedAboutContainingBlock = true;
      console.warn(
        "[MtApp] The drawer backdrop does not cover the viewport. Make sure no ancestor of <mt-app /> uses transform, filter, contain or will-change; they turn position: fixed into a containing block.",
      );
    },
    { flush: "post" },
  );
}
</script>

<style scoped>
.mt-app {
  --mt-app-viewport-height: 100vh;

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

/* consumer content shrinks instead of pushing the triggers out; it must not scroll horizontally */
.mt-app__header-content {
  flex: 1 1 auto;
  min-width: 0;
  overflow-x: clip;
}

/*
 * the spacing of the shell: the row keeps its distance to the shell edges and its regions
 * keep their distance to each other. Out-of-flow children (backdrop, drawers) take no gap.
 */
.mt-app__body {
  display: flex;
  flex: 1 1 0;
  gap: var(--scale-size-8);
  min-height: 0;
  padding: var(--scale-size-8);
}

/* a header sits directly on the row; without one the row keeps its gap to the shell edge */
.mt-app__header + .mt-app__body {
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
  /* receives programmatic focus when a drawer closes; no ring for that */
  outline: none;
}

.mt-app__backdrop {
  position: fixed;
  inset: 0;
  z-index: 900;
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
</style>
