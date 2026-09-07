<template>
  <nav
    v-if="items.length"
    ref="navEl"
    class="mt-breadcrumb"
    :class="[`mt-breadcrumb--size-${size}`, `mt-breadcrumb--overflow-${overflow}`]"
    :aria-label="ariaLabel ?? t('ariaLabel')"
  >
    <ol ref="listEl" class="mt-breadcrumb__list">
      <template v-for="(item, index) in items" :key="index">
        <li
          v-if="index > 0"
          :ref="(el) => setElement(separatorEls, index, el)"
          class="mt-breadcrumb__separator"
          :class="{ 'mt-breadcrumb__separator--collapsed': collapsedSeparators.includes(index) }"
          role="presentation"
          aria-hidden="true"
        >
          /
        </li>

        <li
          v-if="index === 1"
          :ref="setEllipsis"
          class="mt-breadcrumb__ellipsis"
          :class="{ 'mt-breadcrumb__ellipsis--collapsed': !showEllipsis }"
          role="presentation"
          aria-hidden="true"
        >
          …
        </li>

        <li
          :ref="(el) => setElement(crumbEls, index, el)"
          class="mt-breadcrumb__crumb"
          :class="{
            'mt-breadcrumb__crumb--current': isCurrent(index),
            'mt-breadcrumb__crumb--collapsed': collapsedCrumbs.includes(index),
          }"
        >
          <component
            :is="item.as ?? linkAs"
            v-if="isLink(item, index)"
            class="mt-breadcrumb__link"
            v-bind="linkAttributes(item)"
            @click="$emit('click', item, $event)"
          >
            <slot name="item" :item="item" :index="index" :current="false">{{ item.label }}</slot>
          </component>

          <span
            v-else
            class="mt-breadcrumb__label"
            :aria-current="isCurrent(index) ? 'page' : undefined"
          >
            <slot name="item" :item="item" :index="index" :current="isCurrent(index)">
              {{ item.label }}
            </slot>
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script lang="ts">
import type { Component } from "vue";

export interface BreadcrumbItem {
  label: string;
  to?: string | Record<string, unknown>;
  as?: string | Component;
}
</script>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, onUpdated, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useResizeObserver } from "@vueuse/core";
import { computeCollapsed, type BreadcrumbChild } from "./_internal/mt-breadcrumb-collapse";

const props = withDefaults(
  defineProps<{
    /**
     * The crumbs from the root of the hierarchy to the current page. An item with a `to`
     * renders as a link, the last item always renders as the current page.
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
  }>(),
  {
    size: "xs",
    overflow: "collapse",
    ariaLabel: undefined,
    linkAs: "router-link",
  },
);

defineEmits<{
  (e: "click", item: BreadcrumbItem, event: MouseEvent): void;
}>();

defineSlots<{
  /**
   * Replaces the label of a crumb. Receives the item, its index and whether it is the current page.
   */
  item?: (props: { item: BreadcrumbItem; index: number; current: boolean }) => unknown;
}>();

const { t } = useI18n({
  messages: {
    en: {
      ariaLabel: "Breadcrumb",
    },
    de: {
      ariaLabel: "Brotkrumennavigation",
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

let frame: number | undefined;
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

function linkAttributes(item: BreadcrumbItem) {
  if ((item.as ?? props.linkAs) === "router-link") return { to: item.to };

  return typeof item.to === "string" ? { href: item.to } : {};
}

function requestLayout() {
  if (unmounted || frame !== undefined) return;

  frame = window.requestAnimationFrame(() => {
    frame = undefined;
    layout();
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

function applyCollapsed(hidden: MeasuredChild[]) {
  const crumbs = hidden.filter((child) => child.kind === "item").map((child) => child.index);
  const separators = hidden
    .filter((child) => child.kind === "separator")
    .map((child) => child.index);

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
    child.element.style.removeProperty("--mt-breadcrumb-natural-width");
    child.element.style.removeProperty("--mt-breadcrumb-shrink");
  });

  if (props.overflow !== "collapse") {
    applyCollapsed([]);
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
  applyCollapsed(hidden);
}

useResizeObserver(navEl, ([entry]) => {
  const width = entry.contentRect.width;
  if (width === lastWidth) return;

  lastWidth = width;
  requestLayout();
});

onMounted(() => {
  requestLayout();
  document.fonts?.ready.then(requestLayout);
});

onUpdated(requestLayout);

onBeforeUnmount(() => {
  unmounted = true;
  if (frame !== undefined) window.cancelAnimationFrame(frame);
});
</script>

<style scoped>
.mt-breadcrumb {
  --mt-breadcrumb-item-min-width: 8ch;

  min-width: 0;
  max-width: 100%;
  font-family: var(--font-family-body);
  color: var(--color-text-secondary-default);
}

.mt-breadcrumb--size-xs {
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
}

.mt-breadcrumb--size-s {
  font-size: var(--font-size-s);
  line-height: var(--font-line-height-s);
}

.mt-breadcrumb__list {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  column-gap: var(--scale-size-6);
  min-width: 0;
  margin: 0;
  padding: 0;
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

.mt-breadcrumb__crumb--current {
  color: var(--color-text-primary-default);
  font-weight: var(--font-weight-semibold);
}

.mt-breadcrumb__separator,
.mt-breadcrumb__ellipsis {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--color-text-tertiary-default);
  user-select: none;
}

.mt-breadcrumb__list:not([data-measuring]) > .mt-breadcrumb__crumb--collapsed,
.mt-breadcrumb__list:not([data-measuring]) > .mt-breadcrumb__separator--collapsed,
.mt-breadcrumb__list:not([data-measuring]) > .mt-breadcrumb__ellipsis--collapsed {
  display: none;
}

.mt-breadcrumb__link,
.mt-breadcrumb__label {
  display: block;
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
