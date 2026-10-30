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
        :aria-label="t('open', { label: labels.start })"
        :aria-expanded="panels.isOpen('start') ? 'true' : 'false'"
        :aria-controls="drawerIds.start"
        @click="panels.toggle('start')"
      >
        <mt-icon name="regular-panel-left" size="var(--scale-size-16)" decorative />
      </mt-button>

      <template v-if="title">
        <h1 class="visually-hidden">{{ title }}</h1>
        <mt-breadcrumb
          class="mt-page__breadcrumb"
          size="xs"
          :items="breadcrumb"
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
        :aria-label="t('open', { label: labels.end })"
        :aria-expanded="panels.isOpen('end') ? 'true' : 'false'"
        :aria-controls="drawerIds.end"
        @click="panels.toggle('end')"
      >
        <mt-icon name="regular-panel-right" size="var(--scale-size-16)" decorative />
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
        :label="labels.start"
        :close-label="t('close', { label: labels.start })"
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
        :label="labels.end"
        :close-label="t('close', { label: labels.end })"
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
  shallowRef,
  useId,
  useTemplateRef,
  watch,
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
import { pageContextKey } from "./_internal/mt-page-context";

type PagePanel = "start" | "end";

/**
 * The frame of a page in the content of `mt-app`: a header with the breadcrumb and the actions, the
 * content, and up to two panels next to it. The page fills the content area, and the content and
 * each panel scroll on their own while the header stays in place.
 *
 * - A panel is as wide as its content, so give the slot content a fixed width.
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
    /** The accessible name of the start panel's drawer and its trigger. Defaults to "Start panel". */
    startLabel?: string;
    /** The accessible name of the end panel's drawer and its trigger. Defaults to "End panel". */
    endLabel?: string;
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
    startLabel: undefined,
    endLabel: undefined,
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

const labels = computed<Record<PagePanel, string>>(() => ({
  start: props.startLabel ?? t("start"),
  end: props.endLabel ?? t("end"),
}));

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

const isMeasured = computed(() => pageWidth.value !== null);
const isNarrow = computed(
  () => pageWidth.value !== null && props.breakpoint > 0 && pageWidth.value < props.breakpoint,
);

// Detecting empty slots renders them, so their presence is evaluated once per render.
let slotPresence: Record<PagePanel | "actions", boolean> | undefined;

onBeforeUpdate(() => {
  slotPresence = undefined;
});

function hasSlot(name: PagePanel | "actions") {
  slotPresence ??= {
    actions: hasSlotContent(slots.actions),
    start: hasSlotContent(slots.start),
    end: hasSlotContent(slots.end),
  };

  return slotPresence[name];
}

function showTrigger(panel: PagePanel) {
  return isNarrow.value && hasSlot(panel);
}

const panels = useAppPanels<PagePanel>({
  isMobile: isNarrow,
  canOpenDrawer: hasSlot,
  desktopState: { start: ref(true), end: ref(true) },
});

const app = inject(appContextKey, null);
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
  gap: var(--scale-size-12);
  min-width: 0;
  height: var(--scale-size-64);
  padding-inline: var(--scale-size-12);
  border-bottom: 1px solid
    color-mix(
      in srgb,
      var(--color-border-secondary-default) calc(var(--mt-page-header-border, 0) * 100%),
      transparent
    );
}

/*
 * The border always separates the header from the panels, and the divider of the close button
 * ends on it.
 */
.mt-page--header-border .mt-page__header {
  border-bottom-color: var(--color-border-secondary-default);
}

.mt-page__close,
.mt-page__close-divider,
.mt-page__panel-trigger {
  flex: none;
}

.mt-page__breadcrumb {
  flex: 1 1 auto;
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

.mt-page__actions {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--scale-size-8);
  margin-inline-start: auto;
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
}

.mt-page__content {
  grid-column: 2;
  min-width: 0;
  min-height: 0;
  padding: var(--scale-size-32);
  overflow: auto;
}

/* Narrow pages, such as on phones or next to an open sidebar, get a smaller padding. */
@container (width < 640px) {
  .mt-page__content {
    padding: var(--scale-size-16);
  }
}

.mt-page__content--inset {
  padding: 0;
}

.mt-page__body > :deep(.mt-app__region--start) {
  grid-column: 1;
  border-inline-end: 1px solid var(--color-border-secondary-default);
}

.mt-page__body > :deep(.mt-app__region--end) {
  grid-column: 3;
  border-inline-start: 1px solid var(--color-border-secondary-default);
}

/*
 * Until the page is measured, its layout is unknown (see isMeasured). Hide the panels below the
 * default breakpoint so narrow pages don't show them before the drawers take over. Custom
 * breakpoints only apply once the page is measured.
 */
@container (width < 960px) {
  .mt-page--responsive:not([data-layout]) .mt-page__body > :deep(.mt-app__region) {
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
