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

    <header
      v-if="hasSlot('header') || hasHeaderTriggers()"
      class="mt-app__header"
      :class="{ 'mt-app__header--with-triggers': hasHeaderTriggers() }"
      :hidden="(hiddenRegions.header && !hasHeaderTriggers()) || undefined"
    >
      <mt-panel-trigger-button
        v-if="hasHeaderTrigger('navigation')"
        class="mt-app__trigger"
        :label="panelSettings('navigation').label"
        :icon="panelSettings('navigation').icon"
        :expanded="panels.isOpen('navigation')"
        :controls="panelIds.navigation"
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

      <mt-panel-trigger-button
        v-if="hasHeaderTrigger('sidebar')"
        class="mt-app__trigger mt-app__trigger--sidebar"
        :label="panelSettings('sidebar').label"
        :icon="panelSettings('sidebar').icon"
        :expanded="panels.isOpen('sidebar')"
        :controls="panelIds.sidebar"
        @click="panels.toggle('sidebar')"
      />
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
import MtPanelTriggerButton from "@/components/_internal/mt-panel-region/mt-panel-trigger-button.vue";
import {
  createPanelState,
  type PanelController,
} from "@/components/_internal/mt-panel-region/panel-controller";
import { usePanelSlots } from "@/components/_internal/mt-panel-region/usePanelSlots";
import { provideFutureFlags, type FutureFlagsInput } from "@/composables/useFutureFlags";
import { useTheme } from "@/composables/useTheme";
import { scrollToRoute, useMatchedRouteMeta, useRouteChange, useRouteGuard } from "@/utils/router";
import { hasSlotContent, useRenderCache } from "@/utils/slot";
import { appContextKey } from "./_internal/mt-app-context";
import { createAppLoading } from "./composables/createAppLoading";
import { createAppRegions } from "./composables/createAppRegions";
import { createAppTriggers } from "./composables/createAppTriggers";
import { createAppUnsavedChanges } from "./composables/createAppUnsavedChanges";
import type { MtAppContext, MtAppPanel } from "./composables/useApp";
import type { MtAppRegions } from "./composables/useAppRegions";

/**
 * The root shell of a standalone application: a header, the navigation, the content and a sidebar,
 * whose panels become drawers on small screens. Use one shell per application.
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

/** Whether the navigation is shown in the desktop layout. */
const navigationOpen = defineModel<boolean>("navigationOpen", { default: true });

/** Whether the sidebar is shown in the desktop layout. */
const sidebarOpen = defineModel<boolean>("sidebarOpen", { default: true });

type HeaderSlotProps = Omit<MtAppContext, "isMobile"> & { isMobile: boolean };

const slots = defineSlots<{
  /**
   * The header bar of the application. While no page shows the triggers of the navigation and the
   * sidebar, they sit at its start and end.
   */
  header?(props: HeaderSlotProps): unknown;
  /** The scrollable main content. */
  default?(): unknown;
  /** The navigation. Becomes a drawer in the mobile layout. */
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

const headerContentElement = useTemplateRef<HTMLElement>("headerContent");
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
const { hasPageTrigger, registerTrigger } = createAppTriggers();
const {
  hasUnsavedChanges,
  isConfirmingLeave,
  registerUnsavedChanges,
  confirmLeave,
  guardNavigation,
  answerLeave,
} = createAppUnsavedChanges();

const inlineOpen = { navigation: navigationOpen, sidebar: sidebarOpen };
const panels = createPanelState({ isDrawer: isMobile, canOpenDrawer: isAvailable, inlineOpen });

const { panelSlot, panelSettings, hasPanel, registerPanelOptions } = usePanelSlots(
  PANELS,
  (panel) => slots[panel]?.(),
  (panel) => t(panel),
);

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
  header: hasSlotContent(slots.header, headerSlotProps.value),
  default: hasSlotContent(slots.default),
}));

const isLoadingBarShown = computed(() => props.loadingBar && isLoading.value);
// The content is busy for as long as the loading lasts, while the bar may stay a bit longer.
const isBusy = computed(() => props.loadingBar && isPending.value);

function hasSlot(name: "header" | "default" | MtAppPanel) {
  return name === "header" || name === "default" ? renderedSlots()[name] : panelSlot(name).isFilled;
}

/** Whether the panel can be shown: its slot is filled and no view hides it. */
function isAvailable(panel: MtAppPanel) {
  return hasSlot(panel) && !hiddenRegions.value[panel];
}

/** Whether the panel is closed or a view hides it, which doesn't depend on the layout. */
function isHiddenInline(panel: MtAppPanel) {
  return hiddenRegions.value[panel] || !inlineOpen[panel].value;
}

/** Whether the panel has a trigger: it is available, and it is a drawer or closable. */
function hasTrigger(panel: MtAppPanel) {
  return isAvailable(panel) && (isMobile.value || panelSettings(panel).closable);
}

// Only after mounting: pages register their triggers while they render, after the header.
function hasHeaderTrigger(panel: MtAppPanel) {
  return isMounted.value && hasTrigger(panel) && !hasPageTrigger(panel);
}

function hasHeaderTriggers() {
  return PANELS.some(hasHeaderTrigger);
}

/**
 * Without other slots, the content fills the shell without a frame. Otherwise only when a view
 * asks for `contentFrame: false` and nothing else is visible.
 */
function isFrameless() {
  if (!hasSlot("default")) return false;
  if (!hasSlot("header") && !PANELS.some(hasSlot)) return true;

  const isHeaderVisible = (hasSlot("header") && !hiddenRegions.value.header) || hasHeaderTriggers();
  const isPanelVisible = PANELS.some(
    (panel) => hasSlot(panel) && !isMobile.value && !isHiddenInline(panel),
  );

  return hiddenRegions.value.contentFrame && !isHeaderVisible && !isPanelVisible;
}

function focusContent() {
  mainElement.value?.focus({ preventScroll: true });
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

// Pages read the panels' triggers while they render, after the shell. When a later render of the
// shell changes its panel slots, this makes them render again.
const panelSlotChanges = shallowRef(0);
let renderedPanelSlots = "";

function trackPanelSlots() {
  const current = JSON.stringify(PANELS.map(panelSlot));

  if (renderedPanelSlots && current !== renderedPanelSlots) panelSlotChanges.value++;
  renderedPanelSlots = current;
}

onMounted(trackPanelSlots);
onUpdated(trackPanelSlots);

watch(hiddenRegions, (hidden) => {
  const drawer = panels.drawer.value;
  if (drawer && hidden[drawer]) panels.closeDrawer();
});

watch(
  () => hiddenRegions.value.header,
  (hidden) => {
    if (hidden && headerContentElement.value?.contains(document.activeElement)) {
      nextTick(focusContent);
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
  setResizing(resizing) {
    isResizing.value = resizing;
  },
};

provide(appContextKey, {
  ...api,
  startLoading,
  registerRegions,
  registerUnsavedChanges,
  registerTrigger,
  panelTrigger(panel) {
    void panelSlotChanges.value;
    if (!hasTrigger(panel)) return undefined;

    const { label, icon } = panelSettings(panel);
    return { label, icon, controls: panelIds[panel] };
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

.mt-app__header[hidden],
.mt-app__header-content[hidden] {
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
  border-radius: var(--border-radius-card);
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
