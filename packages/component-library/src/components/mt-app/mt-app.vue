<template>
  <div
    class="mt-app"
    :class="{ 'mt-app--responsive': mobileBreakpoint > 0, 'mt-app--frameless': isFrameless() }"
    :data-layout="isMounted ? (isMobile ? 'mobile' : 'desktop') : undefined"
  >
    <div
      v-if="isLoadingBarShown"
      class="mt-app__loading-bar"
      role="progressbar"
      :aria-label="t('loading')"
    />

    <div v-if="hasContent()" class="mt-app__skip">
      <mt-button variant="secondary" size="small" @click="focusContent">
        {{ t("skipToContent") }}
      </mt-button>
    </div>

    <header
      v-if="hasSlot('header') || showTriggers()"
      class="mt-app__header"
      :class="{ 'mt-app__header--with-triggers': showTriggers() }"
      :hidden="(hiddenRegions.header && !showTriggers()) || undefined"
    >
      <mt-app-trigger
        v-if="isMobile && isAvailable('navigation')"
        panel="navigation"
        :label="t('open', { label: labels.navigation })"
        :expanded="panels.isOpen('navigation')"
        :controls="drawerIds.navigation"
        icon="regular-bars"
        @click="panels.toggle('navigation')"
      />

      <div
        v-if="hasSlot('header')"
        ref="headerContent"
        class="mt-app__header-content"
        :hidden="hiddenRegions.header || undefined"
      >
        <slot name="header" v-bind="headerSlotProps" />
      </div>

      <mt-app-trigger
        v-if="isMobile && isAvailable('sidebar')"
        panel="sidebar"
        :label="t('open', { label: labels.sidebar })"
        :expanded="panels.isOpen('sidebar')"
        :controls="drawerIds.sidebar"
        icon="regular-panel-right"
        @click="panels.toggle('sidebar')"
      />
    </header>

    <div class="mt-app__body">
      <mt-app-region
        v-if="hasSlot('navigation')"
        :id="drawerIds.navigation"
        ref="navigationRegion"
        panel="navigation"
        :label="labels.navigation"
        :close-label="t('close', { label: labels.navigation })"
        :hidden="!isOpenInline('navigation') || undefined"
      >
        <slot name="navigation" v-bind="panelSlotProps('navigation')" />
      </mt-app-region>

      <main
        v-if="hasContent()"
        ref="main"
        class="mt-app__content"
        tabindex="-1"
        :aria-busy="isLoadingBarShown || undefined"
      >
        <slot name="content" />
      </main>

      <mt-app-region
        v-if="hasSlot('sidebar')"
        :id="drawerIds.sidebar"
        ref="sidebarRegion"
        panel="sidebar"
        :label="labels.sidebar"
        :close-label="t('close', { label: labels.sidebar })"
        :hidden="!isOpenInline('sidebar') || undefined"
      >
        <slot name="sidebar" v-bind="panelSlotProps('sidebar')" />
      </mt-app-region>
    </div>

    <span class="mt-app__announcer" aria-live="polite" aria-atomic="true">{{
      pageAnnouncement
    }}</span>

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
  useId,
  useTemplateRef,
  watch,
} from "vue";
import { useMediaQuery, useMounted } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtSnackbar from "@/components/mt-snackbar/mt-snackbar.vue";
import { provideFutureFlags, type FutureFlagsInput } from "@/composables/useFutureFlags";
import { useTheme } from "@/composables/useTheme";
import { hasSlotContent } from "@/utils/slot";
import MtAppRegion from "./_internal/mt-app-region.vue";
import MtAppTrigger from "./_internal/mt-app-trigger.vue";
import { appContextKey } from "./composables/useAppContext";
import { useAppPanels } from "./composables/useAppPanels";
import { useAppRegions } from "./composables/useAppRegions";
import { useAppLoading } from "./composables/useAppLoading";
import { useRouteChange, useRouteMeta, type RouteLike } from "./composables/useAppRouter";
import type { MtAppContext, MtAppPanel } from "./composables/useMtApp";
import type { MtAppRegions } from "./composables/useMtAppRegions";

/**
 * The root shell of a standalone Meteor application. It arranges the header, the navigation,
 * the content and the sidebar, turns the navigation and the sidebar into drawers below the
 * mobile breakpoint, and provides the theme, the future flags and the snackbar host to
 * everything inside. Use one shell per application.
 *
 * - The navigation and the sidebar render as `<nav>` and `<aside>` landmarks, so their slots
 *   shouldn't add another landmark of the same kind. Their labels name the landmarks and, in the
 *   mobile layout, the drawers and their triggers. The defaults are translated for English and
 *   German; pass both labels in other languages.
 * - Components inside the shell read and control it with `useMtApp()`. The component that renders
 *   `<mt-app>` uses the `header` slot props or a template ref instead, because it is not inside
 *   the shell.
 * - A route hides regions with `meta: { mtAppRegions: { header: false } }`, and a page toggles them
 *   with `useMtAppRegions()`.
 * - With Vue Router, a navigation closes the open drawer and shows the new page from its top,
 *   or from the element of its URL hash, and screen readers announce the new document title.
 *
 * @experimental Not for public use yet: undocumented, and it may change or be removed without notice.
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
     * layout, in which the navigation and the sidebar become drawers. `0` disables
     * the mobile layout.
     */
    mobileBreakpoint?: number;
    /**
     * Shows a thin loading bar along the top edge while a navigation is pending or while app code
     * reports loading with `useMtApp().startLoading()`. It appears only after 200ms, so quick
     * navigations don't flash it.
     */
    loadingBar?: boolean;
    /** The accessible name of the navigation. Defaults to "Navigation". */
    navigationLabel?: string;
    /** The accessible name of the sidebar, such as "Assistant". Defaults to "Sidebar". */
    sidebarLabel?: string;
  }>(),
  {
    future: undefined,
    mobileBreakpoint: 1280,
    navigationLabel: undefined,
    sidebarLabel: undefined,
    loadingBar: false,
  },
);

/** Whether the navigation is shown in the desktop layout. */
const navigationOpen = defineModel<boolean>("navigationOpen", { default: true });

/** Whether the sidebar is shown in the desktop layout. */
const sidebarOpen = defineModel<boolean>("sidebarOpen", { default: true });

interface PanelSlotProps {
  /** Whether the shell uses the mobile layout. */
  isMobile: boolean;
  /** Whether the panel is open in the current layout. */
  isOpen: boolean;
  /** Closes the panel. */
  close: () => void;
}

type HeaderSlotProps = Omit<MtAppContext, "isMobile"> & { isMobile: boolean };

const slots = defineSlots<{
  /** The header bar. In the mobile layout, the drawer triggers sit at its start and end. */
  header?(props: HeaderSlotProps): unknown;
  /** The navigation. Becomes a drawer in the mobile layout. */
  navigation?(props: PanelSlotProps): unknown;
  /** The scrollable main content. */
  content?(): unknown;
  /** A panel next to the content, for example an assistant. Becomes a drawer in the mobile layout. */
  sidebar?(props: PanelSlotProps): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: {
      navigation: "Navigation",
      sidebar: "Sidebar",
      open: "Open {label}",
      close: "Close {label}",
      skipToContent: "Skip to content",
      loading: "Loading",
    },
    de: {
      navigation: "Navigation",
      sidebar: "Seitenleiste",
      open: "{label} öffnen",
      close: "{label} schließen",
      skipToContent: "Zum Inhalt springen",
      loading: "Wird geladen",
    },
  },
});

const labels = computed<Record<MtAppPanel, string>>(() => ({
  navigation: props.navigationLabel ?? t("navigation"),
  sidebar: props.sidebarLabel ?? t("sidebar"),
}));

const headerContentElement = useTemplateRef<HTMLElement>("headerContent");
const mainElement = useTemplateRef<HTMLElement>("main");
const regionElements = {
  navigation: useTemplateRef<InstanceType<typeof MtAppRegion>>("navigationRegion"),
  sidebar: useTemplateRef<InstanceType<typeof MtAppRegion>>("sidebarRegion"),
};

const drawerIds: Record<MtAppPanel, string> = { navigation: useId(), sidebar: useId() };

// The viewport is unknown on the server, so the mobile layout only applies after mounting:
// the server markup and the first client render then agree. A breakpoint of 0 never matches.
const isMounted = useMounted();
const matchesMobileBreakpoint = useMediaQuery(() => `(width < ${props.mobileBreakpoint}px)`);
const isMobile = computed(() => isMounted.value && matchesMobileBreakpoint.value);

const { hidden: hiddenRegions, requestRegions } = useAppRegions();

// Regions that the current route hides in its meta, which changes as soon as a navigation is
// confirmed, before the new page renders, so they don't flicker during page transitions.
const routeMeta = useRouteMeta();
requestRegions(() => (routeMeta.value.mtAppRegions ?? {}) as MtAppRegions);

const { isLoading, startLoading } = useAppLoading();
const isLoadingBarShown = computed(() => props.loadingBar && isLoading.value);

const panels = useAppPanels({
  isMobile,
  canOpenDrawer: isAvailable,
  desktopState: { navigation: navigationOpen, sidebar: sidebarOpen },
});

// Detecting empty slots renders them, so their presence is evaluated once per render.
let slotPresence: Record<"header" | MtAppPanel | "content", boolean> | undefined;

onBeforeUpdate(() => {
  slotPresence = undefined;
});

function getSlotPresence() {
  slotPresence ??= {
    header: hasSlotContent(slots.header, headerSlotProps.value),
    navigation: hasSlotContent(slots.navigation, panelSlotProps("navigation")),
    sidebar: hasSlotContent(slots.sidebar, panelSlotProps("sidebar")),
    content: hasSlotContent(slots.content),
  };

  return slotPresence;
}

function hasSlot(name: "header" | MtAppPanel) {
  return getSlotPresence()[name];
}

function hasContent() {
  return getSlotPresence().content;
}

/** Whether the panel can be shown: its slot is filled and no view hides it. */
function isAvailable(panel: MtAppPanel) {
  return hasSlot(panel) && !hiddenRegions.value[panel];
}

/**
 * Whether the panel is open next to the content and no view hides it, which only happens in the
 * desktop layout. It doesn't probe the slot, so watchers can use it outside of rendering.
 */
function isOpenInline(panel: MtAppPanel) {
  return !isMobile.value && !hiddenRegions.value[panel] && panels.isOpen(panel);
}

/** Whether the panel is visible next to the content. */
function isShownInline(panel: MtAppPanel) {
  return hasSlot(panel) && isOpenInline(panel);
}

function showTriggers() {
  return isMobile.value && (isAvailable("navigation") || isAvailable("sidebar"));
}

/**
 * The content fills the shell without a frame when no other slot is filled. Regions that a view
 * hides and closed panels keep the frame, so the view looks like the others, unless the view asks
 * for `contentFrame: false`.
 */
function isFrameless() {
  if (!hasContent()) return false;
  if (!hasSlot("header") && !hasSlot("navigation") && !hasSlot("sidebar")) return true;

  const isHeaderVisible = (hasSlot("header") && !hiddenRegions.value.header) || showTriggers();

  return (
    hiddenRegions.value.contentFrame &&
    !isHeaderVisible &&
    !isShownInline("navigation") &&
    !isShownInline("sidebar")
  );
}

const headerSlotProps = computed<HeaderSlotProps>(() => ({
  isMobile: isMobile.value,
  isOpen: panels.isOpen,
  open: panels.open,
  close: panels.close,
  toggle: panels.toggle,
  startLoading,
}));

function panelSlotProps(panel: MtAppPanel): PanelSlotProps {
  return {
    isMobile: isMobile.value,
    isOpen: panels.isOpen(panel),
    close: () => panels.close(panel),
  };
}

function focusContent() {
  mainElement.value?.focus({ preventScroll: true });
}

// A region that disappears while it holds the focus would leave the focus nowhere.
watch(
  () => ({
    header: !hiddenRegions.value.header,
    navigation: isOpenInline("navigation"),
    sidebar: isOpenInline("sidebar"),
  }),
  (visible, wasVisible) => {
    const active = document.activeElement;
    if (!active) return;

    const isHidingFocus =
      (wasVisible.header && !visible.header && headerContentElement.value?.contains(active)) ||
      (wasVisible.navigation &&
        !visible.navigation &&
        regionElements.navigation.value?.containsFocus()) ||
      (wasVisible.sidebar && !visible.sidebar && regionElements.sidebar.value?.containsFocus());

    if (isHidingFocus) nextTick(focusContent);
  },
);

// A view that hides a panel also closes its drawer.
watch(hiddenRegions, (hidden) => {
  const drawer = panels.drawer.value;
  if (drawer && hidden[drawer]) panels.closeDrawer();
});

// Sync, so the open drawer is still known here before useAppPanels closes it for the new layout.
watch(
  isMobile,
  () => {
    if (panels.drawer.value !== null) nextTick(focusContent);
  },
  { flush: "sync" },
);

provide(appContextKey, {
  isMobile,
  isOpen: panels.isOpen,
  open: panels.open,
  close: panels.close,
  toggle: panels.toggle,
  startLoading,
  requestRegions,
  focusContent,
});

const pageAnnouncement = ref("");
let announcedTitle = "";

onMounted(() => {
  announcedTitle = document.title;
});

/** Shows a new page from its top, or from the element of its URL hash, as browsers do for a window. */
function scrollContent(to: RouteLike, from: RouteLike) {
  const main = mainElement.value;
  if (!main) return;

  const target = to.hash ? document.getElementById(decodeURIComponent(to.hash.slice(1))) : null;

  if (target && main.contains(target)) target.scrollIntoView();
  else if (to.path !== from.path) main.scrollTop = 0;
}

/** Tells screen readers that a new page is shown, as they hear after a full page load. */
function announcePage() {
  if (document.title === announcedTitle) return;

  announcedTitle = document.title;
  pageAnnouncement.value = document.title;
}

let finishNavigationLoading: (() => void) | undefined;

useRouteChange({
  onStart() {
    finishNavigationLoading?.();
    finishNavigationLoading = startLoading();
  },
  onEnd() {
    finishNavigationLoading?.();
    finishNavigationLoading = undefined;
  },
  // A navigation closes the open drawer, shows the new page from its top and announces it.
  async onNavigate(to, from) {
    panels.closeDrawer();
    await nextTick();

    scrollContent(to, from);
    if (to.path !== from.path) announcePage();
  },
});

// Applies the stored theme preference to the document.
useTheme();

provideFutureFlags(() => ({ all: true, ...props.future }));

defineExpose({
  isMobile,
  isOpen: panels.isOpen,
  open: panels.open,
  close: panels.close,
  toggle: panels.toggle,
  startLoading,
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
  column-gap: var(--scale-size-8);
  min-width: 0;
  padding-inline: var(--scale-size-8);
}

.mt-app__header--with-triggers {
  min-height: var(--scale-size-56);
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

/* the same look as the printed content */
.mt-app--frameless .mt-app__body {
  padding: 0;
}

.mt-app--frameless .mt-app__content {
  border: 0;
  border-radius: var(--border-radius-none);
}

.mt-app__header[hidden],
.mt-app__header-content[hidden] {
  display: none;
}

.mt-app__loading-bar {
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 2;
  height: var(--scale-size-2);
  overflow: hidden;
}

.mt-app__loading-bar::before {
  content: "";
  position: absolute;
  inset-block: 0;
  width: 40%;
  background-color: var(--color-interaction-primary-default);
  animation: mt-app-loading 1.2s ease-in-out infinite;
}

@keyframes mt-app-loading {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(250%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mt-app__loading-bar::before {
    width: 100%;
    animation: none;
  }
}

.mt-app__skip {
  position: absolute;
  inset-block-start: var(--scale-size-8);
  inset-inline-start: var(--scale-size-8);
  z-index: 1;
}

.mt-app__skip:not(:focus-within),
.mt-app__announcer {
  width: var(--scale-size-1);
  height: var(--scale-size-1);
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.mt-app__announcer {
  position: absolute;
}

/*
 * Until the app has mounted, the layout is unknown (see isMounted). Hide the inline
 * panels below the default breakpoint so small screens don't show them before the
 * drawers take over. Custom breakpoints only apply once the app has mounted.
 */
@media (width < 1280px) {
  .mt-app--responsive:not([data-layout]) :deep(.mt-app__region) {
    display: none;
  }
}

@media print {
  .mt-app {
    height: auto;
  }

  .mt-app__skip,
  .mt-app__header,
  .mt-app__loading-bar {
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
