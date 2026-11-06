<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  MtButton,
  MtIcon,
  MtSidebar,
  useApp,
} from "@shopware-ag/meteor-component-library";

/**
 * PROTOTYPE of a future `mt-app-header` for the header slot of `mt-app`: the brand and the context
 * at the start, the navigation after them and the actions at the end. When they don't fit side by
 * side, the navigation moves into a drawer behind a menu button at the start, and when the context
 * then still doesn't fit next to the brand, it follows the navigation into the drawer.
 */
const slots = defineSlots<{
  /** The brand, such as `mt-brand`. It keeps its title in every layout. */
  brand?(): unknown;
  /**
   * What the app works in, such as a store switcher. Rendered `horizontal` after the brand in the
   * bar and `vertical` above the navigation in the drawer, so pass `orientation` on.
   */
  context?(props: { orientation: "horizontal" | "vertical" }): unknown;
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
const brand = useTemplateRef("brand");
const context = useTemplateRef("context");
const navigation = useTemplateRef("navigation");
const end = useTemplateRef("end");
const drawer = useTemplateRef("drawer");

/** Whether the navigation doesn't fit next to the brand and the actions, so it moves to the drawer. */
const isCollapsed = ref(false);
/** Whether the context doesn't fit next to the brand either, so it moves to the drawer as well. */
const isContextInDrawer = ref(false);
const isDrawerOpen = ref(false);

/** The brand may truncate its title once nothing else can give up room at the start. */
const isStartShrinking = computed(
  () => isCollapsed.value && (!slots.context || isContextInDrawer.value),
);

/**
 * Compares the width the header has with the width its parts need side by side. The navigation
 * and the context stay measurable while they are in the drawer, so they come back once they fit.
 * The brand keeps its full width until the context has moved out, so it is measured at it.
 */
function updateLayout() {
  if (
    !header.value ||
    !start.value ||
    !brand.value ||
    !navigation.value ||
    !end.value
  ) {
    return;
  }

  const available = header.value.clientWidth;
  const gap = parseFloat(getComputedStyle(header.value).columnGap) || 0;
  const startGap = parseFloat(getComputedStyle(start.value).columnGap) || 0;
  const navigationMargin =
    parseFloat(getComputedStyle(navigation.value).marginInlineStart) || 0;
  const contextWidth = context.value ? startGap + context.value.offsetWidth : 0;
  const startWidth = brand.value.offsetWidth + contextWidth;

  isCollapsed.value =
    startWidth +
      navigationMargin +
      navigation.value.offsetWidth +
      gap +
      end.value.offsetWidth +
      gap >
    available;

  // The menu button exists while collapsed and sits before the brand.
  const menuButton = start.value.querySelector<HTMLElement>(
    ".app-header-prototype__menu-button",
  );
  const menuWidth = menuButton ? menuButton.offsetWidth + startGap : 0;

  isContextInDrawer.value =
    isCollapsed.value &&
    !!context.value &&
    menuWidth + startWidth + gap + end.value.offsetWidth > available;
}

let observer: ResizeObserver | undefined;

onMounted(() => {
  observer = new ResizeObserver(updateLayout);
  const elements = [
    header.value,
    start.value,
    brand.value,
    context.value,
    navigation.value,
    end.value,
  ];
  for (const element of elements) {
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
    :class="{
      'app-header-prototype--collapsed': isCollapsed,
      'app-header-prototype--start-shrinking': isStartShrinking,
    }"
  >
    <div ref="start" class="app-header-prototype__start">
      <mt-button
        v-if="isCollapsed"
        class="app-header-prototype__menu-button"
        variant="tertiary"
        square
        :aria-label="t('menu.open')"
        aria-haspopup="dialog"
        :aria-expanded="isDrawerOpen"
        @click="isDrawerOpen = true"
      >
        <mt-icon name="regular-bars" size="var(--scale-size-16)" decorative />
      </mt-button>

      <div ref="brand" class="app-header-prototype__brand">
        <slot name="brand" />
      </div>

      <div
        v-if="slots.context"
        ref="context"
        class="app-header-prototype__context"
        :class="{
          'app-header-prototype__context--in-drawer': isContextInDrawer,
        }"
        :inert="isContextInDrawer || undefined"
      >
        <slot name="context" orientation="horizontal" />
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
          <slot name="brand" />
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

        <template v-if="isDrawerOpen">
          <div
            v-if="isContextInDrawer"
            class="app-header-prototype__drawer-context"
          >
            <slot name="context" orientation="vertical" />
          </div>

          <slot name="navigation" orientation="vertical" />
        </template>
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

.app-header-prototype__context {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--scale-size-8);
}

/* Out of the flow and invisible, but still measured to know when they fit again. */
.app-header-prototype--collapsed .app-header-prototype__navigation,
.app-header-prototype__context--in-drawer {
  position: absolute;
  visibility: hidden;
}

.app-header-prototype__end {
  margin-inline-start: auto;
}

/* On narrow screens the brand truncates its title rather than pushing the actions out. Only once
   the navigation and the context are in the drawer, so it is measured at its full width before. */
.app-header-prototype--start-shrinking .app-header-prototype__start,
.app-header-prototype--start-shrinking .app-header-prototype__brand {
  flex-shrink: 1;
  min-width: 0;
}

/* PROTOTYPE: a smaller, less rounded logo and a smaller title than mt-brand has by default. The
   logo's icon is sized relative to its box. */
.app-header-prototype :deep(.mt-brand__image) {
  width: var(--scale-size-36);
  height: var(--scale-size-36);
  border-radius: 24%;
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

.app-header-prototype__drawer-context {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-4);
  margin-block-end: var(--scale-size-12);
}
</style>
