<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  MtButton,
  MtIcon,
  MtSidebar,
  useApp,
} from "@shopware-ag/meteor-component-library";

/**
 * PROTOTYPE of a future `mt-app-header` for the header slot of `mt-app`: the brand at the start,
 * the navigation after it and the actions at the end. When they don't fit side by side, the
 * navigation moves into a drawer behind a menu button at the start.
 */
defineSlots<{
  /** The brand, such as `mt-brand`. `compact` is `true` in the mobile layout of the shell. */
  brand?(props: { compact: boolean }): unknown;
  /**
   * The main navigation, such as `mt-nav`. Rendered `horizontal` in the bar and `vertical` in the
   * drawer, so pass `orientation` on.
   */
  navigation?(props: { orientation: "horizontal" | "vertical" }): unknown;
  /** Actions and the user menu at the end. `compact` is `true` in the mobile layout of the shell. */
  actions?(props: { compact: boolean }): unknown;
}>();

const { t } = useI18n();
const route = useRoute();
const app = useApp();

const header = useTemplateRef("header");
const start = useTemplateRef("start");
const navigation = useTemplateRef("navigation");
const end = useTemplateRef("end");
const drawer = useTemplateRef("drawer");

/** Whether the navigation doesn't fit next to the brand and the actions, so it moves to the drawer. */
const isCollapsed = ref(false);
const isDrawerOpen = ref(false);

/**
 * Compares the width the header has with the width the brand, the navigation and the actions need
 * side by side. The navigation stays measurable while collapsed, so it comes back once it fits.
 * The brand is measured without the menu button, which only exists while collapsed.
 */
function updateCollapsed() {
  const brand = start.value?.lastElementChild as HTMLElement | null | undefined;
  if (!header.value || !brand || !navigation.value || !end.value) return;

  const gap = parseFloat(getComputedStyle(header.value).columnGap) || 0;
  const navigationMargin =
    parseFloat(getComputedStyle(navigation.value).marginInlineStart) || 0;
  const needed =
    brand.offsetWidth +
    navigationMargin +
    navigation.value.offsetWidth +
    end.value.offsetWidth +
    2 * gap;

  isCollapsed.value = needed > header.value.clientWidth;
}

let observer: ResizeObserver | undefined;

onMounted(() => {
  observer = new ResizeObserver(updateCollapsed);
  const brand = start.value?.lastElementChild;
  for (const element of [header.value, brand, navigation.value, end.value]) {
    if (element) observer.observe(element);
  }
});

onBeforeUnmount(() => observer?.disconnect());

// The native modal dialog traps focus, closes on Escape and returns focus to the menu button.
watch(isDrawerOpen, (open) => {
  if (open) drawer.value?.showModal();
  else drawer.value?.close();
});

watch(isCollapsed, (collapsed) => {
  if (!collapsed) isDrawerOpen.value = false;
});

// A link in the drawer leads to another page, which closes the drawer.
watch(
  () => route.fullPath,
  () => (isDrawerOpen.value = false),
);

function closeOnBackdrop(event: MouseEvent) {
  // Clicks on the backdrop target the dialog itself, clicks inside it target its content.
  if (event.target === drawer.value) isDrawerOpen.value = false;
}
</script>

<template>
  <div
    ref="header"
    class="app-header-prototype"
    :class="{ 'app-header-prototype--collapsed': isCollapsed }"
  >
    <div ref="start" class="app-header-prototype__start">
      <mt-button
        v-if="isCollapsed"
        variant="tertiary"
        square
        :aria-label="t('menu.open')"
        aria-haspopup="dialog"
        :aria-expanded="isDrawerOpen"
        @click="isDrawerOpen = true"
      >
        <mt-icon name="regular-bars" size="var(--scale-size-16)" decorative />
      </mt-button>

      <div class="app-header-prototype__brand">
        <slot name="brand" :compact="app.isMobile.value" />
      </div>
    </div>

    <div
      ref="navigation"
      class="app-header-prototype__navigation"
      :inert="isCollapsed || undefined"
    >
      <slot name="navigation" orientation="horizontal" />
    </div>

    <div ref="end" class="app-header-prototype__end">
      <slot name="actions" :compact="app.isMobile.value" />
    </div>

    <dialog
      ref="drawer"
      class="app-header-prototype__drawer"
      :aria-label="t('menu.label')"
      @close="isDrawerOpen = false"
      @click="closeOnBackdrop"
    >
      <mt-sidebar class="app-header-prototype__sidebar">
        <template #header>
          <slot name="brand" :compact="false" />
        </template>

        <template #actions>
          <mt-button
            variant="tertiary"
            size="small"
            square
            :aria-label="t('menu.close')"
            @click="isDrawerOpen = false"
          >
            <mt-icon
              name="regular-times-s"
              size="var(--scale-size-10)"
              decorative
            />
          </mt-button>
        </template>

        <slot v-if="isDrawerOpen" name="navigation" orientation="vertical" />
      </mt-sidebar>
    </dialog>
  </div>
</template>

<style scoped>
.app-header-prototype {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--scale-size-24);
  box-sizing: border-box;
  min-width: 0;
  min-height: var(--scale-size-56);
  margin-inline: var(--scale-size-8);
  padding-block: var(--scale-size-4);
}

.app-header-prototype__start,
.app-header-prototype__end {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--scale-size-8);
}

/* More room after the brand than between the other parts. */
.app-header-prototype__navigation {
  flex-shrink: 0;
  margin-inline-start: var(--scale-size-16);
}

/* Out of the flow and invisible, but still measured to know when the navigation fits again. */
.app-header-prototype--collapsed .app-header-prototype__navigation {
  position: absolute;
  visibility: hidden;
}

.app-header-prototype__end {
  margin-inline-start: auto;
}

/* PROTOTYPE: a smaller, less rounded logo and a smaller title than mt-brand has by default. The
   logo's icon is sized relative to its box. */
.app-header-prototype :deep(.mt-brand__image) {
  width: var(--scale-size-36);
  height: var(--scale-size-36);
  border-radius: 20%;
}

.app-header-prototype :deep(.mt-brand) {
  gap: var(--scale-size-8);
}

.app-header-prototype :deep(.mt-brand__title) {
  font-size: var(--font-size-xs);
}

/* Slides in from the start edge like the drawers of mt-app. */
.app-header-prototype__drawer {
  --app-header-prototype-direction: 1;
  --app-header-prototype-offset: calc(
    (-100% - var(--scale-size-8)) * var(--app-header-prototype-direction)
  );

  position: fixed;
  inset-block: var(--scale-size-8);
  inset-inline-start: var(--scale-size-8);
  width: fit-content;
  max-width: calc(100vw - var(--scale-size-48));
  height: auto;
  max-height: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: var(--color-elevation-surface-raised);
  color: var(--color-text-primary-default);
  border: var(--scale-size-1) solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-card);
  transform: translateX(var(--app-header-prototype-offset));
  transition:
    transform 200ms cubic-bezier(0.3, 0, 0.8, 0.15),
    overlay 200ms allow-discrete,
    display 200ms allow-discrete;
}

[dir="rtl"] .app-header-prototype__drawer {
  --app-header-prototype-direction: -1;
}

.app-header-prototype__drawer[open] {
  display: flex;
  transform: none;
  transition-timing-function: cubic-bezier(0.05, 0.7, 0.1, 1);
}

@starting-style {
  .app-header-prototype__drawer[open] {
    transform: translateX(var(--app-header-prototype-offset));
  }
}

.app-header-prototype__drawer::backdrop {
  background-color: var(--color-elevation-backdrop-default);
  opacity: 0;
  transition:
    opacity 200ms,
    overlay 200ms allow-discrete,
    display 200ms allow-discrete;
}

.app-header-prototype__drawer[open]::backdrop {
  opacity: 1;
}

@starting-style {
  .app-header-prototype__drawer[open]::backdrop {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-header-prototype__drawer,
  .app-header-prototype__drawer::backdrop {
    transition: none;
  }
}

.app-header-prototype__sidebar {
  flex: 1;
}
</style>
