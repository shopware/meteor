<template>
  <div ref="root" class="mt-app-header" :class="{ 'mt-app-header--mobile': isMobile }">
    <mt-panel-trigger-button
      v-if="navigationTrigger"
      :label="navigationTrigger.label"
      :icon="navigationTrigger.icon"
      :expanded="navigationTrigger.expanded"
      :controls="navigationTrigger.controls"
      @click="navigationTrigger.toggle"
    />

    <template v-if="isMobile">
      <mt-panel-trigger-button
        :label="t('navigation')"
        icon="regular-bars"
        :expanded="isDrawerOpen"
        :controls="drawerId"
        @click="isDrawerOpen = !isDrawerOpen"
      />

      <mt-drawer
        v-if="isDrawerMounted"
        :id="drawerId"
        v-model:open="isDrawerOpen"
        side="start"
        :title="t('navigation')"
      >
        <mt-app-sidebar :sections="sections" :is-active="isActive">
          <template #start>
            <slot name="start" :is-mobile="isMobile" />
          </template>

          <template #end>
            <slot name="end" :is-mobile="isMobile" />
          </template>
        </mt-app-sidebar>
      </mt-drawer>
    </template>

    <template v-else>
      <div v-if="hasSlotContent($slots.start, { isMobile })" class="mt-app-header__start">
        <slot name="start" :is-mobile="isMobile" />
      </div>

      <mt-scroll-area orientation="horizontal" class="mt-app-header__nav">
        <mt-nav orientation="horizontal" :sections="sections" :is-active="isActive" />
      </mt-scroll-area>
    </template>

    <div
      v-if="sidebarTrigger || hasSlotContent($slots.actions, { isMobile })"
      class="mt-app-header__actions"
    >
      <slot name="actions" :is-mobile="isMobile" />

      <mt-panel-trigger-button
        v-if="sidebarTrigger"
        :label="sidebarTrigger.label"
        :icon="sidebarTrigger.icon"
        :expanded="sidebarTrigger.expanded"
        :controls="sidebarTrigger.controls"
        @click="sidebarTrigger.toggle"
      />
    </div>

    <div v-if="!isMobile && hasSlotContent($slots.end, { isMobile })" class="mt-app-header__end">
      <slot name="end" :is-mobile="isMobile" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, useId, useTemplateRef, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import MtAppSidebar from "@/components/mt-app-sidebar/mt-app-sidebar.vue";
import MtNav, { type NavActiveMatcher, type NavSection } from "@/components/mt-nav/mt-nav.vue";
import MtScrollArea from "@/components/mt-scroll-area/mt-scroll-area.vue";
import MtDrawer from "@/components/_internal/mt-drawer/mt-drawer.vue";
import MtPanelTriggerButton from "@/components/_internal/mt-panel-region/mt-panel-trigger-button.vue";
import { useAppPanelTrigger } from "@/components/mt-app/_internal/mt-app-context";
import { useRouteChange } from "@/utils/router";
import { hasSlotContent } from "@/utils/slot";

/**
 * The main navigation of an application in its header: the start, the navigation, the actions and
 * the end side by side. In the mobile layout, below `breakpoint`, the start, the navigation and the end
 * move into a drawer that opens from a button, while the actions stay in the header. In the
 * `header` slot of `mt-app`, it shows the triggers of the shell's navigation at its start and of
 * the shell's sidebar after the actions, instead of the pages.
 *
 * @experimental The API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /** The sections of the navigation, each holding its items, as for `mt-nav`. */
    sections: NavSection[];
    /**
     * Tells whether an item is the current page, e.g. by comparing its route with the current
     * route. Lets the sections stay static instead of setting `active` on every route change.
     */
    isActive?: NavActiveMatcher;
    /**
     * The header width in pixels below which the start, the navigation and the end move into a
     * drawer. `0` keeps them in the header.
     */
    breakpoint?: number;
  }>(),
  {
    isActive: undefined,
    breakpoint: 1024,
  },
);

interface AppHeaderSlotProps {
  /** Whether the header uses the mobile layout, in which the navigation is in a drawer. */
  isMobile: boolean;
}

defineSlots<{
  /** The start of the header, for example `mt-brand`. Moves into the drawer in the mobile layout. */
  start?(props: AppHeaderSlotProps): unknown;
  /**
   * Buttons after the navigation, followed by the trigger of the shell's sidebar. They stay in the
   * header in the mobile layout.
   */
  actions?(props: AppHeaderSlotProps): unknown;
  /** The end of the header, for example `mt-user-menu`. Moves into the drawer in the mobile layout. */
  end?(props: AppHeaderSlotProps): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: { navigation: "Navigation" },
    de: { navigation: "Navigation" },
  },
});

const rootElement = useTemplateRef<HTMLElement>("root");
const drawerId = useId();

// Unknown until measured, so the server markup and the first client render both show the desktop
// layout.
const headerWidth = ref<number | null>(null);
const isDrawerOpen = shallowRef(false);
// The drawer mounts when it first opens. Mounted with the switch to the mobile layout, which
// happens in the ResizeObserver callback, its own observers make the browser report a loop error.
const isDrawerMounted = shallowRef(false);

const navigationTrigger = useAppPanelTrigger(() => "navigation");
const sidebarTrigger = useAppPanelTrigger(() => "sidebar");

const isMobile = computed(
  () => headerWidth.value !== null && props.breakpoint > 0 && headerWidth.value < props.breakpoint,
);

useResizeObserver(rootElement, ([entry]) => {
  if (entry) headerWidth.value = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
});

watch(isDrawerOpen, (open) => {
  if (open) isDrawerMounted.value = true;
});

watch(isMobile, (mobile) => {
  if (mobile) return;

  isDrawerOpen.value = false;
  isDrawerMounted.value = false;
});

useRouteChange({
  onNavigate() {
    isDrawerOpen.value = false;
  },
});
</script>

<style scoped>
.mt-app-header {
  display: flex;
  align-items: center;
  gap: var(--scale-size-12);
  min-width: 0;
  min-height: var(--scale-size-56);
  padding-inline: var(--scale-size-8);
}

.mt-app-header__start,
.mt-app-header__actions,
.mt-app-header__end {
  display: flex;
  flex: none;
  align-items: center;
}

.mt-app-header__start {
  margin-inline-end: var(--scale-size-32);
}

.mt-app-header__nav {
  flex: 1 1 auto;
  min-width: 0;
}

.mt-app-header__actions {
  gap: var(--scale-size-4);
}

.mt-app-header--mobile .mt-app-header__actions {
  margin-inline-start: auto;
}
</style>
