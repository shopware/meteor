<template>
  <div
    ref="root"
    class="mt-page"
    :class="{ 'mt-page--responsive': breakpoint > 0 }"
    :data-layout="isMeasured ? (isNarrow ? 'narrow' : 'wide') : undefined"
  >
    <header
      v-if="title || hasSlot('actions') || showTrigger('start') || showTrigger('end')"
      class="mt-page__header"
    >
      <mt-app-trigger
        v-if="showTrigger('start')"
        panel="start"
        :label="t('open', { label: labels.start })"
        :expanded="panels.isOpen('start')"
        :controls="drawerIds.start"
        icon="regular-panel-left"
        @click="panels.toggle('start')"
      />

      <mt-text v-if="title" as="h1" size="s" weight="semibold" class="mt-page__title">
        {{ title }}
      </mt-text>

      <div v-if="hasSlot('actions')" class="mt-page__actions">
        <slot name="actions" />
      </div>

      <mt-app-trigger
        v-if="showTrigger('end')"
        panel="end"
        :label="t('open', { label: labels.end })"
        :expanded="panels.isOpen('end')"
        :controls="drawerIds.end"
        icon="regular-panel-right"
        @click="panels.toggle('end')"
      />
    </header>

    <div class="mt-page__body">
      <mt-app-region
        v-if="hasSlot('start')"
        :id="drawerIds.start"
        ref="startRegion"
        panel="start"
        :controller="controller"
        as="section"
        side="start"
        :label="labels.start"
        :close-label="t('close', { label: labels.start })"
      >
        <slot name="start" />
      </mt-app-region>

      <div class="mt-page__content">
        <slot />
      </div>

      <mt-app-region
        v-if="hasSlot('end')"
        :id="drawerIds.end"
        ref="endRegion"
        panel="end"
        :controller="controller"
        as="section"
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
import { computed, inject, nextTick, onBeforeUpdate, ref, useId, useTemplateRef, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import MtText from "@/components/mt-text/mt-text.vue";
import MtAppRegion from "@/components/mt-app/_internal/mt-app-region.vue";
import MtAppTrigger from "@/components/mt-app/_internal/mt-app-trigger.vue";
import { appContextKey } from "@/components/mt-app/composables/useAppContext";
import { useAppPanels, type PanelController } from "@/components/mt-app/composables/useAppPanels";
import { hasSlotContent } from "@/utils/slot";

type PagePane = "start" | "end";

/**
 * The frame of a page in the content of `mt-app`: a header with the title and the actions, the
 * content, and up to two panes next to it. The page fills the content area, and the content and
 * each pane scroll on their own while the header stays in place.
 *
 * - A pane is as wide as its content, so give the slot content a fixed width.
 * - Below the breakpoint, measured on the page and not on the viewport, the panes become drawers
 *   that open from triggers in the page header.
 * - The page doesn't pad its content. Use `mt-container` inside of it for a maximum width.
 *
 * @experimental Not for public use yet: undocumented, and it may change or be removed without notice.
 */
const props = withDefaults(
  defineProps<{
    /** The title of the page, shown as its `<h1>` in the page header. */
    title?: string;
    /** The accessible name of the start pane, its drawer and its trigger. Defaults to "Start panel". */
    startLabel?: string;
    /** The accessible name of the end pane, its drawer and its trigger. Defaults to "End panel". */
    endLabel?: string;
    /**
     * The page width in pixels below which the panes become drawers. `0` keeps them next to the
     * content.
     */
    breakpoint?: number;
  }>(),
  {
    title: undefined,
    startLabel: undefined,
    endLabel: undefined,
    breakpoint: 960,
  },
);

const slots = defineSlots<{
  /** The scrollable content of the page. */
  default?(): unknown;
  /** Buttons at the end of the page header. */
  actions?(): unknown;
  /** A pane before the content, for example a list. Becomes a drawer on a narrow page. */
  start?(): unknown;
  /** A pane after the content, for example properties. Becomes a drawer on a narrow page. */
  end?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: {
      start: "Start panel",
      end: "End panel",
      open: "Open {label}",
      close: "Close {label}",
    },
    de: {
      start: "Startbereich",
      end: "Endbereich",
      open: "{label} öffnen",
      close: "{label} schließen",
    },
  },
});

const labels = computed<Record<PagePane, string>>(() => ({
  start: props.startLabel ?? t("start"),
  end: props.endLabel ?? t("end"),
}));

const rootElement = useTemplateRef<HTMLElement>("root");
const regionElements = {
  start: useTemplateRef<InstanceType<typeof MtAppRegion>>("startRegion"),
  end: useTemplateRef<InstanceType<typeof MtAppRegion>>("endRegion"),
};

const drawerIds: Record<PagePane, string> = { start: useId(), end: useId() };

// The page width is unknown on the server and until the first measurement, so the narrow layout
// only applies after it: the server markup and the first client render then agree.
const width = ref<number | null>(null);

useResizeObserver(rootElement, ([entry]) => {
  if (entry) width.value = entry.contentRect.width;
});

const isMeasured = computed(() => width.value !== null);
const isNarrow = computed(
  () => width.value !== null && props.breakpoint > 0 && width.value < props.breakpoint,
);

// Detecting empty slots renders them, so their presence is evaluated once per render.
let slotPresence: Record<PagePane | "actions", boolean> | undefined;

onBeforeUpdate(() => {
  slotPresence = undefined;
});

function hasSlot(name: PagePane | "actions") {
  slotPresence ??= {
    actions: hasSlotContent(slots.actions),
    start: hasSlotContent(slots.start),
    end: hasSlotContent(slots.end),
  };

  return slotPresence[name];
}

function showTrigger(pane: PagePane) {
  return isNarrow.value && hasSlot(pane);
}

const panels = useAppPanels<PagePane>({
  isMobile: isNarrow,
  canOpenDrawer: hasSlot,
  desktopState: { start: ref(true), end: ref(true) },
});

const app = inject(appContextKey, null);

/** Moves the focus to the content of the surrounding shell. */
function focusContent() {
  app?.focusContent();
}

const controller: PanelController = {
  isMobile: isNarrow,
  isOpen: panels.isOpen,
  open: panels.open,
  close: panels.close,
  focusContent,
};

// A pane that moves between the page and its drawer while it holds the focus would leave the
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
  height: var(--scale-size-64);
  padding-inline: var(--scale-size-12);
  border-bottom: 1px solid var(--color-border-secondary-default);
}

.mt-page__title {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  padding-inline-start: var(--scale-size-8);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mt-page__actions {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--scale-size-8);
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
  overflow: auto;
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
 * Until the page is measured, its layout is unknown (see isMeasured). Hide the panes below the
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
