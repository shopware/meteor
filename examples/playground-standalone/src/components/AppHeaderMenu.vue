<script setup lang="ts">
import { computed, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
  MtBrand,
  MtButton,
  MtIcon,
  MtNav,
  MtSidebar,
  type NavItem,
  type NavSection,
} from "@shopware-ag/meteor-component-library";

export interface HeaderLink {
  to: string;
  /** The i18n key of the label. */
  label: string;
  icon: string;
}

const props = defineProps<{
  links: HeaderLink[];
}>();

const open = defineModel<boolean>("open", { required: true });

const { t } = useI18n();
const route = useRoute();
const dialog = useTemplateRef("dialog");

const sections = computed<NavSection[]>(() => [
  {
    items: props.links.map((link) => ({
      id: link.to,
      label: t(link.label),
      icon: link.icon,
      to: link.to,
    })),
  },
]);

/** A link is active on its own page and on the pages below it, such as a section of the settings. */
function isActive(item: NavItem) {
  if (typeof item.to !== "string") return false;
  return route.path === item.to || route.path.startsWith(`${item.to}/`);
}

// The native modal dialog traps focus, closes on Escape and returns focus to the trigger.
watch(open, (isOpen) => {
  if (isOpen) dialog.value?.showModal();
  else dialog.value?.close();
});

watch(
  () => route.fullPath,
  () => (open.value = false),
);

function closeOnBackdrop(event: MouseEvent) {
  // Clicks on the backdrop target the dialog itself, clicks inside it target its content.
  if (event.target === dialog.value) open.value = false;
}
</script>

<template>
  <dialog
    ref="dialog"
    class="app-header-menu"
    :aria-label="t('menu.label')"
    @close="open = false"
    @click="closeOnBackdrop"
  >
    <mt-sidebar class="app-header-menu__sidebar">
      <template #header>
        <mt-brand title="Playground" subtitle="Shopware" />
      </template>

      <template #actions>
        <mt-button
          variant="tertiary"
          size="small"
          square
          :aria-label="t('menu.close')"
          @click="open = false"
        >
          <mt-icon
            name="regular-times-s"
            size="var(--scale-size-10)"
            decorative
          />
        </mt-button>
      </template>

      <mt-nav :sections="sections" :is-active="isActive" />
    </mt-sidebar>
  </dialog>
</template>

<style scoped>
/* Slides in from the start edge like the drawers of mt-app. */
.app-header-menu {
  --app-header-menu-direction: 1;
  --app-header-menu-offset: calc(
    (-100% - var(--scale-size-8)) * var(--app-header-menu-direction)
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
  transform: translateX(var(--app-header-menu-offset));
  transition:
    transform 200ms cubic-bezier(0.3, 0, 0.8, 0.15),
    overlay 200ms allow-discrete,
    display 200ms allow-discrete;
}

[dir="rtl"] .app-header-menu {
  --app-header-menu-direction: -1;
}

.app-header-menu[open] {
  display: flex;
  transform: none;
  transition-timing-function: cubic-bezier(0.05, 0.7, 0.1, 1);
}

@starting-style {
  .app-header-menu[open] {
    transform: translateX(var(--app-header-menu-offset));
  }
}

.app-header-menu::backdrop {
  background-color: var(--color-elevation-backdrop-default);
  opacity: 0;
  transition:
    opacity 200ms,
    overlay 200ms allow-discrete,
    display 200ms allow-discrete;
}

.app-header-menu[open]::backdrop {
  opacity: 1;
}

@starting-style {
  .app-header-menu[open]::backdrop {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-header-menu,
  .app-header-menu::backdrop {
    transition: none;
  }
}

.app-header-menu__sidebar {
  flex: 1;
}
</style>
