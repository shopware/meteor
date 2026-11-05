<template>
  <nav
    v-if="items.length"
    ref="navEl"
    class="mt-breadcrumb"
    :class="[
      `mt-breadcrumb--size-${size}`,
      `mt-breadcrumb--overflow-${overflow}`,
      { 'mt-breadcrumb--hide-current': hideCurrent, 'mt-breadcrumb--settled': isSettled },
    ]"
    :aria-label="ariaLabel ?? t('ariaLabel')"
  >
    <ol ref="listEl" class="mt-breadcrumb__list">
      <template v-for="(item, index) in items" :key="index">
        <li
          v-if="index > 0"
          :ref="(el) => setElement(separatorEls, index, el)"
          class="mt-breadcrumb__separator"
          :class="{ 'mt-breadcrumb__separator--current': isCurrent(index) }"
          :hidden="collapsedSeparators.includes(index)"
          role="presentation"
          aria-hidden="true"
        >
          /
        </li>

        <li
          v-if="index === 1"
          :ref="setEllipsis"
          class="mt-breadcrumb__ellipsis"
          :hidden="!showEllipsis"
        >
          <dropdown-menu-root :open="overflowOpen" @update:open="overflowOpen = $event">
            <dropdown-menu-trigger as-child>
              <mt-button
                square
                variant="tertiary"
                :size="size === 'xs' ? 'x-small' : 'small'"
                :aria-label="t('hiddenLevels', hiddenCrumbs.length)"
              >
                <mt-icon
                  name="solid-ellipsis-h-s"
                  :size="size === 'xs' ? 'var(--scale-size-10)' : 'var(--scale-size-12)'"
                  color="var(--color-text-secondary-default)"
                  decorative
                />
              </mt-button>
            </dropdown-menu-trigger>

            <dropdown-menu-portal>
              <mt-action-menu>
                <mt-action-menu-item
                  v-for="hidden in hiddenCrumbs"
                  :key="hidden.index"
                  :as="hidden.item.to ? resolveLinkComponent(hidden.item) : undefined"
                  :disabled="!hidden.item.to"
                  v-bind="hidden.item.to ? linkAttributes(hidden.item) : {}"
                  @click="hidden.item.to && $emit('click', hidden.item, $event)"
                >
                  {{ hidden.item.label }}
                </mt-action-menu-item>
              </mt-action-menu>
            </dropdown-menu-portal>
          </dropdown-menu-root>
        </li>

        <li
          :ref="(el) => setElement(crumbEls, index, el)"
          class="mt-breadcrumb__crumb"
          :class="{
            'mt-breadcrumb__crumb--icon': !!item.icon,
            'mt-breadcrumb__crumb--current': isCurrent(index),
          }"
          :hidden="collapsedCrumbs.includes(index)"
        >
          <component
            :is="isLink(item, index) ? resolveLinkComponent(item) : 'span'"
            v-bind="crumbAttributes(item, index)"
            @click="isLink(item, index) && $emit('click', item, $event)"
          >
            <mt-icon
              v-if="item.icon"
              class="mt-breadcrumb__icon"
              :name="item.icon"
              mode="regular"
              size="var(--mt-breadcrumb-icon-size)"
              decorative
            />

            <span class="mt-breadcrumb__text">{{ item.label }}</span>
          </component>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script lang="ts">
import type { Component } from "vue";

export interface BreadcrumbItem {
  /** The text of the crumb. */
  label: string;
  /**
   * Where the crumb leads. A crumb with a destination renders as a link, except the last one,
   * which is the current page.
   */
  to?: string | Record<string, unknown>;
  /** The element or component that renders the link of this crumb, overriding `linkAs`. */
  as?: string | Component;
  /**
   * An icon in front of the label: the name of an icon kit icon without its variant, such as
   * `products`. It always renders in the regular variant, as large as the text.
   */
  icon?: string;
}
</script>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  ref,
  resolveDynamicComponent,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { useResizeObserver } from "@vueuse/core";
import { DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from "reka-ui";
import MtActionMenu from "../mt-action-menu/mt-action-menu.vue";
import MtActionMenuItem from "../mt-action-menu-item/mt-action-menu-item.vue";
import MtButton from "../mt-button/mt-button.vue";
import MtIcon from "../mt-icon/mt-icon.vue";
import { computeCollapsed, type BreadcrumbChild } from "./_internal/mt-breadcrumb-collapse";

const props = withDefaults(
  defineProps<{
    /**
     * The crumbs from the root of the hierarchy to the current page. An item with a `to`
     * renders as a link, the last item always renders as the current page. An item with an `icon`
     * shows it in front of its label.
     */
    items: BreadcrumbItem[];
    /**
     * The text size of all crumbs.
     *
     * @values xs, s
     */
    size?: "xs" | "s";
    /**
     * How the breadcrumb behaves when the crumbs do not fit into the available width.
     * `collapse` keeps everything on one line, shrinks long labels with an ellipsis and then
     * hides middle crumbs behind an ellipsis, `wrap` lets the crumbs flow onto further lines.
     *
     * @values collapse, wrap
     */
    overflow?: "collapse" | "wrap";
    /**
     * The accessible name of the navigation landmark. Defaults to a translated "Breadcrumb".
     */
    ariaLabel?: string;
    /**
     * The element or component that renders a link crumb. An item can override it with `as`.
     */
    linkAs?: string | Component;
    /**
     * Visually hides the current page and the separator before it. Both keep their space, and the
     * current page stays available to assistive technology.
     *
     * @experimental The API may still change in a future release.
     */
    hideCurrent?: boolean;
  }>(),
  {
    size: "xs",
    overflow: "collapse",
    ariaLabel: undefined,
    linkAs: "router-link",
    hideCurrent: false,
  },
);

defineEmits<{
  (e: "click", item: BreadcrumbItem, event: MouseEvent): void;
}>();

const { t } = useI18n({
  messages: {
    en: {
      ariaLabel: "Breadcrumb",
      hiddenLevels: "Show {count} hidden level | Show {count} hidden levels",
    },
    de: {
      ariaLabel: "Brotkrumennavigation",
      hiddenLevels: "{count} ausgeblendete Ebene anzeigen | {count} ausgeblendete Ebenen anzeigen",
    },
  },
});

const SHRINK_SCALE = 1000;

const navEl = ref<HTMLElement | null>(null);
const listEl = ref<HTMLElement | null>(null);
const crumbEls: Array<HTMLElement | null> = [];
const separatorEls: Array<HTMLElement | null> = [];
let ellipsisEl: HTMLElement | null = null;

const collapsedCrumbs = ref<number[]>([]);
const collapsedSeparators = ref<number[]>([]);
const showEllipsis = ref(false);
const overflowOpen = ref(false);
const isSettled = ref(false);

const hiddenCrumbs = computed(() =>
  collapsedCrumbs.value.map((index) => ({ item: props.items[index], index })),
);

watch(showEllipsis, (visible) => {
  if (!visible) overflowOpen.value = false;
});

// The number of crumbs decides which one is the current page.
watch(() => props.items.length, settle);

let frame: number | undefined;
let settleFrame: number | undefined;
let lastWidth = 0;
let unmounted = false;

function setElement(target: Array<HTMLElement | null>, index: number, el: unknown) {
  target[index] = el instanceof HTMLElement ? el : null;
}

function setEllipsis(el: unknown) {
  ellipsisEl = el instanceof HTMLElement ? el : null;
}

function isCurrent(index: number) {
  return index === props.items.length - 1;
}

function isLink(item: BreadcrumbItem, index: number) {
  return Boolean(item.to) && !isCurrent(index);
}

function resolveLinkComponent(item: BreadcrumbItem) {
  const as = item.as ?? props.linkAs;

  return typeof as === "string" ? (resolveDynamicComponent(as) as string | Component) : as;
}

function linkAttributes(item: BreadcrumbItem) {
  if ((item.as ?? props.linkAs) === "router-link") return { to: item.to };

  return typeof item.to === "string" ? { href: item.to } : {};
}

/** A link to the crumb's page, or a label: the current page, or a crumb without destination. */
function crumbAttributes(item: BreadcrumbItem, index: number) {
  if (isLink(item, index)) return { class: "mt-breadcrumb__link", ...linkAttributes(item) };

  return {
    class: "mt-breadcrumb__label",
    "aria-current": isCurrent(index) ? "page" : undefined,
  };
}

function requestLayout() {
  if (unmounted || frame !== undefined) return;

  frame = window.requestAnimationFrame(() => {
    frame = undefined;
    layout();
  });
}

// The current page fades when `hideCurrent` changes on a trail that is on screen. When the
// breadcrumb renders or the current page moves to another crumb, the new state applies at once,
// so a page that hides its title right after rendering or navigating doesn't fade it.
function settle() {
  isSettled.value = false;
  if (settleFrame !== undefined) window.cancelAnimationFrame(settleFrame);

  // The first frame runs before the next paint, the second one after it.
  settleFrame = window.requestAnimationFrame(() => {
    settleFrame = window.requestAnimationFrame(() => {
      settleFrame = undefined;
      isSettled.value = true;
    });
  });
}

interface MeasuredChild extends BreadcrumbChild {
  element: HTMLElement;
  index: number;
}

function collectChildren() {
  const children: MeasuredChild[] = [];

  props.items.forEach((_, index) => {
    const separator = separatorEls[index];
    const crumb = crumbEls[index];

    if (index > 0 && separator)
      children.push({ kind: "separator", element: separator, index, width: 0 });
    if (index === 1 && ellipsisEl)
      children.push({ kind: "ellipsis", element: ellipsisEl, index, width: 0 });
    if (crumb) children.push({ kind: "item", element: crumb, index, width: 0 });
  });

  return children;
}

function measureChild(child: MeasuredChild) {
  const width = child.element.getBoundingClientRect().width;
  if (child.kind !== "item") return width;

  child.element.style.setProperty("--mt-breadcrumb-natural-width", `${width}px`);
  const floor = parseFloat(window.getComputedStyle(child.element).minWidth);
  if (Number.isNaN(floor)) return width;

  // Shrink proportionally to the slack above the floor, so every label reaches its
  // minimum width at the same moment and short labels are not squeezed early. Scaled up
  // because flexbox only distributes the full overflow when the factors sum to at least 1.
  const shrink = ((width - floor) / width) * SHRINK_SCALE || 0;
  child.element.style.setProperty("--mt-breadcrumb-shrink", String(shrink));

  return floor;
}

function applyCollapsed(children: MeasuredChild[], hidden: MeasuredChild[]) {
  // The `hidden` attribute is also bound in the template. Setting it here keeps the DOM
  // correct when the result did not change and Vue skips the patch.
  children.forEach((child) => {
    child.element.hidden = hidden.includes(child);
  });

  const byPosition = (a: number, b: number) => a - b;
  const crumbs = hidden
    .filter((child) => child.kind === "item")
    .map((child) => child.index)
    .sort(byPosition);
  const separators = hidden
    .filter((child) => child.kind === "separator")
    .map((child) => child.index)
    .sort(byPosition);

  if (crumbs.join() !== collapsedCrumbs.value.join()) collapsedCrumbs.value = crumbs;
  if (separators.join() !== collapsedSeparators.value.join())
    collapsedSeparators.value = separators;
  showEllipsis.value = crumbs.length > 0;
}

function layout() {
  const nav = navEl.value;
  const list = listEl.value;
  if (!nav || !list) return;

  const children = collectChildren();
  children.forEach((child) => {
    child.element.hidden = false;
    child.element.style.removeProperty("--mt-breadcrumb-natural-width");
    child.element.style.removeProperty("--mt-breadcrumb-shrink");
  });

  if (props.overflow !== "collapse") {
    applyCollapsed(
      children,
      children.filter((child) => child.kind === "ellipsis"),
    );
    return;
  }

  list.setAttribute("data-measuring", "");
  children.forEach((child) => {
    child.width = measureChild(child);
  });
  const listStyle = window.getComputedStyle(list);
  const navStyle = window.getComputedStyle(nav);
  const gap = parseFloat(listStyle.columnGap) || 0;
  // Read while every crumb is visible: in intrinsically sized layouts (auto grid tracks,
  // flex rows) this is the width the container grants the full trail, so collapsing
  // converges instead of shrinking the trail step by step.
  const padding =
    (parseFloat(navStyle.paddingLeft) || 0) + (parseFloat(navStyle.paddingRight) || 0);
  const available = nav.getBoundingClientRect().width - padding;
  list.removeAttribute("data-measuring");

  const hidden = computeCollapsed(children, available, gap).map((index) => children[index]);
  applyCollapsed(children, hidden);
}

useResizeObserver(navEl, ([entry]) => {
  const width = entry.contentRect.width;
  if (width === lastWidth) return;

  lastWidth = width;
  requestLayout();
});

onMounted(() => {
  requestLayout();
  settle();
});

onUpdated(requestLayout);

onBeforeUnmount(() => {
  unmounted = true;
  if (frame !== undefined) window.cancelAnimationFrame(frame);
  if (settleFrame !== undefined) window.cancelAnimationFrame(settleFrame);
});
</script>

<style scoped>
.mt-breadcrumb {
  --mt-breadcrumb-item-min-width: 8ch;

  display: flow-root;
  min-width: 0;
  max-width: 100%;
  font-family: var(--font-family-body);
  color: var(--color-text-secondary-default);
}

.mt-breadcrumb--size-xs {
  --mt-breadcrumb-icon-size: var(--font-size-xs);
  --mt-breadcrumb-icon-gap: var(--scale-size-8);

  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
}

.mt-breadcrumb--size-xs .mt-breadcrumb__list {
  min-height: var(--scale-size-24);
}

.mt-breadcrumb--size-s {
  --mt-breadcrumb-icon-size: var(--font-size-s);
  --mt-breadcrumb-icon-gap: var(--scale-size-10);

  font-size: var(--font-size-s);
  line-height: var(--font-line-height-s);
}

.mt-breadcrumb--size-s .mt-breadcrumb__list {
  min-height: var(--scale-size-32);
}

.mt-breadcrumb__list {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  column-gap: var(--scale-size-6);
  box-sizing: content-box;
  min-width: 0;
  /* Room for the focus rings (2px outline, 2px offset) inside the clipping box. The
     negative margin cancels the padding so the layout does not change. */
  margin: calc(-1 * var(--scale-size-4));
  padding: var(--scale-size-4);
  overflow: hidden;
  list-style: none;
}

.mt-breadcrumb__list[data-measuring] {
  width: max-content;
}

.mt-breadcrumb__list[data-measuring] > .mt-breadcrumb__crumb {
  flex-shrink: 0;
}

.mt-breadcrumb--overflow-wrap .mt-breadcrumb__list {
  flex-wrap: wrap;
  row-gap: var(--scale-size-4);
  overflow: visible;
}

.mt-breadcrumb__crumb {
  display: inline-flex;
  align-items: center;
  flex: 0 var(--mt-breadcrumb-shrink, 1) auto;
  min-width: min(var(--mt-breadcrumb-item-min-width), var(--mt-breadcrumb-natural-width, 0px));
}

/* The icon comes on top of the minimum, so the label keeps its full minimum width. */
.mt-breadcrumb__crumb--icon {
  min-width: min(
    calc(
      var(--mt-breadcrumb-item-min-width) + var(--mt-breadcrumb-icon-size) +
        var(--mt-breadcrumb-icon-gap)
    ),
    var(--mt-breadcrumb-natural-width, 0px)
  );
}

.mt-breadcrumb__crumb--current {
  color: var(--color-text-primary-default);
  font-weight: var(--font-weight-semibold);
}

.mt-breadcrumb__separator {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--color-text-tertiary-default);
  user-select: none;
}

/* The current page and its separator keep their space, so nothing shifts when they show. */
.mt-breadcrumb--hide-current
  :is(.mt-breadcrumb__crumb--current, .mt-breadcrumb__separator--current) {
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .mt-breadcrumb--settled :is(.mt-breadcrumb__crumb--current, .mt-breadcrumb__separator--current) {
    transition: opacity 150ms ease-out;
  }
}

.mt-breadcrumb__ellipsis {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.mt-breadcrumb__ellipsis .mt-button[data-state="open"] {
  background: var(--color-interaction-secondary-pressed);
}

.mt-breadcrumb__list > [hidden] {
  display: none;
}

.mt-breadcrumb__link,
.mt-breadcrumb__label {
  display: flex;
  align-items: center;
  gap: var(--mt-breadcrumb-icon-gap);
  min-width: 0;
}

.mt-breadcrumb__icon {
  flex: none;
}

.mt-breadcrumb__text {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mt-breadcrumb__link {
  color: var(--color-text-secondary-default);
  text-decoration: none;
  cursor: pointer;
}

.mt-breadcrumb__link:is(:hover, :active) {
  text-decoration: underline;
}

.mt-breadcrumb__link:focus-visible {
  outline: 2px solid var(--color-border-brand-default);
  outline-offset: 2px;
  border-radius: var(--border-radius-xs);
}
</style>
