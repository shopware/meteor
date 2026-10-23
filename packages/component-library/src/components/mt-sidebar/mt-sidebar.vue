<template>
  <nav class="mt-sidebar" :style="{ '--mt-sidebar-width': width }" :aria-label="label">
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
  </nav>
</template>

<script setup lang="ts">
import { computed, provide } from "vue";
import { useI18n } from "vue-i18n";
import { NAV_LANDMARK } from "../mt-nav/_internal/mt-nav-context";
import { hasSlotContent } from "@/utils/slot";

/**
 * The main navigation of an application: a fixed header, the navigation, which scrolls on its
 * own, and a fixed footer. It is the navigation landmark, so an `mt-nav` inside it adds none.
 *
 * @experimental The API may still change in a future release.
 */
const props = withDefaults(
  defineProps<{
    /**
     * Accessible name of the navigation landmark. Defaults to the translated "Main navigation".
     */
    ariaLabel?: string;
    /**
     * Width of the sidebar as a CSS length, for example "300px". It gets narrower only when its
     * container is narrower.
     */
    width?: string;
  }>(),
  {
    ariaLabel: undefined,
    width: "300px",
  },
);

defineSlots<{
  /**
   * Fixed area at the top, for example mt-logo.
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

const { t } = useI18n({
  messages: {
    en: {
      label: "Main navigation",
    },
    de: {
      label: "Hauptnavigation",
    },
  },
});

const label = computed(() => props.ariaLabel ?? t("label"));

provide(NAV_LANDMARK, true);
</script>

<style scoped>
.mt-sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: var(--mt-sidebar-width);
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
