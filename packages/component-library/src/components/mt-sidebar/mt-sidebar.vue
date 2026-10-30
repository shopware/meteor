<template>
  <aside class="mt-sidebar" :aria-label="ariaLabel">
    <header
      v-if="hasSlotContent($slots.header) || hasSlotContent($slots.actions)"
      class="mt-sidebar__header"
    >
      <div v-if="hasSlotContent($slots.header)" class="mt-sidebar__header-content">
        <slot name="header" />
      </div>

      <div v-if="hasSlotContent($slots.actions)" class="mt-sidebar__actions">
        <slot name="actions" />
      </div>
    </header>

    <div class="mt-sidebar__body">
      <slot />
    </div>

    <footer v-if="hasSlotContent($slots.footer)" class="mt-sidebar__footer">
      <slot name="footer" />
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { hasSlotContent } from "@/utils/slot";

/**
 * The frame around the main navigation of an application: a fixed header, the navigation, which
 * scrolls on its own, and a fixed footer. It is a complementary landmark (`<aside>`), and the
 * `mt-nav` inside it is the navigation landmark.
 *
 * It is 300px wide, or as wide as the `mt-panel` around it when that sets a width.
 *
 * @experimental The API may still change in a future release.
 */
withDefaults(
  defineProps<{
    /**
     * Accessible name of the sidebar landmark. Only needed when the page has another `<aside>`,
     * so screen reader users can tell them apart.
     */
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: undefined,
  },
);

defineSlots<{
  /**
   * Fixed area at the top, for example mt-brand.
   */
  header?: null;
  /**
   * Next to the header, for example a button that collapses the sidebar.
   */
  actions?: null;
  /**
   * The navigation, for example mt-nav. It fills the space between header and footer.
   */
  default?: null;
  /**
   * Fixed area at the bottom, for example mt-user-menu.
   */
  footer?: null;
}>();
</script>

<style scoped>
.mt-sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  /* Fills an mt-panel that sets a width, and is 300px wide otherwise. */
  width: var(--mt-panel-width, 300px);
  max-width: 100%;
  height: 100%;
  min-height: 0;
  padding: var(--scale-size-24) var(--scale-size-12) var(--scale-size-8);
  background: var(--color-elevation-surface-sunken);
  color: var(--color-text-primary-default);
}

.mt-sidebar__header,
.mt-sidebar__footer {
  flex: 0 0 auto;
}

.mt-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--scale-size-12);
  padding-inline-start: var(--scale-size-10);
}

.mt-sidebar__header-content {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
}

.mt-sidebar__actions {
  display: flex;
  flex-shrink: 0;
  margin-inline-start: auto;
}

.mt-sidebar__body {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: var(--scale-size-16);
  min-height: 0;
  overflow-y: auto;
}
</style>
