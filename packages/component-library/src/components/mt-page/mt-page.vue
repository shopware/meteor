<template>
  <div
    ref="root"
    class="mt-page"
    :class="{
      'mt-page--responsive': breakpoint > 0,
      'mt-page--header-border': closable || hasSlot('start') || hasSlot('end') || hasAppTriggers(),
    }"
    :data-layout="isMeasured ? (isNarrow ? 'narrow' : 'wide') : undefined"
  >
    <header
      v-if="
        closable ||
        isLoading ||
        title ||
        hasSlot('actions') ||
        showTrigger('start') ||
        showTrigger('end') ||
        hasAppTriggers()
      "
      class="mt-page__header"
    >
      <mt-app-panel-trigger panel="navigation" />

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
        <mt-divider class="mt-page__close-divider" orientation="vertical" decorative />
      </template>

      <mt-button
        v-if="showTrigger('start')"
        class="mt-page__panel-trigger"
        variant="tertiary"
        size="default"
        square
        :aria-label="t('open', { label: panelLabel('start') })"
        :aria-expanded="panels.isOpen('start') ? 'true' : 'false'"
        :aria-controls="drawerIds.start"
        @click="panels.toggle('start')"
      >
        <mt-icon :name="panelSettings('start').icon" size="var(--scale-size-16)" decorative />
      </mt-button>

      <template v-if="title">
        <h1 class="visually-hidden">{{ title }}</h1>
        <mt-breadcrumb
          class="mt-page__breadcrumb"
          size="xs"
          :items="headerCrumbs"
          :hide-current="isHeadingVisible"
        />
      </template>
      <mt-skeleton-bar v-else-if="isLoading" class="mt-page__title-skeleton" aria-hidden="true" />

      <div v-if="hasSlot('actions')" class="mt-page__actions">
        <slot name="actions" />
      </div>

      <mt-button
        v-if="showTrigger('end')"
        class="mt-page__panel-trigger"
        :class="{ 'mt-page__header-end': !hasSlot('actions') }"
        variant="tertiary"
        size="default"
        square
        :aria-label="t('open', { label: panelLabel('end') })"
        :aria-expanded="panels.isOpen('end') ? 'true' : 'false'"
        :aria-controls="drawerIds.end"
        @click="panels.toggle('end')"
      >
        <mt-icon :name="panelSettings('end').icon" size="var(--scale-size-16)" decorative />
      </mt-button>

      <mt-app-panel-trigger
        panel="sidebar"
        :class="{ 'mt-page__header-end': !hasSlot('actions') && !showTrigger('end') }"
      />
    </header>

    <div class="mt-page__body">
      <mt-app-region
        v-if="hasSlot('start')"
        :id="drawerIds.start"
        ref="startRegion"
        panel="start"
        :controller="controller"
        side="start"
        :label="panelLabel('start')"
        :close-label="t('close', { label: panelLabel('start') })"
        :hidden="!desktopOpen.start.value"
        :bordered="panelSettings('start').appearance === 'bordered'"
        :has-panel="hasPanel('start')"
      >
        <slot name="start" />
      </mt-app-region>

      <div
        ref="content"
        class="mt-page__content"
        :class="{ 'mt-page__content--inset': inset }"
        :aria-busy="isLoading || undefined"
      >
        <mt-container v-if="width !== 'full'" :width="width">
          <slot />
        </mt-container>
        <slot v-else />
      </div>

      <mt-app-region
        v-if="hasSlot('end')"
        :id="drawerIds.end"
        ref="endRegion"
        panel="end"
        :controller="controller"
        side="end"
        :label="panelLabel('end')"
        :close-label="t('close', { label: panelLabel('end') })"
        :hidden="!desktopOpen.end.value"
        :bordered="panelSettings('end').appearance === 'bordered'"
        :has-panel="hasPanel('end')"
      >
        <slot name="end" />
      </mt-app-region>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onBeforeUpdate,
  provide,
  ref,
  shallowReactive,
  shallowRef,
  useId,
  useTemplateRef,
  watch,
  type VNodeChild,
} from "vue";
import { useResizeObserver } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import MtBreadcrumb, { type BreadcrumbItem } from "@/components/mt-breadcrumb/mt-breadcrumb.vue";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtContainer from "@/components/mt-container/mt-container.vue";
import MtDivider from "@/components/mt-divider/mt-divider.vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtSkeletonBar from "@/components/mt-skeleton-bar/mt-skeleton-bar.vue";
import MtAppPanelTrigger from "@/components/mt-app/mt-app-panel-trigger.vue";
import MtAppRegion from "@/components/mt-app/_internal/mt-app-region.vue";
import { appContextKey } from "@/components/mt-app/composables/useAppContext";
import { useAppPanels, type PanelController } from "@/components/mt-app/composables/useAppPanels";
import { useRouterBack } from "@/components/mt-app/composables/useAppRouter";
import { hasSlotContent } from "@/utils/slot";
import {
  readPanelSlot,
  resolvePanelSettings,
  type PanelOptions,
  type PanelSlot,
} from "@/components/mt-panel/panel-settings";
import { pageContextKey } from "./_internal/mt-page-context";

type PagePanel = "start" | "end";

/**
 * The frame of a page in the content of `mt-app`: a header with the breadcrumb and the actions, the
 * content, and up to two panels next to it. The page fills the content area, and the content and
 * each panel scroll on their own while the header stays in place.
 *
 * - An `mt-panel` in the `start` or `end` slot sets the panel's label, the icon of its trigger,
 *   whether it is closable on a wide page, and its width. Without it, a panel is as wide as its
 *   content and named "Start panel" or "End panel", translated for English and German.
 * - The panels add no landmark of their own, so their slots bring one, such as an `<aside>` named
 *   after its content.
 * - Below the breakpoint, measured on the page and not on the viewport, the panels become drawers
 *   that open from triggers in the page header.
 * - Inside `mt-app`, the header also shows the triggers of the shell's navigation and sidebar: at
 *   its very start and end, each separated from the rest of the header by a divider.
 * - The content is padded, less on narrow pages. `width` limits it to a centered maximum width,
 *   and `inset` removes the padding for full-bleed content such as an editor canvas.
 * - While `isLoading`, the header renders right away, with a placeholder while the label of the
 *   current page isn't known yet, so it doesn't appear late and push the content down.
 * - `closable` adds a close button at the start of the header, for full-screen views that hide the
 *   navigation of the shell.
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
  /** A panel before the content, for example a list. Becomes a drawer on a narrow page. */
  start?(): unknown;
  /** A panel after the content, for example properties. Becomes a drawer on a narrow page. */
  end?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: {
      start: "Start panel",
      end: "End panel",
      open: "Open {label}",
      close: "Close {label}",
      closePage: "Close",
    },
    de: {
      start: "Startbereich",
      end: "Endbereich",
      open: "{label} öffnen",
      close: "{label} schließen",
      closePage: "Schließen",
    },
  },
});

/** The label of the current page, the last item of the breadcrumb. */
const title = computed(() => props.breadcrumb.at(-1)?.label ?? "");

const rootElement = useTemplateRef<HTMLElement>("root");
const contentElement = useTemplateRef<HTMLElement>("content");
const regionElements = {
  start: useTemplateRef<InstanceType<typeof MtAppRegion>>("startRegion"),
  end: useTemplateRef<InstanceType<typeof MtAppRegion>>("endRegion"),
};

const drawerIds: Record<PagePanel, string> = { start: useId(), end: useId() };

// The page width is unknown on the server and until the first measurement, so the narrow layout
// only applies after it: the server markup and the first client render then agree.
const pageWidth = ref<number | null>(null);
let updateHeaderBorder = () => {};

useResizeObserver(rootElement, ([entry]) => {
  if (entry) pageWidth.value = entry.contentRect.width;

  // The content padding depends on the page width.
  updateHeaderBorder();
});

const app = inject(appContextKey, null);

const isMeasured = computed(() => pageWidth.value !== null);
const isMeasuredNarrow = computed(
  () => pageWidth.value !== null && props.breakpoint > 0 && pageWidth.value < props.breakpoint,
);

// While a panel of the shell is resized, the page keeps its layout, so its panels don't turn into
// drawers and back during the drag. Sync, so the layout is kept from the first move on.
const narrowWhileResizing = shallowRef<boolean | null>(null);

watch(
  () => app?.isResizing.value ?? false,
  (isResizing) => {
    narrowWhileResizing.value = isResizing ? isMeasuredNarrow.value : null;
  },
  { flush: "sync" },
);

const isNarrow = computed(() => narrowWhileResizing.value ?? isMeasuredNarrow.value);

// Below this page width, such as on phones, the content gets a smaller padding (see the container
// query in the styles) and the header shows only the current page.
const COMPACT_WIDTH = 640;
const isCompact = computed(() => pageWidth.value !== null && pageWidth.value < COMPACT_WIDTH);

/** The crumbs in the header. A compact page has no room for the trail, only for the current page. */
const headerCrumbs = computed(() =>
  isCompact.value ? props.breadcrumb.slice(-1) : props.breadcrumb,
);

// Detecting empty slots renders them, so their presence is evaluated once per render. The same
// rendering shows the options of an `mt-panel` in a panel slot before anything inside renders.
let slotPresence: { actions: boolean; start: PanelSlot; end: PanelSlot } | undefined;

onBeforeUpdate(() => {
  slotPresence = undefined;
});

function getSlotPresence() {
  slotPresence ??= {
    actions: hasSlotContent(slots.actions),
    start: readPanelSlot(slots.start?.() as VNodeChild),
    end: readPanelSlot(slots.end?.() as VNodeChild),
  };

  return slotPresence;
}

function hasSlot(name: PagePanel | "actions") {
  const presence = getSlotPresence();

  return name === "actions" ? presence.actions : presence[name].isFilled;
}

// The options of `mt-panel`s inside another component, which the slot doesn't show.
const registeredPanelOptions = shallowReactive(new Map<PagePanel, () => PanelOptions>());

function registerPanelOptions(panel: PagePanel, options: () => PanelOptions) {
  registeredPanelOptions.set(panel, options);

  return () => {
    if (registeredPanelOptions.get(panel) === options) registeredPanelOptions.delete(panel);
  };
}

/** The label, the trigger icon and whether the panel is closable, with the defaults of its place. */
function panelSettings(panel: PagePanel) {
  const options = getSlotPresence()[panel].options ?? registeredPanelOptions.get(panel)?.();

  return resolvePanelSettings(panel, options, t(panel));
}

function panelLabel(panel: PagePanel) {
  return panelSettings(panel).label;
}

/** Whether an `mt-panel` holds the panel's content: in the slot, or inside another component. */
function hasPanel(panel: PagePanel) {
  return getSlotPresence()[panel].options !== undefined || registeredPanelOptions.has(panel);
}

/** A panel's trigger shows on a narrow page, and on a wide page when the panel is closable. */
function showTrigger(panel: PagePanel) {
  return hasSlot(panel) && (isNarrow.value || panelSettings(panel).closable);
}

// Whether the panels are open on a wide page. It doesn't depend on the layout, so a panel only slides
// when it opens or closes, not when the page turns narrow or wide.
const desktopOpen = { start: ref(true), end: ref(true) };

const panels = useAppPanels<PagePanel>({
  isMobile: isNarrow,
  canOpenDrawer: hasSlot,
  desktopState: desktopOpen,
});

const instance = getCurrentInstance();
const goBack = useRouterBack();

/** Whether the header shows a trigger of the surrounding shell. */
function hasAppTriggers() {
  return Boolean(app?.isTriggerShown("navigation") || app?.isTriggerShown("sidebar"));
}

/** Leaves the page: back, or up the breadcrumb, or to the start page, unless a listener closes it. */
function close() {
  if (instance?.vnode.props?.onClose) {
    emit("close");
    return;
  }

  const parent = props.breadcrumb
    .slice(0, -1)
    .reverse()
    .find((item) => item.to !== undefined);
  goBack(parent?.to ?? "/");
}

/** Moves the focus to the content of the surrounding shell. */
function focusContent() {
  app?.focusContent();
}

// A content header registers its heading. While the heading is on screen, the breadcrumb in the
// page header hides its current crumb, and shows it once the heading has scrolled under the header.
const heading = shallowRef<HTMLElement | null>(null);
const isHeadingVisible = ref(false);

function registerHeading(element: HTMLElement) {
  heading.value = element;

  return () => {
    if (heading.value === element) heading.value = null;
  };
}

provide(pageContextKey, { registerHeading });

// The observer follows the heading's real box in the scroll area, so wrapping and resizing need
// no extra handling.
watch(
  [heading, contentElement],
  ([element, root], _, onCleanup) => {
    // Until the observer reports, a registered heading counts as on screen, so the header never
    // flashes.
    isHeadingVisible.value = element !== null;
    if (!element || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1);
        if (entry) isHeadingVisible.value = entry.isIntersecting;
      },
      { root },
    );

    observer.observe(element);
    onCleanup(() => observer.disconnect());
  },
  { flush: "post" },
);

// The header's border fades in while the content scrolls through its top padding, from 0 to 1 in
// `--mt-page-header-border`. Without padding, it shows as soon as the content is scrolled.

watch(
  contentElement,
  (element, _, onCleanup) => {
    if (!element) return;

    const scrollArea: HTMLElement = element;
    let frame = 0;
    let strength = -1;

    function update() {
      frame = 0;

      const padding = parseFloat(getComputedStyle(scrollArea).paddingTop);
      const next =
        padding > 0
          ? Math.min(scrollArea.scrollTop / padding, 1)
          : Number(scrollArea.scrollTop > 0);

      if (next === strength) return;

      strength = next;
      rootElement.value?.style.setProperty("--mt-page-header-border", String(next));
    }

    function scheduleUpdate() {
      frame ||= requestAnimationFrame(update);
    }

    scrollArea.addEventListener("scroll", scheduleUpdate, { passive: true });
    updateHeaderBorder = scheduleUpdate;
    update();

    onCleanup(() => {
      scrollArea.removeEventListener("scroll", scheduleUpdate);
      cancelAnimationFrame(frame);
      updateHeaderBorder = () => {};
    });
  },
  { flush: "post" },
);

const controller: PanelController = {
  isMobile: isNarrow,
  isOpen: panels.isOpen,
  open: panels.open,
  close: panels.close,
  focusContent,
  panelLabel: (panel) => panelLabel(panel as PagePanel),
  hasPanelInSlot: (panel) => getSlotPresence()[panel as PagePanel].options !== undefined,
  registerPanelOptions: (panel, options) => registerPanelOptions(panel as PagePanel, options),
  // Resizing a panel of the page doesn't change the page's own width, so nothing waits for it.
  setResizing: () => undefined,
};

// A panel that moves between the page and its drawer while it holds the focus would leave the
// focus nowhere. Sync, so the open drawer is still known here before useAppPanels closes it.
watch(
  isNarrow,
  () => {
    const holdsFocus =
      panels.drawer.value !== null ||
      regionElements.start.value?.containsFocus() ||
      regionElements.end.value?.containsFocus();

    if (holdsFocus) nextTick(focusContent);
  },
  { flush: "sync" },
);
</script>

<style scoped>
.mt-page {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
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

/* With panels, a close button or the shell's triggers, the border is always shown. */
.mt-page--header-border .mt-page__header {
  border-bottom-color: var(--color-border-secondary-default);
}

.mt-page__close,
.mt-page__close-divider,
.mt-page__panel-trigger {
  flex: none;
}

.mt-page__close-divider {
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
 * Right after a divider, the title is as far from it as the icon before it, which sits inset in its
 * square button, so both sides of the divider look the same.
 */
.mt-page__close-divider + .visually-hidden + .mt-page__breadcrumb,
.mt-app-panel-trigger--navigation + .visually-hidden + .mt-page__breadcrumb {
  padding-inline-start: var(--scale-size-12);
}

.mt-page .mt-page__close-divider + .mt-page__title-skeleton,
.mt-page .mt-app-panel-trigger--navigation + .mt-page__title-skeleton {
  margin-inline-start: var(--scale-size-12);
}

/*
 * The actions take the free space of the header, so content with `width: 100%` fills it, while
 * buttons sit at its end. They never shrink below their content.
 */
.mt-page__actions {
  display: flex;
  flex: 1 0 auto;
  align-items: center;
  justify-content: flex-end;
  gap: var(--scale-size-8);
}

/* Without actions, the next element at the end of the header takes the free space before it. */
.mt-page__header-end {
  margin-inline-start: auto;
}

.mt-page__body {
  display: grid;
  grid-row: 2;
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-rows: minmax(0, 1fr);
  min-height: 0;
  /* A panel sliding out over the page's edge adds no scrollbar to the content around the page. */
  overflow: clip;
}

.mt-page__content {
  grid-column: 2;
  min-width: 0;
  min-height: 0;
  padding: var(--scale-size-32);
  overflow: auto;
}

/*
 * Compact pages, such as on phones or next to an open sidebar, get a smaller padding. The width is
 * COMPACT_WIDTH in the script.
 */
@container (width < 640px) {
  .mt-page__content {
    padding: var(--scale-size-16);
  }
}

.mt-page__content--inset {
  padding: 0;
}

.mt-page__body > .mt-app__region--start {
  grid-column: 1;
}

.mt-page__body > .mt-app__region--end {
  grid-column: 3;
}

/* Inside the content's frame, a bordered panel is set off by a line on its inner edge. */
.mt-page__body > .mt-app__region--start.mt-app__region--bordered {
  border-inline-end: 1px solid var(--color-border-secondary-default);
}

.mt-page__body > .mt-app__region--end.mt-app__region--bordered {
  border-inline-start: 1px solid var(--color-border-secondary-default);
}

/*
 * Until the page is measured, its layout is unknown (see isMeasured). Hide the panels below the
 * default breakpoint so narrow pages don't show them before the drawers take over. Custom
 * breakpoints only apply once the page is measured.
 */
@container (width < 960px) {
  .mt-page--responsive:not([data-layout]) .mt-page__body > .mt-app__region {
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
