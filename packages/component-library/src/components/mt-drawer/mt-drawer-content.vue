<template>
  <DrawerPortal v-if="keepMounted || isRendered">
    <Transition name="mt-drawer-backdrop" appear>
      <div
        v-show="isOpen"
        ref="backdrop"
        class="mt-drawer__backdrop"
        data-testid="mt-drawer-backdrop"
        aria-hidden="true"
        @click="drawer.dismiss('outside-click')"
      />
    </Transition>

    <Transition name="mt-drawer-slide" appear @after-leave="onAfterLeave">
      <DrawerContent
        v-show="isOpen"
        ref="panel"
        force-mount
        :initial-focus="false"
        :final-focus="false"
        class="mt-drawer"
        :class="[`mt-drawer--${side}`, `mt-drawer--${variant}`]"
        :style="size ? { '--mt-drawer-size': size } : undefined"
        tabindex="-1"
        aria-modal="true"
        :inert="!isOpen || undefined"
        v-bind="{ ...(subtitle ? {} : { 'aria-describedby': undefined }), ...$attrs }"
        @escape-key-down="preventDismiss"
        @pointer-down-outside="preventDismiss"
        @focus-outside="preventDismiss"
        @interact-outside="preventDismiss"
      >
        <div v-if="!hideHeader" class="mt-drawer__header">
          <div class="mt-drawer__header-content">
            <DrawerTitle as-child>
              <mt-text as="h2" size="m" weight="semibold" class="mt-drawer__title">
                {{ title }}
              </mt-text>
            </DrawerTitle>

            <DrawerDescription v-if="subtitle" class="mt-drawer__subtitle">
              {{ subtitle }}
            </DrawerDescription>
          </div>

          <mt-drawer-close class="mt-drawer__close-button" :aria-label="t('close')">
            <mt-icon name="regular-times-s" size="var(--scale-size-10)" decorative />
          </mt-drawer-close>
        </div>

        <DrawerTitle v-else class="mt-drawer__hidden-title">{{ title }}</DrawerTitle>

        <div class="mt-drawer__body" :class="{ 'mt-drawer__body--inset': inset }">
          <slot />
        </div>

        <div v-if="hasSlotContent(slots.footer)" class="mt-drawer__footer">
          <slot name="footer" />
        </div>
      </DrawerContent>
    </Transition>
  </DrawerPortal>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { DrawerContent, DrawerDescription, DrawerPortal, DrawerTitle } from "reka-ui";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtText from "@/components/mt-text/mt-text.vue";
import { useModalLayer } from "@/composables/useModalLayer";
import { hasSlotContent } from "@/utils/slot";
import MtDrawerClose from "./mt-drawer-close.vue";
import { useDrawerContext, type MtDrawerSide } from "./composables/useDrawerContext";

/**
 * @experimental Builds on an alpha primitive; the API may still change.
 *
 * The panel of a drawer: it slides in from an edge of the viewport above a backdrop,
 * makes the page behind it inert and returns the focus when it closes.
 */
const props = withDefaults(
  defineProps<{
    /** The title of the drawer. It is also the accessible name of the dialog. */
    title: string;
    /** A short description below the title. */
    subtitle?: string;
    /** The edge of the viewport the drawer slides in from. */
    side?: MtDrawerSide;
    /** `floating` keeps an 8px distance to the viewport edges and gets a border with rounded corners. */
    variant?: "default" | "floating";
    /**
     * The width of a `start` or `end` drawer, or the height of a `top` or `bottom` drawer,
     * as a CSS length such as `"30rem"`. Without it, the drawer takes the size of its content.
     */
    size?: string;
    /** Removes the padding around the content. */
    inset?: boolean;
    /** Hides the header with the title and the close button. The title stays available to assistive technology. */
    hideHeader?: boolean;
    /** Keeps the content mounted while the drawer is closed, so its state survives. */
    keepMounted?: boolean;
  }>(),
  {
    subtitle: undefined,
    side: "end",
    variant: "default",
    size: undefined,
    inset: false,
    hideHeader: false,
    keepMounted: false,
  },
);

defineOptions({ inheritAttrs: false });

const slots = defineSlots<{
  default?(): unknown;
  footer?(): unknown;
}>();

const { t } = useI18n({
  messages: {
    en: { close: "Close" },
    de: { close: "Schließen" },
  },
});

const drawer = useDrawerContext("mt-drawer-content");
const isOpen = drawer.isOpen;

const panel = useTemplateRef<{ $el: HTMLElement }>("panel");
const backdrop = useTemplateRef<HTMLElement>("backdrop");
const panelElement = computed(() => panel.value?.$el ?? null);

const isRendered = ref(isOpen.value);
const isShown = ref(false);

watch(
  () => props.side,
  (side) => {
    drawer.side.value = side;
  },
  { immediate: true },
);

function resetSwipe() {
  const element = panelElement.value;
  if (!element) return;

  element.style.setProperty("--drawer-swipe-movement-x", "0px");
  element.style.setProperty("--drawer-swipe-movement-y", "0px");
  element.removeAttribute("data-swipe-dismissed");
}

drawer.onSwipeRefused(resetSwipe);

watch(
  isOpen,
  (open) => {
    if (!open) return;

    isRendered.value = true;
    resetSwipe();
  },
  { flush: "sync" },
);

watch(
  isOpen,
  (open) => {
    if (!open) {
      isShown.value = false;
      return;
    }

    nextTick(() => {
      isShown.value = isOpen.value;
    });
  },
  { immediate: true },
);

function onAfterLeave() {
  if (!props.keepMounted) isRendered.value = false;
}

// A closed drawer that stays mounted is still a reka layer; it must not touch events of the page.
function preventDismiss(event: Event) {
  if (isOpen.value) event.preventDefault();
}

useModalLayer({
  panel: panelElement,
  active: computed(() => isShown.value && panelElement.value !== null),
  onEscape: () => drawer.dismiss("escape-key"),
  inertTargets: () =>
    Array.from(document.body.children).filter(
      (element) =>
        !(panelElement.value && element.contains(panelElement.value)) &&
        !(backdrop.value && element.contains(backdrop.value)) &&
        !element.hasAttribute("data-mt-overlay"),
    ),
});
</script>

<style scoped>
.mt-drawer {
  position: fixed;
  z-index: var(--z-index-drawer, 900);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: var(--color-elevation-surface-raised);
  color: var(--color-text-primary-default);
  outline: none;
  transform: translate(var(--drawer-swipe-movement-x, 0px), var(--drawer-swipe-movement-y, 0px));
  transition: transform 200ms cubic-bezier(0.05, 0.7, 0.1, 1);
}

.mt-drawer[data-swiping] {
  transition: none;
}

.mt-drawer--start,
.mt-drawer--end {
  inset-block: 0;
  width: var(--mt-drawer-size, auto);
  max-width: calc(100vw - var(--scale-size-48));
}

.mt-drawer--top,
.mt-drawer--bottom {
  inset-inline: 0;
  height: var(--mt-drawer-size, auto);
  max-height: calc(100dvh - var(--scale-size-48));
}

.mt-drawer--start {
  inset-inline-start: 0;
  border-inline-end: 1px solid var(--color-border-secondary-default);
}

.mt-drawer--end {
  inset-inline-end: 0;
  border-inline-start: 1px solid var(--color-border-secondary-default);
}

.mt-drawer--top {
  inset-block-start: 0;
  border-block-end: 1px solid var(--color-border-secondary-default);
}

.mt-drawer--bottom {
  inset-block-end: 0;
  border-block-start: 1px solid var(--color-border-secondary-default);
}

.mt-drawer--floating {
  overflow: hidden;
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-card);
}

.mt-drawer--floating.mt-drawer--start,
.mt-drawer--floating.mt-drawer--end {
  inset-block: var(--scale-size-8);
}

.mt-drawer--floating.mt-drawer--top,
.mt-drawer--floating.mt-drawer--bottom {
  inset-inline: var(--scale-size-8);
}

.mt-drawer--floating.mt-drawer--start {
  inset-inline-start: var(--scale-size-8);
}

.mt-drawer--floating.mt-drawer--end {
  inset-inline-end: var(--scale-size-8);
}

.mt-drawer--floating.mt-drawer--top {
  inset-block-start: var(--scale-size-8);
}

.mt-drawer--floating.mt-drawer--bottom {
  inset-block-end: var(--scale-size-8);
}

.mt-drawer-slide-enter-active {
  transition: transform 200ms cubic-bezier(0.05, 0.7, 0.1, 1);
}

.mt-drawer-slide-leave-active {
  transition: transform 200ms cubic-bezier(0.3, 0, 0.8, 0.15);
}

.mt-drawer--start.mt-drawer-slide-enter-from,
.mt-drawer--start.mt-drawer-slide-leave-to {
  transform: translateX(calc(-100% - var(--scale-size-8)));
}

.mt-drawer--end.mt-drawer-slide-enter-from,
.mt-drawer--end.mt-drawer-slide-leave-to {
  transform: translateX(calc(100% + var(--scale-size-8)));
}

.mt-drawer--top.mt-drawer-slide-enter-from,
.mt-drawer--top.mt-drawer-slide-leave-to {
  transform: translateY(calc(-100% - var(--scale-size-8)));
}

.mt-drawer--bottom.mt-drawer-slide-enter-from,
.mt-drawer--bottom.mt-drawer-slide-leave-to {
  transform: translateY(calc(100% + var(--scale-size-8)));
}

.mt-drawer__backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--z-index-drawer, 900);
  background-color: var(--color-elevation-backdrop-default);
}

.mt-drawer-backdrop-enter-active {
  transition: opacity 200ms cubic-bezier(0.05, 0.7, 0.1, 1);
}

.mt-drawer-backdrop-leave-active {
  transition: opacity 200ms cubic-bezier(0.3, 0, 0.8, 0.15);
}

.mt-drawer-backdrop-enter-from,
.mt-drawer-backdrop-leave-to {
  opacity: 0;
}

.mt-drawer__header {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--scale-size-12);
  padding: var(--scale-size-24);
  border-bottom: 1px solid var(--color-border-secondary-default);
}

.mt-drawer__header-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--scale-size-2);
  min-width: 0;
}

.mt-drawer__title {
  margin: 0;
}

.mt-drawer__subtitle {
  margin: 0;
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-md);
}

.mt-drawer__hidden-title {
  position: absolute;
  width: var(--scale-size-1);
  height: var(--scale-size-1);
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.mt-drawer__close-button {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: var(--scale-size-32);
  height: var(--scale-size-32);
  padding: 0;
  color: var(--color-icon-primary-default);
  background: none;
  border: 0;
  border-radius: var(--border-radius-xs);
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background-color: var(--color-interaction-secondary-hover);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--color-border-brand-default);
  }
}

.mt-drawer__body {
  flex: 1 1 auto;
  min-height: 0;
  padding: var(--scale-size-24);
  overflow: auto;
  overscroll-behavior: contain;
}

.mt-drawer__body--inset {
  padding: 0;
}

.mt-drawer__footer {
  flex: none;
  padding: var(--scale-size-24);
  border-top: 1px solid var(--color-border-secondary-default);
}

@media (prefers-reduced-motion: reduce) {
  .mt-drawer,
  .mt-drawer-slide-enter-active,
  .mt-drawer-slide-leave-active,
  .mt-drawer-backdrop-enter-active,
  .mt-drawer-backdrop-leave-active {
    transition: none;
  }
}

@media print {
  .mt-drawer,
  .mt-drawer__backdrop {
    display: none;
  }
}
</style>
