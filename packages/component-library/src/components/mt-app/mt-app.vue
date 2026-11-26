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

    <div v-if="hasSlot('default')" class="mt-app__skip">
      <mt-button variant="secondary" size="small" @click="focusContent">
        {{ t("skipToContent") }}
      </mt-button>
    </div>

    <Transition name="mt-app-announcement-slide" @before-leave="onAnnouncementLeave">
      <div
        v-if="hasSlot('announcement')"
        ref="announcement"
        class="mt-app__announcement"
        :hidden="hiddenRegions.announcement || undefined"
      >
        <div class="mt-app__announcement-clip">
          <div class="mt-app__announcement-content">
            <slot name="announcement" />
          </div>
        </div>
      </div>
    </Transition>

    <header
      v-if="hasSlot('header')"
      ref="header"
      class="mt-app__header"
      tabindex="-1"
      :hidden="hiddenRegions.header || undefined"
    >
      <div class="mt-app__header-content">
        <mt-app-header-region>
          <slot name="header" v-bind="headerSlotProps" />
        </mt-app-header-region>
      </div>
    </header>

    <div class="mt-app__body">
      <mt-panel-region
        v-if="hasSlot('navigation')"
        :id="panelIds.navigation"
        place="navigation"
        side="start"
        :controller="regionController"
        :label="panelSettings('navigation').label"
        :hidden-inline="isHiddenInline('navigation')"
        :bordered="panelSettings('navigation').appearance === 'bordered'"
        :has-panel="hasPanel('navigation')"
      >
        <slot name="navigation" />
      </mt-panel-region>

      <main
        v-if="hasSlot('default')"
        ref="main"
        class="mt-app__content"
        tabindex="-1"
        :aria-busy="isBusy || undefined"
      >
        <slot />
      </main>

      <mt-panel-region
        v-if="hasSlot('sidebar')"
        :id="panelIds.sidebar"
        place="sidebar"
        side="end"
        :controller="regionController"
        :label="panelSettings('sidebar').label"
        :hidden-inline="isHiddenInline('sidebar')"
        :bordered="panelSettings('sidebar').appearance === 'bordered'"
        :has-panel="hasPanel('sidebar')"
      >
        <slot name="sidebar" />
      </mt-panel-region>
    </div>

    <span class="visually-hidden" aria-live="polite" aria-atomic="true">{{
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
  onMounted,
  onUpdated,
  provide,
  ref,
  shallowRef,
  useId,
  useTemplateRef,
  watch,
} from "vue";
import { defaultWindow, useEventListener, useMediaQuery, useMounted } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtModal from "@/components/mt-modal/mt-modal.vue";
import MtModalAction from "@/components/mt-modal/sub-components/mt-modal-action.vue";
import MtModalClose from "@/components/mt-modal/sub-components/mt-modal-close.vue";
import MtModalRoot from "@/components/mt-modal/sub-components/mt-modal-root.vue";
import MtSnackbar from "@/components/mt-snackbar/mt-snackbar.vue";
import MtText from "@/components/mt-text/mt-text.vue";
import MtPanelRegion from "@/components/_internal/mt-panel-region/mt-panel-region.vue";
import {
  createPanelState,
  type PanelController,
} from "@/components/_internal/mt-panel-region/panel-controller";
import { usePanelSlots } from "@/components/_internal/mt-panel-region/usePanelSlots";
import { provideFutureFlags, type FutureFlagsInput } from "@/composables/useFutureFlags";
import { useTheme } from "@/composables/useTheme";
import { scrollToRoute, useMatchedRouteMeta, useRouteChange, useRouteGuard } from "@/utils/router";
import { warn } from "@/utils/log";
import { hasSlotContent, useRenderCache } from "@/utils/slot";
import { appContextKey } from "./_internal/mt-app-context";
import MtAppHeaderRegion from "./_internal/mt-app-header-region.vue";
import { createAppLoading } from "./composables/createAppLoading";
import { createAppRegions } from "./composables/createAppRegions";
import { createAppTriggers } from "./composables/createAppTriggers";
import { createAppUnsavedChanges } from "./composables/createAppUnsavedChanges";
import type { MtAppContext, MtAppPanel } from "./composables/useApp";
import type { MtAppRegions } from "./composables/useAppRegions";

/**
 * The root shell of a standalone application: an announcement, a header or the navigation, the
 * content and a sidebar, whose panels become drawers on small screens. Use one shell per application.
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
     * navigations don't flash it, and stays for at least 500ms once shown. A navigation counts
     * from the shell's own guard on, so global guards that the app registers before it are not
     * part of it.
     */
    loadingBar?: boolean;
  }>(),
  {
    future: undefined,
    breakpoint: 1280,
    loadingBar: false,
  },
);

type HeaderSlotProps = Omit<MtAppContext, "isMobile"> & { isMobile: boolean };

const slots = defineSlots<{
  /**
   * A full-width strip above the header for messages about the whole application, such as planned
   * downtime or an upcoming event. Not for alerts, which belong in the content of their page.
   */
  announcement?(): unknown;
  /**
   * The header bar of the application. A component in it that shows the triggers of the navigation
   * and the sidebar, such as `mt-app-header`, shows them instead of the pages. The shell shows no
   * triggers of its own. Fill either the header or the navigation, not both.
   */
  header?(props: HeaderSlotProps): unknown;
  /** The scrollable main content. */
  default?(): unknown;
  /**
   * The navigation. Becomes a drawer in the mobile layout. Fill either the header or the
   * navigation, not both.
   */
  navigation?(): unknown;
  /** A panel next to the content, for example an assistant. Becomes a drawer in the mobile layout. */
  sidebar?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: {
      navigation: "Navigation",
      sidebar: "Sidebar",
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
      skipToContent: "Zum Inhalt springen",
      loading: "Wird geladen",
      discardTitle: "Ungespeicherte Änderungen verwerfen?",
      discardText: "Deine Änderungen auf dieser Seite gehen verloren.",
      keepEditing: "Weiter bearbeiten",
      discardChanges: "Änderungen verwerfen",
    },
  },
});

const PANELS = ["navigation", "sidebar"] as const;

const announcementElement = useTemplateRef<HTMLElement>("announcement");
const headerElement = useTemplateRef<HTMLElement>("header");
const mainElement = useTemplateRef<HTMLElement>("main");
const panelIds: Record<MtAppPanel, string> = { navigation: useId(), sidebar: useId() };

// The viewport is unknown on the server, so the mobile layout only applies after mounting: the
// server markup and the first client render then agree.
const isMounted = useMounted();
const matchesBreakpoint = useMediaQuery(() => `(width < ${props.breakpoint}px)`);
const isMobile = computed(() => isMounted.value && matchesBreakpoint.value);
const isResizing = shallowRef(false);
const pageAnnouncement = ref("");
let announcedTitle = "";

const { hidden: hiddenRegions, registerRegions } = createAppRegions();
const { isLoading, isPending, startLoading } = createAppLoading();
const { showsTrigger, registerHeaderTrigger, registerPlacedTrigger } = createAppTriggers(
  () => !hiddenRegions.value.header,
);
const {
  hasUnsavedChanges,
  isConfirmingLeave,
  registerUnsavedChanges,
  confirmLeave,
  guardNavigation,
  answerLeave,
} = createAppUnsavedChanges();

const { panelSlot, panelSettings, hasPanel, registerPanelOptions } = usePanelSlots(
  PANELS,
  (panel) => slots[panel]?.(),
  (panel) => t(panel),
);

const panels = createPanelState<MtAppPanel>({
  isDrawer: isMobile,
  hasContent: hasSlot,
  canOpenDrawer: isAvailable,
  startsOpen: (panel) => panelSlot(panel).options?.open,
});

const api: MtAppContext = {
  isMobile,
  isOpen: panels.isOpen,
  open: panels.open,
  close: panels.close,
  toggle: panels.toggle,
  confirmLeave,
};

const headerSlotProps = computed<HeaderSlotProps>(() => ({ ...api, isMobile: isMobile.value }));

const renderedSlots = useRenderCache(() => ({
  announcement: hasSlotContent(slots.announcement),
  header: hasSlotContent(slots.header, headerSlotProps.value),
  default: hasSlotContent(slots.default),
}));

const isLoadingBarShown = computed(() => props.loadingBar && isLoading.value);
// The content is busy for as long as the loading lasts, while the bar may stay a bit longer.
const isBusy = computed(() => props.loadingBar && isPending.value);

function hasSlot(name: "announcement" | "header" | "default" | MtAppPanel) {
  return name === "navigation" || name === "sidebar"
    ? panelSlot(name).isFilled
    : renderedSlots()[name];
}

/** Whether the panel can be shown: its slot is filled and no view hides it. */
function isAvailable(panel: MtAppPanel) {
  return hasSlot(panel) && !hiddenRegions.value[panel];
}

/** Whether the panel is closed or a view hides it, which doesn't depend on the layout. */
function isHiddenInline(panel: MtAppPanel) {
  return hiddenRegions.value[panel] || !panels.isInlineOpen(panel);
}

function triggerOf(panel: MtAppPanel) {
  void panelSlotChanges.value;
  const { label, icon } = panelSettings(panel);

  return { label, icon, controls: panelIds[panel] };
}

/** Whether the panel has a trigger: it is available, and it is a drawer or closable. */
function hasTrigger(panel: MtAppPanel) {
  return isAvailable(panel) && (isMobile.value || panelSettings(panel).closable);
}

/**
 * Without other slots, the content fills the shell without a frame. Otherwise only when a view
 * asks for `contentFrame: false` and nothing else is visible.
 */
function isFrameless() {
  if (!hasSlot("default")) return false;
  if (!hasSlot("header") && !PANELS.some(hasSlot)) return true;

  const isHeaderVisible = hasSlot("header") && !hiddenRegions.value.header;
  const isPanelVisible = PANELS.some(
    (panel) => hasSlot(panel) && !isMobile.value && !isHiddenInline(panel),
  );

  return hiddenRegions.value.contentFrame && !isHeaderVisible && !isPanelVisible;
}

function focusContent() {
  mainElement.value?.focus({ preventScroll: true });
}

function focusBelowAnnouncement() {
  if (headerElement.value && !hiddenRegions.value.header) {
    headerElement.value.focus({ preventScroll: true });
  } else {
    focusContent();
  }
}

/** The closed announcement stays while it slides out, so the region below takes over its focus at once. */
function onAnnouncementLeave(element: Element) {
  if (element.contains(document.activeElement)) focusBelowAnnouncement();
  (element as HTMLElement).inert = true;
}

/** Closing the confirmation in any other way than discarding keeps the changes. */
function onLeaveDialogChange(open: boolean) {
  if (!open) answerLeave(false);
}

/** Tells screen readers that a new page is shown, as they hear after a full page load. */
function announcePage() {
  if (document.title === announcedTitle) return;

  announcedTitle = document.title;
  pageAnnouncement.value = document.title;
}

// The components that show the panels' triggers read them while they render, after the shell.
// When a later render of the shell changes its panel slots, this makes them render again.
const panelSlotChanges = shallowRef(0);
let renderedPanelSlots = "";

function trackPanelSlots() {
  const current = JSON.stringify(PANELS.map(panelSlot));

  if (renderedPanelSlots && current !== renderedPanelSlots) panelSlotChanges.value++;
  renderedPanelSlots = current;
}

onMounted(trackPanelSlots);
onUpdated(trackPanelSlots);

// An app has either a header or a navigation. With both, the shell still renders both and warns.
function warnAboutHeaderAndNavigation() {
  if (!hasSlot("header") || !hasSlot("navigation")) return;

  warn("mt-app", "The header and navigation slots are both filled. Use either one, not both.");
}

onMounted(warnAboutHeaderAndNavigation);
onUpdated(warnAboutHeaderAndNavigation);

watch(hiddenRegions, (hidden) => {
  const drawer = panels.drawer.value;
  if (drawer && hidden[drawer]) panels.closeDrawer();
});

watch(
  () => [hiddenRegions.value.announcement, hiddenRegions.value.header],
  ([announcementHidden, headerHidden]) => {
    const active = document.activeElement;

    if (headerHidden && headerElement.value?.contains(active)) {
      nextTick(focusContent);
    } else if (announcementHidden && announcementElement.value?.contains(active)) {
      nextTick(focusBelowAnnouncement);
    }
  },
);

// The meta applies as soon as a navigation is confirmed, before the new page renders, so the
// regions don't flicker during page transitions.
const matchedRouteMeta = useMatchedRouteMeta();
registerRegions(() =>
  Object.assign(
    {},
    ...matchedRouteMeta.value.map((meta) => meta.mtAppRegions as MtAppRegions | undefined),
  ),
);

// Before the guard that starts the loading bar, so the bar doesn't run during the confirmation.
useRouteGuard(guardNavigation);

// Only while there are unsaved changes, so the page can stay in the back/forward cache otherwise.
useEventListener(
  () => (hasUnsavedChanges.value ? defaultWindow : undefined),
  "beforeunload",
  (event: BeforeUnloadEvent) => event.preventDefault(),
);

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
  async onNavigate(to, from) {
    panels.closeDrawer();
    await nextTick();

    scrollToRoute(mainElement.value, to, from);
    if (to.path !== from.path) announcePage();
  },
});

onMounted(() => {
  announcedTitle = document.title;
});

const regionController: PanelController<MtAppPanel> = {
  isDrawer: isMobile,
  isOpen: panels.isOpen,
  open: panels.open,
  close: panels.close,
  focusContent,
  registerPanelOptions,
  registerPanelOpen: panels.registerPanelOpen,
  setResizing(resizing) {
    isResizing.value = resizing;
  },
};

provide(appContextKey, {
  ...api,
  startLoading,
  registerRegions,
  registerUnsavedChanges,
  registerHeaderTrigger,
  registerPlacedTrigger,
  triggerOf,
  panelTrigger(panel, region) {
    // Read first, so a component that shows no trigger yet still renders again when a panel slot
    // changes.
    void panelSlotChanges.value;
    if (!hasTrigger(panel) || !showsTrigger(panel, region)) return undefined;

    return triggerOf(panel);
  },
  isResizing,
});

useTheme();

provideFutureFlags(() => ({ all: true, ...props.future }));

defineExpose(api);
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

.mt-app__announcement {
  display: grid;
  grid-template-rows: 1fr;
  flex: none;
  min-width: 0;
}

.mt-app__announcement-clip {
  min-height: 0;
}

/* An announcement that arrives after the page has loaded slides down and pushes the header down
   with it. Closing it slides it up, a bit faster. */
.mt-app-announcement-slide-enter-active,
.mt-app-announcement-slide-leave-active {
  transition: grid-template-rows 200ms cubic-bezier(0.3, 0, 0, 1);

  & .mt-app__announcement-clip {
    overflow: hidden;
  }

  & .mt-app__announcement-content {
    transition: transform 200ms cubic-bezier(0.3, 0, 0, 1);
  }
}

.mt-app-announcement-slide-leave-active,
.mt-app-announcement-slide-leave-active .mt-app__announcement-content {
  transition-duration: 150ms;
}

.mt-app-announcement-slide-enter-from,
.mt-app-announcement-slide-leave-to {
  grid-template-rows: 0fr;

  & .mt-app__announcement-content {
    transform: translateY(-100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mt-app-announcement-slide-enter-active,
  .mt-app-announcement-slide-leave-active,
  .mt-app-announcement-slide-enter-active .mt-app__announcement-content,
  .mt-app-announcement-slide-leave-active .mt-app__announcement-content {
    transition: none;
  }
}

.mt-app__header {
  display: flex;
  flex: none;
  align-items: center;
  min-width: 0;
  padding-inline: var(--scale-size-4);
  outline: none;
}

/* Centered rather than stretched, so the content keeps its own height, also with `height: 100%`. */
.mt-app__header-content {
  flex: 1 1 auto;
  min-width: 0;
  overflow-x: clip;
}

.mt-app__announcement[hidden],
.mt-app__header[hidden] {
  display: none;
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

.mt-app__header:not([hidden]) + .mt-app__body {
  padding-block-start: 0;
}

.mt-app__content {
  flex: 1 1 0;
  min-width: 0;
  min-height: 0;
  overflow: auto;
  outline: none;
}

.mt-app__content,
.mt-app__body > .mt-panel-region--bordered {
  background-color: var(--color-elevation-surface-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
}

/*
 * Next to a plain panel, the nearest visible edge is the content frame's border, one gap away, so
 * the resize handle of an mt-panel moves onto it.
 */
.mt-app__body > .mt-panel-region:not(.mt-panel-region--bordered) {
  --mt-panel-edge-offset: var(--mt-app-gap);
}

/* The same look as the printed content. */
.mt-app--frameless .mt-app__body {
  padding: 0;
}

.mt-app--frameless .mt-app__content {
  border: 0;
  border-radius: var(--border-radius-none);
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

.mt-app__skip:not(:focus-within) {
  width: var(--scale-size-1);
  height: var(--scale-size-1);
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/*
 * Until the app has mounted, the layout is unknown (see isMounted). Below the default breakpoint,
 * the panels stay hidden so small screens don't show them before the drawers take over.
 */
@media (width < 1280px) {
  .mt-app--responsive:not([data-layout]) .mt-app__body > .mt-panel-region {
    display: none;
  }
}

@media print {
  .mt-app {
    height: auto;
  }

  .mt-app__skip,
  .mt-app__announcement,
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
 * The document never scrolls while a shell is mounted, only its content does, also when body-level
 * overlays (such as a date picker menu) reach beyond the viewport.
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
