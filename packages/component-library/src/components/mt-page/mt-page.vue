<template>
  <div
    ref="root"
    class="mt-page"
    :class="{
      'mt-page--responsive': breakpoint > 0,
      'mt-page--header-border': closable || hasSlot('start') || hasSlot('end') || hasAppTriggers(),
    }"
    :data-layout="isMeasured ? (isMobile ? 'mobile' : 'desktop') : undefined"
  >
    <!-- Outside the header, so the page keeps its heading when the header is left out. -->
    <h1 v-if="title" class="visually-hidden">{{ title }}</h1>

    <header
      v-if="hasHeader()"
      class="mt-page__header"
      :class="{
        'mt-page__header--breadcrumb-only': isBreadcrumbOnly(),
        'mt-page__header--current-only': isBreadcrumbOnly() && breadcrumb.length === 1,
      }"
    >
      <template v-if="navigationTrigger">
        <mt-panel-trigger-button
          class="mt-page__app-trigger"
          :label="navigationTrigger.label"
          :icon="navigationTrigger.icon"
          :expanded="navigationTrigger.expanded"
          :controls="navigationTrigger.controls"
          @click="navigationTrigger.toggle"
        />
        <mt-divider class="mt-page__divider" orientation="vertical" decorative />
      </template>

      <template v-if="closable">
        <mt-button
          class="mt-page__close"
          variant="tertiary"
          size="default"
          square
          :aria-label="t('closePage')"
          @click="close"
        >
          <mt-icon name="regular-times" size="var(--scale-size-16)" decorative />
        </mt-button>
        <mt-divider class="mt-page__divider" orientation="vertical" decorative />
      </template>

      <mt-panel-trigger-button
        v-if="hasTrigger('start')"
        class="mt-page__panel-trigger"
        :label="panelSettings('start').label"
        :icon="panelSettings('start').icon"
        :expanded="panels.isOpen('start')"
        :controls="panelIds.start"
        @click="panels.toggle('start')"
      />

      <mt-breadcrumb
        v-if="title"
        class="mt-page__breadcrumb"
        :items="headerCrumbs"
        :hide-current="isHeadingVisible"
      />
      <mt-skeleton-bar v-else-if="isLoading" class="mt-page__title-skeleton" aria-hidden="true" />

      <div class="mt-page__header-end">
        <div v-if="hasSlot('actions')" class="mt-page__actions">
          <slot name="actions" />
        </div>

        <mt-panel-trigger-button
          v-if="hasTrigger('end')"
          class="mt-page__panel-trigger"
          :label="panelSettings('end').label"
          :icon="panelSettings('end').icon"
          :expanded="panels.isOpen('end')"
          :controls="panelIds.end"
          @click="panels.toggle('end')"
        />

        <template v-if="sidebarTrigger">
          <mt-divider class="mt-page__divider" orientation="vertical" decorative />
          <mt-panel-trigger-button
            class="mt-page__app-trigger"
            :label="sidebarTrigger.label"
            :icon="sidebarTrigger.icon"
            :expanded="sidebarTrigger.expanded"
            :controls="sidebarTrigger.controls"
            @click="sidebarTrigger.toggle"
          />
        </template>
      </div>
    </header>

    <div class="mt-page__body">
      <mt-panel-region
        v-if="hasSlot('start')"
        :id="panelIds.start"
        place="start"
        side="start"
        :controller="regionController"
        :label="panelSettings('start').label"
        :hidden-inline="!panels.isInlineOpen('start')"
        :bordered="panelSettings('start').appearance === 'bordered'"
        :has-panel="hasPanel('start')"
      >
        <slot name="start" />
      </mt-panel-region>

      <div
        ref="content"
        class="mt-page__content"
        :class="{ 'mt-page__content--inset': inset }"
        tabindex="-1"
        :aria-busy="isLoading || undefined"
      >
        <mt-container v-if="width !== 'full'" :width="width">
          <slot />
        </mt-container>
        <slot v-else />
      </div>

      <mt-panel-region
        v-if="hasSlot('end')"
        :id="panelIds.end"
        place="end"
        side="end"
        :controller="regionController"
        :label="panelSettings('end').label"
        :hidden-inline="!panels.isInlineOpen('end')"
        :bordered="panelSettings('end').appearance === 'bordered'"
        :has-panel="hasPanel('end')"
      >
        <slot name="end" />
      </mt-panel-region>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUnmount,
  provide,
  ref,
  shallowRef,
  useId,
  useTemplateRef,
  watch,
} from "vue";
import { useEventListener, useResizeObserver } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import MtBreadcrumb, { type BreadcrumbItem } from "@/components/mt-breadcrumb/mt-breadcrumb.vue";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtContainer from "@/components/mt-container/mt-container.vue";
import MtDivider from "@/components/mt-divider/mt-divider.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtSkeletonBar from "@/components/mt-skeleton-bar/mt-skeleton-bar.vue";
import { appContextKey, useAppPanelTrigger } from "@/components/mt-app/_internal/mt-app-context";
import MtPanelRegion from "@/components/_internal/mt-panel-region/mt-panel-region.vue";
import MtPanelTriggerButton from "@/components/_internal/mt-panel-region/mt-panel-trigger-button.vue";
import {
  createPanelState,
  type PanelController,
} from "@/components/_internal/mt-panel-region/panel-controller";
import { usePanelSlots } from "@/components/_internal/mt-panel-region/usePanelSlots";
import { scrollToRoute, useRouteChange, useRouterBack } from "@/utils/router";
import { hasSlotContent, useRenderCache } from "@/utils/slot";
import { pageContextKey } from "./_internal/mt-page-context";
import type { MtPageContext, MtPagePanel } from "./composables/usePage";

/**
 * The frame of a page in the content of `mt-app`: a header with the breadcrumb and the actions, the
 * content, and up to two panels next to it, which become drawers in the mobile layout.
 *
 * @experimental The API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /**
     * The maximum width of the content, centered in the content area: `s` (680px), `m` (960px),
     * `l` (1280px) or `full`. The panels and the header always span the page.
     */
    width?: "s" | "m" | "l" | "full";
    /** Removes the padding around the content, for full-bleed content such as an editor canvas. */
    inset?: boolean;
    /**
     * Whether the page's data is loading. The header renders with a placeholder while the current
     * page has no label, and the content is marked busy for assistive technology.
     */
    isLoading?: boolean;
    /**
     * The trail from the root to this page, shown in the page header. The last item is the page
     * itself: its label is the page's `<h1>`. An `icon` on the first item marks the section.
     */
    breadcrumb?: BreadcrumbItem[];
    /**
     * The page width in pixels below which the panels become drawers. `0` keeps them next to the
     * content.
     */
    breakpoint?: number;
    /**
     * Shows a close button at the start of the header, for full-screen views that hide the
     * navigation of the shell. It goes back to the previous page, or up the breadcrumb when the
     * page was opened directly. Listen to `close` to handle it yourself, for example without
     * Vue Router.
     */
    closable?: boolean;
  }>(),
  {
    width: "full",
    inset: false,
    isLoading: false,
    breadcrumb: () => [],
    breakpoint: 960,
    closable: false,
  },
);

const emit = defineEmits<{
  /** The close button was clicked. Listening replaces the navigation of the button. */
  close: [];
}>();

const slots = defineSlots<{
  /** The scrollable content of the page. */
  default?(): unknown;
  /** Buttons at the end of the page header. */
  actions?(): unknown;
  /** A panel before the content, for example a list. Becomes a drawer in the mobile layout. */
  start?(): unknown;
  /** A panel after the content, for example properties. Becomes a drawer in the mobile layout. */
  end?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: {
      start: "Start panel",
      end: "End panel",
      closePage: "Close",
    },
    de: {
      start: "Startbereich",
      end: "Endbereich",
      closePage: "Schließen",
    },
  },
});

const PANELS = ["start", "end"] as const;

// Below this page width, such as on phones, the content gets a smaller padding and the header shows
// only the current page.
const COMPACT_WIDTH = 640;

const app = inject(appContextKey, null);
const navigationTrigger = useAppPanelTrigger(() => "navigation");
const sidebarTrigger = useAppPanelTrigger(() => "sidebar");
const instance = getCurrentInstance();
const goBack = useRouterBack();

const rootElement = useTemplateRef<HTMLElement>("root");
const contentElement = useTemplateRef<HTMLElement>("content");
const panelIds: Record<MtPagePanel, string> = { start: useId(), end: useId() };

// The page width is unknown on the server and until the first measurement, so the mobile layout
// only applies after it: the server markup and the first client render then agree.
const pageWidth = ref<number | null>(null);
// While a panel of the shell is resized, the page keeps its layout, so its panels don't turn into
// drawers and back during the drag.
const mobileWhileResizing = shallowRef<boolean | null>(null);
const heading = shallowRef<HTMLElement | null>(null);
const isHeadingVisible = ref(false);

const isMeasured = computed(() => pageWidth.value !== null);
const isMeasuredMobile = computed(
  () => pageWidth.value !== null && props.breakpoint > 0 && pageWidth.value < props.breakpoint,
);
const isMobile = computed(() => mobileWhileResizing.value ?? isMeasuredMobile.value);
const isCompact = computed(() => pageWidth.value !== null && pageWidth.value < COMPACT_WIDTH);

/** The label of the current page, the last item of the breadcrumb. */
const title = computed(() => props.breadcrumb.at(-1)?.label ?? "");

/** A compact page has no room for the trail, only for the current page. */
const headerCrumbs = computed(() =>
  isCompact.value ? props.breadcrumb.slice(-1) : props.breadcrumb,
);

const { panelSlot, panelSettings, hasPanel, registerPanelOptions } = usePanelSlots(
  PANELS,
  (panel) => slots[panel]?.(),
  (panel) => t(panel),
);

const panels = createPanelState<MtPagePanel>({
  isDrawer: isMobile,
  hasContent: hasSlot,
  canOpenDrawer: hasSlot,
  startsOpen: (panel) => panelSlot(panel).options?.open,
});

const api: MtPageContext = {
  isMobile,
  isOpen: panels.isOpen,
  open: panels.open,
  close: panels.close,
  toggle: panels.toggle,
};

const renderedSlots = useRenderCache(() => ({ actions: hasSlotContent(slots.actions) }));

function hasSlot(name: MtPagePanel | "actions") {
  return name === "actions" ? renderedSlots().actions : panelSlot(name).isFilled;
}

/** A panel's trigger shows in the mobile layout, and in the desktop layout for a closable panel. */
function hasTrigger(panel: MtPagePanel) {
  return hasSlot(panel) && (isMobile.value || panelSettings(panel).closable);
}

/**
 * Whether the header shows a trigger of the shell. They move to the shell's header while a
 * component there, such as `mt-app-header`, shows them, and step back for an `mt-app-panel-trigger`
 * that the app places itself.
 */
function hasAppTriggers() {
  return Boolean(navigationTrigger.value || sidebarTrigger.value);
}

/**
 * Whether the header shows the breadcrumb and nothing else. With a content header, which names the
 * page, the styles leave out such a header when it would only repeat that name.
 */
function isBreadcrumbOnly() {
  return (
    Boolean(title.value) &&
    !props.closable &&
    !hasSlot("actions") &&
    !PANELS.some(hasTrigger) &&
    !hasAppTriggers()
  );
}

function hasHeader() {
  return (
    props.closable ||
    props.isLoading ||
    Boolean(title.value) ||
    hasSlot("actions") ||
    PANELS.some(hasTrigger) ||
    hasAppTriggers()
  );
}

/** Leaves the page: back, or up the breadcrumb, or to the start page, unless a listener closes it. */
function close() {
  const listeners = instance?.vnode.props;

  if (listeners?.onClose || listeners?.onCloseOnce) {
    emit("close");
    return;
  }

  const parent = props.breadcrumb
    .slice(0, -1)
    .reverse()
    .find((item) => item.to !== undefined);
  goBack(parent?.to ?? "/");
}

function focusContent() {
  contentElement.value?.focus({ preventScroll: true });
}

function registerHeading(element: HTMLElement) {
  heading.value = element;

  return () => {
    if (heading.value === element) heading.value = null;
  };
}

// The header's border fades in while the content scrolls through its top padding, as
// `--mt-page-header-border` from 0 to 1. Without padding, it shows as soon as the content scrolls.
let contentPadding = 0;
let headerBorder = -1;
let headerBorderFrame = 0;

function updateHeaderBorder() {
  headerBorderFrame = 0;

  const scrollTop = contentElement.value?.scrollTop ?? 0;
  const next = contentPadding > 0 ? Math.min(scrollTop / contentPadding, 1) : Number(scrollTop > 0);

  if (next === headerBorder) return;

  headerBorder = next;
  rootElement.value?.style.setProperty("--mt-page-header-border", String(next));
}

function scheduleHeaderBorderUpdate() {
  headerBorderFrame ||= requestAnimationFrame(updateHeaderBorder);
}

useResizeObserver(rootElement, ([entry]) => {
  if (entry) pageWidth.value = entry.contentRect.width;
});

// The padding changes with the page width and with `inset`, which both resize the scroll area.
useResizeObserver(contentElement, () => {
  if (contentElement.value) {
    contentPadding = parseFloat(getComputedStyle(contentElement.value).paddingTop);
  }

  scheduleHeaderBorderUpdate();
});

useEventListener(contentElement, "scroll", scheduleHeaderBorderUpdate, { passive: true });

onBeforeUnmount(() => cancelAnimationFrame(headerBorderFrame));

// Sync, so the layout is kept from the first move on.
watch(
  () => app?.isResizing.value ?? false,
  (isResizing) => {
    mobileWhileResizing.value = isResizing ? isMeasuredMobile.value : null;
  },
  { flush: "sync" },
);

// While the heading of a content header is on screen, the breadcrumb hides its current crumb. The
// observer follows the heading's real box in the scroll area, so wrapping and resizing need no
// extra handling.
watch(
  [heading, contentElement],
  ([element, scrollArea], _, onCleanup) => {
    // Until the observer reports, a registered heading counts as on screen, so the header never
    // flashes.
    isHeadingVisible.value = element !== null;
    if (!element || !scrollArea) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1);
        if (entry) isHeadingVisible.value = entry.isIntersecting;
      },
      { root: scrollArea },
    );

    observer.observe(element);
    onCleanup(() => observer.disconnect());
  },
  { flush: "post" },
);

// Query and hash changes, such as filters in a panel, keep the drawer open.
useRouteChange({
  async onNavigate(to, from) {
    if (to.path !== from.path) panels.closeDrawer();
    await nextTick();

    scrollToRoute(contentElement.value, to, from);
  },
});

const regionController: PanelController<MtPagePanel> = {
  isDrawer: isMobile,
  isOpen: panels.isOpen,
  open: panels.open,
  close: panels.close,
  focusContent,
  registerPanelOptions,
  registerPanelOpen: panels.registerPanelOpen,
  forgetPanelOpen: panels.forgetPanelOpen,
  // Resizing a panel of the page doesn't change the page's own width, so nothing waits for it.
  setResizing: () => undefined,
};

provide(pageContextKey, { ...api, registerHeading });

defineExpose(api);
</script>

<style scoped>
.mt-page {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  width: 100%;
  height: 100%;
  container-type: inline-size;
}

.mt-page__header {
  display: flex;
  grid-row: 1;
  align-items: center;
  gap: var(--scale-size-8);
  min-width: 0;
  height: var(--scale-size-56);
  padding-inline: var(--scale-size-8);
  border-bottom: 1px solid
    color-mix(
      in srgb,
      var(--color-border-secondary-default) calc(var(--mt-page-header-border, 0) * 100%),
      transparent
    );
}

/*
 * A content header names the page, so a header that would only repeat that name is left out: with
 * only the current page in the breadcrumb, and on a compact page, which shows only the current page
 * of any breadcrumb. Decided here instead of in the script, so server-rendered pages don't show the
 * header until hydration.
 */
.mt-page:has(> .mt-page__body > .mt-page__content .mt-content-header)
  > .mt-page__header--current-only {
  display: none;
}

/* Below COMPACT_WIDTH of the script. */
@container (width < 640px) {
  .mt-page:has(> .mt-page__body > .mt-page__content .mt-content-header)
    > .mt-page__header--breadcrumb-only {
    display: none;
  }
}

/* With panels, a close button or the shell's triggers, the border is always shown. */
.mt-page--header-border .mt-page__header {
  border-bottom-color: var(--color-border-secondary-default);
}

.mt-page__close,
.mt-page__divider,
.mt-page__panel-trigger,
.mt-page__app-trigger {
  flex: none;
}

.mt-page__divider {
  height: var(--scale-size-40);
}

/* As wide as the trail, and the first to shrink and collapse when the header gets tight. */
.mt-page__breadcrumb {
  flex: 0 1 auto;
  min-width: 0;
  padding-inline-start: var(--scale-size-8);
}

/* Outranks the bar's own bottom margin for stacked bars, which would push it off center. */
.mt-page .mt-page__header .mt-page__title-skeleton {
  flex: 0 1 var(--scale-size-192);
  height: var(--font-line-height-xs);
  margin-block: 0;
  margin-inline-start: var(--scale-size-8);
}

/*
 * After a divider, the title is as far from it as the icon before it, which sits inset in its
 * square button.
 */
.mt-page__divider + .mt-page__breadcrumb {
  padding-inline-start: var(--scale-size-12);
}

.mt-page .mt-page__divider + .mt-page__title-skeleton {
  margin-inline-start: var(--scale-size-12);
}

/*
 * The end of the header takes its free space, so actions with `width: 100%` fill it, while buttons
 * sit at its end.
 */
.mt-page__header-end,
.mt-page__actions {
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: flex-end;
  gap: var(--scale-size-8);
}

.mt-page__body {
  display: grid;
  grid-row: 2;
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-rows: minmax(0, 1fr);
  min-height: 0;
  /* A panel sliding out over the page's edge adds no scrollbar around the page. */
  overflow: clip;
}

.mt-page__content {
  grid-column: 2;
  min-width: 0;
  min-height: 0;
  padding: var(--scale-size-32);
  overflow: auto;
  outline: none;
}

/* Below COMPACT_WIDTH of the script. */
@container (width < 640px) {
  .mt-page__content {
    padding: var(--scale-size-16);
  }
}

.mt-page__content--inset {
  padding: 0;
}

.mt-page__body > .mt-panel-region--start {
  grid-column: 1;
}

.mt-page__body > .mt-panel-region--end {
  grid-column: 3;
}

/* Inside the content's frame, a bordered panel is set off by a line on its inner edge. */
.mt-page__body > .mt-panel-region--start.mt-panel-region--bordered {
  border-inline-end: 1px solid var(--color-border-secondary-default);
}

.mt-page__body > .mt-panel-region--end.mt-panel-region--bordered {
  border-inline-start: 1px solid var(--color-border-secondary-default);
}

/*
 * Until the page is measured, its layout is unknown (see isMeasured). Below the default breakpoint,
 * the panels stay hidden so pages in the mobile layout don't show them before the drawers take over.
 */
@container (width < 960px) {
  .mt-page--responsive:not([data-layout]) .mt-page__body > .mt-panel-region {
    display: none;
  }
}

@media print {
  .mt-page {
    height: auto;
  }

  .mt-page__content {
    overflow: visible;
  }
}
</style>
