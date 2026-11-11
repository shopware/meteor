<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  MtButton,
  MtIcon,
  MtSidebar,
} from "@shopware-ag/meteor-component-library";

/**
 * PROTOTYPE of a future `mt-app-header` for the header slot of `mt-app`: the brand at the start,
 * the navigation after it and the actions and the user menu at the end. When they don't fit side
 * by side, the context switcher, the navigation and the user menu move together into a drawer
 * behind a menu button, so the drawer always has the same content, and the bar keeps the logo and
 * the actions. Whether they fit follows the width the header has and the width its parts need, not
 * a breakpoint.
 */
const slots = defineSlots<{
  /**
   * The brand, such as `mt-brand` or a context switcher around it. Rendered `horizontal` in the bar
   * and `vertical` in the header of the drawer. `compact` is `true` while the drawer is in use,
   * where a context switcher belongs in the drawer and the bar shows only the logo.
   */
  brand?(props: {
    orientation: "horizontal" | "vertical";
    compact: boolean;
  }): unknown;
  /**
   * The main navigation, such as `mt-nav`. Rendered `horizontal` in the bar and `vertical` in the
   * drawer, so pass `orientation` on.
   */
  navigation?(props: { orientation: "horizontal" | "vertical" }): unknown;
  /** Actions at the end. `compact` is `true` while the drawer is in use. */
  actions?(props: { compact: boolean }): unknown;
  /**
   * The user menu. Rendered `horizontal` after the actions in the bar, and `vertical` at the bottom
   * of the drawer once the navigation is there too.
   */
  user?(props: { orientation: "horizontal" | "vertical" }): unknown;
}>();

const { t } = useI18n();
const route = useRoute();

const header = useTemplateRef("header");
const brand = useTemplateRef("brand");
const navigation = useTemplateRef("navigation");
const actions = useTemplateRef("actions");
const user = useTemplateRef("user");
const drawer = useTemplateRef("drawer");

/** Whether the parts don't fit side by side, so they move into the drawer. */
const isCollapsed = ref(false);
const isDrawerOpen = ref(false);

const width = (element: Element | null | undefined) =>
  element instanceof HTMLElement ? element.offsetWidth : 0;
const style = (element: Element) => getComputedStyle(element);

/**
 * Compares the width the header has with the width its parts need side by side. Every part that
 * moves into the drawer stays rendered and measurable at its full size in the bar, so they come
 * back as soon as there is room again.
 */
function updateLayout() {
  if (!header.value || !navigation.value || !actions.value) return;

  const available = header.value.clientWidth;
  const gap = parseFloat(style(header.value).columnGap) || 0;
  // The gap between the actions and the user menu, not the one between the actions.
  const endGap = actions.value.parentElement
    ? parseFloat(style(actions.value.parentElement).columnGap) || 0
    : 0;
  const navigationMargin =
    parseFloat(style(navigation.value).marginInlineStart) || 0;

  isCollapsed.value =
    width(brand.value) +
      navigationMargin +
      width(navigation.value) +
      gap +
      width(actions.value) +
      (user.value ? endGap + width(user.value) : 0) +
      gap >
    available;
}

let observer: ResizeObserver | undefined;

onMounted(() => {
  observer = new ResizeObserver(updateLayout);
  const elements = [
    header.value,
    brand.value,
    navigation.value,
    actions.value,
    user.value,
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

/**
 * Escape in a menu inside the drawer, such as the user menu, closes only that menu. The menu is
 * already gone when the dialog's cancel event follows, so it is noted on the way down.
 */
let isMenuOpen = false;
function noteOpenMenu() {
  isMenuOpen = !!drawer.value?.querySelector('[role="menu"]');
}
function keepOpenForMenu(event: Event) {
  if (isMenuOpen) event.preventDefault();
  isMenuOpen = false;
}

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
    <div class="app-header-prototype__start">
      <mt-button
        v-if="isCollapsed"
        class="app-header-prototype__menu-button"
        variant="tertiary"
        size="default"
        square
        :aria-label="t('menu.open')"
        aria-haspopup="dialog"
        :aria-expanded="isDrawerOpen"
        @click="isDrawerOpen = true"
      >
        <mt-icon name="regular-bars" size="var(--scale-size-16)" decorative />
      </mt-button>

      <div
        ref="brand"
        class="app-header-prototype__brand"
        :class="{ 'app-header-prototype__hidden': isCollapsed }"
        :inert="isCollapsed || undefined"
      >
        <slot name="brand" orientation="horizontal" :compact="false" />
      </div>

      <div v-if="isCollapsed" class="app-header-prototype__brand">
        <slot name="brand" orientation="horizontal" :compact="true" />
      </div>
    </div>

    <div
      ref="navigation"
      class="app-header-prototype__navigation"
      :class="{ 'app-header-prototype__hidden': isCollapsed }"
      :inert="isCollapsed || undefined"
    >
      <slot name="navigation" orientation="horizontal" />
    </div>

    <div class="app-header-prototype__end">
      <div ref="actions" class="app-header-prototype__actions">
        <slot name="actions" :compact="isCollapsed" />
      </div>

      <div
        v-if="slots.user"
        ref="user"
        class="app-header-prototype__user"
        :class="{ 'app-header-prototype__hidden': isCollapsed }"
        :inert="isCollapsed || undefined"
      >
        <slot name="user" orientation="horizontal" />
      </div>
    </div>

    <dialog
      ref="drawer"
      class="app-header-prototype__drawer"
      :aria-label="t('menu.label')"
      @close="isDrawerOpen = false"
      @keydown.esc.capture="noteOpenMenu"
      @cancel="keepOpenForMenu"
      @click="closeOnBackdrop"
    >
      <mt-sidebar
        class="app-header-prototype__sidebar"
        :class="{ 'app-header-prototype__sidebar--collapsed': isCollapsed }"
      >
        <template #header>
          <slot name="brand" orientation="vertical" :compact="isCollapsed" />
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

        <template v-if="isCollapsed && slots.user" #footer>
          <slot name="user" orientation="vertical" />
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
.app-header-prototype__end,
.app-header-prototype__actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--scale-size-8);
}

/* The icon buttons sit closer together, as one group before the user menu. */
.app-header-prototype__end .app-header-prototype__actions {
  gap: var(--scale-size-4);
}

/* The switcher's padding already adds room after the brand, so the gap alone is enough. */
.app-header-prototype__navigation {
  flex-shrink: 0;
  margin-inline-start: calc(-1 * var(--scale-size-8));
}

/* Out of the flow and invisible, but still measured to know when it fits again. `inert` keeps it
   from focus and assistive technology. Not `visibility: hidden`: icons such as the Shopware logo
   clip with a fixed id, so every copy uses the clip path of the first one, which must stay
   visible. */
.app-header-prototype__hidden {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.app-header-prototype__end {
  margin-inline-start: auto;
}

/* While collapsed the start gives up room before the actions do. */
.app-header-prototype--collapsed .app-header-prototype__start,
.app-header-prototype--collapsed .app-header-prototype__brand {
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

.app-header-prototype__drawer .app-header-prototype__sidebar {
  flex: 1;
  padding: var(--scale-size-8);
}

/* While collapsed the header holds the context switcher, whose button lines up with the rows of the
   navigation instead of indenting the logo. */
.app-header-prototype__sidebar--collapsed :deep(.mt-sidebar__header) {
  padding-inline-start: 0;
}
</style>
