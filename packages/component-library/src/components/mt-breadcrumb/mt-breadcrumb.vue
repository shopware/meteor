<template>
  <nav
    ref="navEl"
    class="mt-breadcrumb"
    :class="[`mt-breadcrumb--size-${size}`, `mt-breadcrumb--overflow-${overflow}`]"
    :aria-label="ariaLabel ?? t('ariaLabel')"
  >
    <ol ref="listEl" class="mt-breadcrumb__list">
      <li
        class="mt-breadcrumb__ellipsis"
        data-mt-breadcrumb="ellipsis"
        data-collapsed
        role="presentation"
        aria-hidden="true"
      >
        …
      </li>
      <slot />
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useResizeObserver } from "@vueuse/core";
import { BreadcrumbContext } from "./_internal/mt-breadcrumb-context";
import { computeCollapsed, type BreadcrumbChild } from "./_internal/mt-breadcrumb-collapse";

const props = withDefaults(
  defineProps<{
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
  }>(),
  {
    size: "xs",
    overflow: "collapse",
    ariaLabel: undefined,
  },
);

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

const navEl = ref<HTMLElement | null>(null);
const listEl = ref<HTMLElement | null>(null);

const SHRINK_SCALE = 1000;

let frame: number | undefined;
let lastWidth = 0;
let unmounted = false;

function requestLayout() {
  if (unmounted || frame !== undefined) return;

  frame = window.requestAnimationFrame(() => {
    frame = undefined;
    layout();
  });
}

function measure(children: HTMLElement[]): BreadcrumbChild[] {
  return children.map((child) => {
    const kind = (child.dataset.mtBreadcrumb ?? "item") as BreadcrumbChild["kind"];
    const width = child.getBoundingClientRect().width;
    if (kind !== "item") return { kind, width };

    child.style.setProperty("--mt-breadcrumb-natural-width", `${width}px`);
    const floor = parseFloat(window.getComputedStyle(child).minWidth);
    if (Number.isNaN(floor)) return { kind, width };

    // Shrink proportionally to the slack above the floor, so every label reaches its
    // minimum width at the same moment and short labels are not squeezed early. Scaled up
    // because flexbox only distributes the full overflow when the factors sum to at least 1.
    const shrink = ((width - floor) / width) * SHRINK_SCALE || 0;
    child.style.setProperty("--mt-breadcrumb-shrink", String(shrink));

    return { kind, width: floor };
  });
}

function layout() {
  const nav = navEl.value;
  const list = listEl.value;
  if (!nav || !list) return;

  const children = Array.from(list.children) as HTMLElement[];
  children.forEach((child) => {
    child.removeAttribute("data-collapsed");
    child.removeAttribute("data-leading");
    child.style.removeProperty("--mt-breadcrumb-natural-width");
    child.style.removeProperty("--mt-breadcrumb-shrink");
  });

  const ellipsis = children.find((child) => child.dataset.mtBreadcrumb === "ellipsis");

  if (props.overflow !== "collapse") {
    ellipsis?.setAttribute("data-collapsed", "");
    return;
  }

  list.setAttribute("data-measuring", "");
  const listStyle = window.getComputedStyle(list);
  const navStyle = window.getComputedStyle(nav);
  const gap = parseFloat(listStyle.columnGap) || 0;
  // Read while every crumb is visible: in intrinsically sized layouts (auto grid tracks,
  // flex rows) this is the width the container grants the full trail, so collapsing
  // converges instead of shrinking the trail step by step.
  const padding =
    (parseFloat(navStyle.paddingLeft) || 0) + (parseFloat(navStyle.paddingRight) || 0);
  const available = nav.getBoundingClientRect().width - padding;
  const hidden = computeCollapsed(measure(children), available, gap);
  list.removeAttribute("data-measuring");

  hidden.forEach((index) => {
    children[index].setAttribute("data-collapsed", "");
  });

  const firstCrumb = children.findIndex((child) => child.dataset.mtBreadcrumb === "item");
  if (firstCrumb < 0) return;

  children[firstCrumb].setAttribute("data-leading", "");

  const afterFirstCrumb = children[firstCrumb + 1];
  if (afterFirstCrumb?.dataset.mtBreadcrumb === "separator") {
    afterFirstCrumb.setAttribute("data-leading", "");
  }
}

useResizeObserver(navEl, ([entry]) => {
  const width = entry.contentRect.width;
  if (width === lastWidth) return;

  lastWidth = width;
  requestLayout();
});

watch(() => props.overflow, requestLayout);

onMounted(() => {
  document.fonts?.ready.then(requestLayout);
});

onBeforeUnmount(() => {
  unmounted = true;
  if (frame !== undefined) window.cancelAnimationFrame(frame);
});

provide(BreadcrumbContext, { requestLayout });
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

.mt-breadcrumb--overflow-wrap .mt-breadcrumb__list {
  flex-wrap: wrap;
  row-gap: var(--scale-size-4);
  overflow: visible;
}

.mt-breadcrumb__ellipsis {
  order: -1;
  flex-shrink: 0;
  color: var(--color-text-tertiary-default);
  user-select: none;
}

.mt-breadcrumb__ellipsis[data-collapsed] {
  display: none;
}
</style>
