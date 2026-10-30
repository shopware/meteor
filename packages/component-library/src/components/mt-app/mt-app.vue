<template>
  <div
    class="mt-app"
    :class="{ 'mt-app--responsive': breakpoint > 0, 'mt-app--frameless': isFrameless() }"
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
      v-if="hasSlot('header') || showsHeaderTriggers()"
      class="mt-app__header"
      :class="{ 'mt-app__header--with-triggers': showsHeaderTriggers() }"
      :hidden="(hiddenRegions.header && !showsHeaderTriggers()) || undefined"
    >
      <mt-button
        v-if="showsHeaderTrigger('navigation')"
        class="mt-app__trigger"
        variant="tertiary"
        size="default"
        square
        :aria-label="triggerLabel('navigation')"
        :aria-expanded="panels.isOpen('navigation') ? 'true' : 'false'"
        :aria-controls="drawerIds.navigation"
        @click="panels.toggle('navigation')"
      >
        <mt-icon :name="panelSettings('navigation').icon" size="var(--scale-size-16)" decorative />
      </mt-button>

      <div
        v-if="hasSlot('header')"
        ref="headerContent"
        class="mt-app__header-content"
        :hidden="hiddenRegions.header || undefined"
      >
        <slot name="header" v-bind="headerSlotProps" />
      </div>

      <mt-button
        v-if="showsHeaderTrigger('sidebar')"
        class="mt-app__trigger mt-app__trigger--sidebar"
        variant="tertiary"
        size="default"
        square
        :aria-label="triggerLabel('sidebar')"
        :aria-expanded="panels.isOpen('sidebar') ? 'true' : 'false'"
        :aria-controls="drawerIds.sidebar"
        @click="panels.toggle('sidebar')"
      >
        <mt-icon :name="panelSettings('sidebar').icon" size="var(--scale-size-16)" decorative />
      </mt-button>
    </header>

    <div class="mt-app__body">
      <mt-app-region
        v-if="hasSlot('navigation')"
        :id="drawerIds.navigation"
        ref="navigationRegion"
        panel="navigation"
        :controller="appContext"
        side="start"
        :label="panelLabel('navigation')"
        :close-label="t('close', { label: panelLabel('navigation') })"
        :hidden="isHiddenInline('navigation')"
        :bordered="panelSettings('navigation').appearance === 'bordered'"
        :has-panel="hasPanel('navigation')"
      >
        <slot name="navigation" v-bind="panelSlotProps('navigation')" />
      </mt-app-region>

      <main
        v-if="hasContent()"
        ref="main"
        class="mt-app__content"
        tabindex="-1"
        :aria-busy="isBusy || undefined"
      >
        <slot name="content" />
      </main>

      <mt-app-region
        v-if="hasSlot('sidebar')"
        :id="drawerIds.sidebar"
        ref="sidebarRegion"
        panel="sidebar"
        :controller="appContext"
        side="end"
        :label="panelLabel('sidebar')"
        :close-label="t('close', { label: panelLabel('sidebar') })"
        :hidden="isHiddenInline('sidebar')"
        :bordered="panelSettings('sidebar').appearance === 'bordered'"
        :has-panel="hasPanel('sidebar')"
      >
        <slot name="sidebar" v-bind="panelSlotProps('sidebar')" />
      </mt-app-region>
    </div>

    <span class="mt-app__announcer" aria-live="polite" aria-atomic="true">{{
      pageAnnouncement
    }}</span>

    <mt-snackbar />

    <!-- Rendered after mounting, because its teleports have no server markup to hydrate. -->
    <mt-modal-root v-if="isMounted" :is-open="isConfirmingLeave" @change="onLeaveDialogChange">
      <mt-modal :title="t('discardTitle')" width="s">
        <mt-text size="xs">{{ t("discardText") }}</mt-text>

        <template #footer>
          <div class="mt-app__leave-actions">
            <mt-modal-close :as="MtButton" variant="secondary" size="default">
              {{ t("keepEditing") }}
            </mt-modal-close>
            <mt-modal-action
              :as="MtButton"
              variant="critical"
              size="default"
              @click="answerLeave(true)"
            >
              {{ t("discardChanges") }}
            </mt-modal-action>
          </div>
        </template>
      </mt-modal>
    </mt-modal-root>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  provide,
  ref,
  shallowReactive,
  shallowRef,
  useId,
  useTemplateRef,
  watch,
  type VNodeChild,
} from "vue";
import { defaultWindow, useEventListener, useMediaQuery, useMounted } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtModal from "@/components/mt-modal/mt-modal.vue";
import MtModalAction from "@/components/mt-modal/sub-components/mt-modal-action.vue";
import MtModalClose from "@/components/mt-modal/sub-components/mt-modal-close.vue";
import MtModalRoot from "@/components/mt-modal/sub-components/mt-modal-root.vue";
import MtSnackbar from "@/components/mt-snackbar/mt-snackbar.vue";
import MtText from "@/components/mt-text/mt-text.vue";
import { provideFutureFlags, type FutureFlagsInput } from "@/composables/useFutureFlags";
import { useTheme } from "@/composables/useTheme";
import { hasSlotContent } from "@/utils/slot";
import {
  readPanelSlot,
  resolvePanelSettings,
  type PanelOptions,
  type PanelSlot,
} from "@/components/mt-panel/panel-settings";
import MtAppRegion from "./_internal/mt-app-region.vue";
import { appContextKey, type AppContext } from "./composables/useAppContext";
import { useAppPanels } from "./composables/useAppPanels";
import { createAppRegions } from "./composables/createAppRegions";
import { createAppTriggers } from "./composables/createAppTriggers";
import { createAppLoading } from "./composables/createAppLoading";
import { createAppUnsavedChanges } from "./composables/createAppUnsavedChanges";
import {
  useRouteChange,
  useRouteGuard,
  useRouteMeta,
  type RouteLike,
} from "./composables/useAppRouter";
import type { MtAppContext, MtAppPanel } from "./composables/useApp";
import type { MtAppRegions } from "./composables/useAppRegions";

/**
 * The root shell of a standalone Meteor application. It arranges the header, the navigation,
 * the content and the sidebar, turns the navigation and the sidebar into drawers below the
 * breakpoint, and provides the theme, the future flags and the snackbar host to
 * everything inside. Use one shell per application.
 *
 * - The navigation and the sidebar add no landmark of their own, so their slots bring one, such as
 *   `mt-nav` or an `<aside>`.
 * - An `mt-panel` in the `navigation` or `sidebar` slot sets the panel's label, the icon of its
 *   trigger, whether it is closable in the desktop layout, and its width. Without it, the panels
 *   are named "Navigation" and "Sidebar", translated for English and German.
 * - The triggers of the navigation and the sidebar sit in the header of the page, such as
 *   `mt-page`, or of a custom page with `mt-app-panel-trigger`. While no page shows them, the
 *   shell's header shows them at its start and end. They open the drawers in the mobile layout,
 *   and show and hide panels that are closable in the desktop layout.
 * - Components inside the shell, such as pages, read and control it with `useApp()`. In the
 *   component that renders `<mt-app>`, use the props of the `header` slot or a template ref.
 * - A route hides regions with `meta: { mtAppRegions: { header: false } }`, and a page toggles them
 *   with `useAppRegions()`.
 * - Views report unsaved changes with `useUnsavedChanges()`. The shell then asks whether to
 *   discard them before a navigation or a reload loses them.
 * - With Vue Router, a navigation closes the open drawer and shows the new page from its top,
 *   or from the element of its URL hash, and screen readers announce the new document title.
 *
 * @experimental The API may still change in a future release.
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
    breakpoint?: number;
    /**
     * Shows a thin loading bar along the top edge while a navigation is pending or while app code
     * reports loading with `useAppLoading()`. It appears only after 200ms, so quick
     * navigations don't flash it, and stays for at least 500ms once shown.
     */
    loadingBar?: boolean;
  }>(),
  {
    future: undefined,
    breakpoint: 1280,
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
  /**
   * The header bar of the application. While no page shows the triggers of the navigation and the
   * sidebar, they sit at its start and end.
   */
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
      discardTitle: "Discard unsaved changes?",
      discardText: "Your changes on this page will be lost.",
      keepEditing: "Keep editing",
      discardChanges: "Discard changes",
    },
    de: {
      navigation: "Navigation",
      sidebar: "Seitenleiste",
      open: "{label} öffnen",
      close: "{label} schließen",
      skipToContent: "Zum Inhalt springen",
      loading: "Wird geladen",
      discardTitle: "Ungespeicherte Änderungen verwerfen?",
      discardText: "Deine Änderungen auf dieser Seite gehen verloren.",
      keepEditing: "Weiter bearbeiten",
      discardChanges: "Änderungen verwerfen",
    },
  },
});

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
const matchesBreakpoint = useMediaQuery(() => `(width < ${props.breakpoint}px)`);
const isMobile = computed(() => isMounted.value && matchesBreakpoint.value);

const { hidden: hiddenRegions, requestRegions } = createAppRegions();

// Regions that the current route hides in its meta, which changes as soon as a navigation is
// confirmed, before the new page renders, so they don't flicker during page transitions.
const routeMeta = useRouteMeta();
requestRegions(() => (routeMeta.value.mtAppRegions ?? {}) as MtAppRegions);

const {
  hasUnsavedChanges,
  isConfirming: isConfirmingLeave,
  registerUnsavedChanges,
  confirmLeave,
  guardNavigation,
  answer: answerLeave,
} = createAppUnsavedChanges();

/** Closing the confirmation in any other way than discarding keeps the changes. */
function onLeaveDialogChange(open: boolean) {
  if (!open) answerLeave(false);
}

// Registered before the guard that starts the loading bar, so the bar doesn't run while the
// confirmation is open.
useRouteGuard(guardNavigation);

// The browser asks before a reload or closing the tab loses unsaved changes. The listener only
// exists while there are some, so it doesn't keep the page out of the back/forward cache.
useEventListener(
  () => (hasUnsavedChanges.value ? defaultWindow : undefined),
  "beforeunload",
  (event: BeforeUnloadEvent) => event.preventDefault(),
);

const { isLoading, isPending, startLoading } = createAppLoading();
const isLoadingBarShown = computed(() => props.loadingBar && isLoading.value);
// The content is busy for as long as the loading lasts, while the bar may stay a bit longer.
const isBusy = computed(() => props.loadingBar && isPending.value);

const desktopOpen = { navigation: navigationOpen, sidebar: sidebarOpen };

const panels = useAppPanels({
  isMobile,
  canOpenDrawer: isAvailable,
  desktopState: desktopOpen,
});

// Detecting empty slots renders them, so their presence is evaluated once per render. The same
// rendering shows the options of an `mt-panel` in a panel slot before anything inside renders.
let slotPresence:
  | { header: boolean; content: boolean; navigation: PanelSlot; sidebar: PanelSlot }
  | undefined;

onBeforeUpdate(() => {
  slotPresence = undefined;
});

function getSlotPresence() {
  slotPresence ??= {
    header: hasSlotContent(slots.header, headerSlotProps.value),
    navigation: readPanelSlot(slots.navigation?.(panelSlotProps("navigation")) as VNodeChild),
    sidebar: readPanelSlot(slots.sidebar?.(panelSlotProps("sidebar")) as VNodeChild),
    content: hasSlotContent(slots.content),
  };

  return slotPresence;
}

function hasSlot(name: "header" | MtAppPanel) {
  const presence = getSlotPresence();

  return name === "header" ? presence.header : presence[name].isFilled;
}

// The options of `mt-panel`s inside another component, which the slot doesn't show.
const registeredPanelOptions = shallowReactive(new Map<MtAppPanel, () => PanelOptions>());

function registerPanelOptions(panel: MtAppPanel, options: () => PanelOptions) {
  registeredPanelOptions.set(panel, options);

  return () => {
    if (registeredPanelOptions.get(panel) === options) registeredPanelOptions.delete(panel);
  };
}

/** The label, the trigger icon and whether the panel is closable, with the defaults of its place. */
function panelSettings(panel: MtAppPanel) {
  const options = getSlotPresence()[panel].options ?? registeredPanelOptions.get(panel)?.();

  return resolvePanelSettings(panel, options, t(panel));
}

function panelLabel(panel: MtAppPanel) {
  return panelSettings(panel).label;
}

/** Whether an `mt-panel` holds the panel's content: in the slot, or inside another component. */
function hasPanel(panel: MtAppPanel) {
  return getSlotPresence()[panel].options !== undefined || registeredPanelOptions.has(panel);
}

function hasContent() {
  return getSlotPresence().content;
}

/** Whether the panel can be shown: its slot is filled and no view hides it. */
function isAvailable(panel: MtAppPanel): boolean {
  return hasSlot(panel) && !hiddenRegions.value[panel];
}

/**
 * Whether the panel is open next to the content and no view hides it, which only happens in the
 * desktop layout. It doesn't probe the slot, so watchers can use it outside of rendering.
 */
function isOpenInline(panel: MtAppPanel) {
  return !isMobile.value && !hiddenRegions.value[panel] && panels.isOpen(panel);
}

/**
 * Whether the panel is closed or a view hides it, in the desktop layout. It doesn't depend on the
 * layout, so the panel only slides when it opens or closes, not when the layout switches.
 */
function isHiddenInline(panel: MtAppPanel) {
  return hiddenRegions.value[panel] || !desktopOpen[panel].value;
}

/** Whether the panel is visible next to the content. */
function isShownInline(panel: MtAppPanel) {
  return hasSlot(panel) && isOpenInline(panel);
}

/** Whether the panel has a trigger: it is available, and it is a drawer or closable. */
function hasTrigger(panel: MtAppPanel) {
  return isAvailable(panel) && (isMobile.value || panelSettings(panel).closable);
}

function triggerLabel(panel: MtAppPanel) {
  return t("open", { label: panelLabel(panel) });
}

const { isShownByPage, registerTrigger } = createAppTriggers();

/**
 * Whether the header shows the panel's trigger, because no page shows it. Only after mounting:
 * pages register their triggers while they render, after the header.
 */
function showsHeaderTrigger(panel: MtAppPanel) {
  return isMounted.value && hasTrigger(panel) && !isShownByPage(panel);
}

function showsHeaderTriggers() {
  return showsHeaderTrigger("navigation") || showsHeaderTrigger("sidebar");
}

// Pages render after the shell and read the slot presence and the panel options of the same
// render. When a later render changes them, this makes them render again.
const slotPresenceChanges = shallowRef(0);
let renderedPanels = "";

function trackSlotPresence() {
  const { navigation, sidebar } = getSlotPresence();
  const presence = JSON.stringify([navigation, sidebar]);

  if (renderedPanels && presence !== renderedPanels) slotPresenceChanges.value++;
  renderedPanels = presence;
}

const isResizing = shallowRef(false);

onMounted(trackSlotPresence);
onUpdated(trackSlotPresence);

/**
 * The content fills the shell without a frame when no other slot is filled. Regions that a view
 * hides and closed panels keep the frame, so the view looks like the others, unless the view asks
 * for `contentFrame: false`.
 */
function isFrameless() {
  if (!hasContent()) return false;
  if (!hasSlot("header") && !hasSlot("navigation") && !hasSlot("sidebar")) return true;

  const isHeaderVisible =
    (hasSlot("header") && !hiddenRegions.value.header) || showsHeaderTriggers();

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
  confirmLeave,
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

const appContext: AppContext = {
  isMobile,
  isOpen: panels.isOpen,
  open: panels.open,
  close: panels.close,
  toggle: panels.toggle,
  startLoading,
  requestRegions,
  registerUnsavedChanges,
  confirmLeave,
  focusContent,
  // Pages read these while they render. The counter is tracked, so they render again when a later
  // render of the shell changes the slot presence or the panel options.
  isTriggerShown(panel) {
    void slotPresenceChanges.value;
    return hasTrigger(panel);
  },
  triggerLabel(panel) {
    void slotPresenceChanges.value;
    return triggerLabel(panel);
  },
  triggerIcon(panel) {
    void slotPresenceChanges.value;
    return panelSettings(panel).icon;
  },
  triggerControls: (panel) => drawerIds[panel],
  registerTrigger,
  panelLabel: (panel) => panelLabel(panel as MtAppPanel),
  hasPanelInSlot: (panel) => getSlotPresence()[panel as MtAppPanel].options !== undefined,
  registerPanelOptions: (panel, options) => registerPanelOptions(panel as MtAppPanel, options),
  isResizing,
  setResizing(resizing) {
    isResizing.value = resizing;
  },
};

provide(appContextKey, appContext);

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
  confirmLeave,
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
  padding-inline: var(--scale-size-4);
}

.mt-app__header--with-triggers {
  min-height: var(--scale-size-56);
}

.mt-app__trigger {
  flex: none;
}

.mt-app__trigger--sidebar {
  margin-inline-start: auto;
}

.mt-app__header-content {
  flex: 1 1 auto;
  min-width: 0;
  overflow-x: clip;
}

.mt-app__body {
  --mt-app-gap: var(--scale-size-4);

  display: flex;
  flex: 1 1 0;
  gap: var(--mt-app-gap);
  min-height: 0;
  padding: var(--mt-app-gap);
  /* A panel sliding out over the edge doesn't show outside the shell. */
  overflow: clip;
}

/* A bordered panel is framed like the content, as a surface of its own on the shell's background. */
.mt-app__body > .mt-app__region--bordered {
  background-color: var(--color-elevation-surface-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
}

/*
 * Next to a plain panel, the nearest visible edge is the content frame's border, one gap away, so
 * the resize handle of an mt-panel moves onto it.
 */
.mt-app__body > .mt-app__region:not(.mt-app__region--bordered) {
  --mt-panel-edge-offset: var(--mt-app-gap);
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

.mt-app__leave-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--scale-size-8);
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
  .mt-app--responsive:not([data-layout]) .mt-app__body > .mt-app__region {
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
