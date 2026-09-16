<template>
  <mt-collapsible
    v-if="hasCollapsibleSubtree"
    as="li"
    :class="rowClasses"
    :aria-current="rowActive ? 'page' : 'false'"
    :open="collapsibleOpen"
    @update:open="onCollapsibleOpenUpdate"
  >
    <div class="mt-nav__item-row">
      <component
        :is="linkTag"
        class="mt-nav__link"
        :class="{ 'is--active': rowActive }"
        :aria-label="collapsedAriaLabel"
        v-bind="linkAttrs"
        v-on="to || href ? { click: onLinkClick } : {}"
      >
        <mt-icon
          v-if="icon && depth === 1"
          size="16px"
          class="mt-nav__link-icon"
          :name="iconName"
        />

        <span
          class="mt-nav__link-label mt-nav__collapsible-text mt-nav__hide-on-collapse"
          :title="label"
        >
          {{ label }}
        </span>

        <slot name="suffix" />

        <span class="mt-nav__link-expand-icon-box">
          <mt-icon
            :name="expandIcon"
            size="8"
            class="mt-nav__link-expand-icon mt-nav__collapsible-text mt-nav__hide-on-collapse"
          />
        </span>
      </component>
    </div>

    <mt-collapsible-content as="ul" class="mt-nav__sub-list">
      <slot />
    </mt-collapsible-content>
  </mt-collapsible>

  <li v-else :class="rowClasses" :aria-current="rowActive ? 'page' : 'false'">
    <mt-tooltip :content="label" placement="right">
      <template #default="tooltipProps">
        <div class="mt-nav__item-row" v-bind="collapsedTooltipTriggerProps(tooltipProps)">
          <component
            :is="linkTag"
            class="mt-nav__link"
            :class="{ 'is--active': rowActive }"
            :aria-label="collapsedAriaLabel"
            v-bind="linkAttrs"
            v-on="to || href ? { click: onLinkClick } : {}"
          >
            <mt-icon
              v-if="icon && depth === 1"
              size="16px"
              class="mt-nav__link-icon"
              :name="iconName"
            />

            <span
              class="mt-nav__link-label mt-nav__collapsible-text mt-nav__hide-on-collapse"
              :title="label"
            >
              {{ label }}
            </span>

            <slot name="suffix" />
          </component>
        </div>
      </template>
    </mt-tooltip>
  </li>
</template>

<script setup lang="ts">
import {
  computed,
  inject,
  onBeforeUnmount,
  provide,
  ref,
  useId,
  useSlots,
  watch,
  type PropType,
} from "vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtTooltip from "@/components/mt-tooltip/mt-tooltip.vue";
import MtCollapsible from "@/components/mt-collapsible/mt-collapsible.vue";
import MtCollapsibleTrigger from "@/components/mt-collapsible/mt-collapsible-trigger.vue";
import MtCollapsibleContent from "@/components/mt-collapsible/mt-collapsible-content.vue";
import { NAV_CONTEXT, NAV_ITEM_CONTEXT } from "./_internal/mt-nav-context";
import type { NavLinkTarget } from "./mt-nav.types";

const MAX_NESTING_LEVEL = 3;

/**
 * Props of the tooltip trigger that open it; stripped when the row shows no tooltip.
 */
const TOOLTIP_OPEN_TRIGGER_PROPS = ["onMouseover", "onFocus", "aria-describedby"];

const props = defineProps({
  /**
   * Translated label of the row.
   */
  label: {
    type: String,
    required: true,
  },
  /**
   * Icon name of the meteor icon kit, e.g. `regular-products`. Shown on top-level rows only.
   */
  icon: {
    type: String,
    default: undefined,
  },
  /**
   * Route location handed to the link component of the navigation as `to`.
   */
  to: {
    type: [String, Object] as PropType<NavLinkTarget>,
    default: undefined,
  },
  /**
   * External URL, rendered as a plain anchor when no `to` is set.
   */
  href: {
    type: String,
    default: undefined,
  },
  /**
   * Anchor target for `href`.
   */
  target: {
    type: String,
    default: undefined,
  },
  /**
   * Whether the row is the current page. Its ancestors open and highlight accordingly.
   */
  active: {
    type: Boolean,
    default: false,
  },
});

defineSlots<{
  /** Nested `mt-nav-item` rows, up to three levels deep in total. */
  default?: () => unknown;
  /** Rendered after the label, e.g. for a badge or counter. */
  suffix?: () => unknown;
}>();

const slots = useSlots();

const injectedContext = inject(NAV_CONTEXT);

if (!injectedContext) {
  throw new Error("mt-nav-item must be rendered inside mt-nav");
}

const context = injectedContext;
const parent = inject(NAV_ITEM_CONTEXT, null);
const depth = parent ? parent.depth + 1 : 1;
const key = useId();

const linkComponent = context.linkComponent;
const navExpanded = context.expanded;

const hasChildren = computed(() => !!slots.default);

// The navigation supports at most three levels; deeper rows are leaf items only
const isLeafDepth = depth >= MAX_NESTING_LEVEL;

if (isLeafDepth && slots.default) {
  console.error(
    `[mt-nav] The navigation item "${props.label}" has nested items on level 4 or higher. ` +
      "The navigation only supports up to three levels of nesting.",
  );
}

const hasCollapsibleSubtree = computed(() => hasChildren.value && !isLeafDepth);

// Keys of the nested rows that are active themselves or hold the active row
const activeDescendants = ref<string[]>([]);
const hasActiveDescendant = computed(() => activeDescendants.value.length > 0);
const isActive = computed(() => props.active || hasActiveDescendant.value);

const suppressActiveKeepsOpen = ref(false);
const manualNestedOpen = ref(false);

provide(NAV_ITEM_CONTEXT, {
  depth,
  reportActive(childKey, active) {
    const others = activeDescendants.value.filter((existing) => existing !== childKey);

    activeDescendants.value = active ? [...others, childKey] : others;
  },
});

if (parent) {
  const parentContext = parent;

  watch(isActive, (active) => parentContext.reportActive(key, active), { immediate: true });
  onBeforeUnmount(() => parentContext.reportActive(key, false));
} else {
  onBeforeUnmount(context.registerBranch({ key, hasChildren, isActive }));
}

// A manual collapse holds until the active row changes
watch(
  () => activeDescendants.value.join(","),
  () => {
    suppressActiveKeepsOpen.value = false;
  },
);

const activeKeepsOpen = computed(() => hasActiveDescendant.value && !suppressActiveKeepsOpen.value);

const submenuVisuallyOpen = computed(() => {
  if (depth === 1) {
    if (!navExpanded.value) {
      return false;
    }

    const branchExpanded = context.isBranchExpanded(key);

    return context.hasExpandedBranches.value
      ? branchExpanded
      : branchExpanded || activeKeepsOpen.value;
  }

  return activeKeepsOpen.value || manualNestedOpen.value;
});

const collapsibleOpen = computed(() => hasCollapsibleSubtree.value && submenuVisuallyOpen.value);

// A closed branch stands in for the active row it hides
const rowActive = computed(
  () => props.active || (hasActiveDescendant.value && !submenuVisuallyOpen.value),
);

const childActive = computed(() => hasActiveDescendant.value && submenuVisuallyOpen.value);

const expandIcon = computed(() =>
  submenuVisuallyOpen.value ? "regular-chevron-up-xs" : "regular-chevron-down-xs",
);

const iconName = computed(() => getIconName(props.icon, rowActive.value || childActive.value));

const rowClasses = computed(() => [
  "mt-nav__list-item",
  {
    "mt-nav__list-item--nested": depth > 1,
    "is--entry-expanded": submenuVisuallyOpen.value,
    "is--child-active": childActive.value,
  },
]);

// Collapsed top-level rows hide their label, so the accessible name needs an aria-label.
const collapsedAriaLabel = computed(() =>
  !navExpanded.value && depth === 1 ? props.label : undefined,
);

const linkTag = computed(() => {
  if (props.to) {
    return linkComponent.value;
  }

  if (props.href) {
    return "a";
  }

  return hasCollapsibleSubtree.value ? MtCollapsibleTrigger : "span";
});

const linkAttrs = computed(() => {
  if (props.to) {
    return {
      to: props.to,
      "aria-expanded": hasCollapsibleSubtree.value ? collapsibleOpen.value : undefined,
    };
  }

  if (props.href) {
    return { href: props.href, target: props.target, title: props.label };
  }

  return hasCollapsibleSubtree.value ? { type: "button" } : {};
});

// Collapsed top-level rows without children hide their label, which stays accessible via a tooltip
const showsCollapsedTooltip = computed(
  () => !navExpanded.value && depth === 1 && !hasChildren.value,
);

function collapsedTooltipTriggerProps(tooltipProps: Record<string, unknown>) {
  if (showsCollapsedTooltip.value) {
    // Focus does not bubble to the non-focusable row, focusin/focusout do
    const { onFocus, onBlur, ...bubblingProps } = tooltipProps;

    return { ...bubblingProps, onFocusin: onFocus, onFocusout: onBlur };
  }

  return Object.fromEntries(
    Object.entries(tooltipProps).filter(([key]) => !TOOLTIP_OPEN_TRIGGER_PROPS.includes(key)),
  );
}

function getIconName(name: string | undefined, isActive: boolean) {
  if (isActive && typeof name === "string") {
    if (name.startsWith("regular-")) {
      return name.replace("regular-", "solid-");
    }

    if (name.startsWith("icon/regular/")) {
      return name.replace("icon/regular/", "icon/solid/");
    }
  }

  return `${name}`;
}

function onLinkClick() {
  // A link with nested rows also toggles them
  if (hasCollapsibleSubtree.value) {
    onCollapsibleOpenUpdate(!collapsibleOpen.value);
  }

  context.onLinkClick({ label: props.label, to: props.to, href: props.href });
}

function onCollapsibleOpenUpdate(open: boolean) {
  suppressActiveKeepsOpen.value = !open;

  if (depth >= 2) {
    manualNestedOpen.value = open;
  }

  if (depth === 1 && navExpanded.value) {
    context.onBranchToggle(key, open);
  }
}
</script>

<style lang="scss">
$nesting-line-offset: 18px;
$nesting-line-indent: 36px;

.mt-nav__list-item {
  .mt-collapsible-content[data-state="open"],
  .mt-collapsible-content[data-state="closed"] {
    animation-duration: 0.3s;
    animation-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
  }
}

.mt-nav__link {
  color: var(--color-text-primary-default);
  display: flex;
  height: var(--scale-size-36);
  align-items: center;
  align-self: stretch;
  justify-content: flex-start;
  gap: var(--scale-size-10);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  padding: 0 var(--scale-size-6) 0 var(--scale-size-10);
  text-decoration: none;
  text-align: left;
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  cursor: pointer;
  position: relative;
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius-s);

  &:not(.is--active):hover {
    background: var(--color-interaction-secondary-hover);
  }

  &:focus-visible {
    outline: var(--scale-size-2) solid var(--color-border-brand-default);
    outline-offset: calc(-1 * var(--scale-size-2));
  }

  .mt-icon {
    flex-shrink: 0;
  }

  .mt-nav__link-label {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex-grow: 1;
    text-align: left;
    min-width: 0;
  }
}

// Native button variants of the navigation link, dropping the user agent chrome
.mt-nav__item-row button.mt-nav__link {
  border: 0;
  background: none;
}

.mt-nav__item-row {
  display: flex;
  align-items: stretch;
}

.mt-nav__link-expand-icon {
  flex-shrink: 0;
  color: var(--color-icon-primary-default);
}

.mt-nav__link-expand-icon-box {
  width: var(--scale-size-24);
  height: var(--scale-size-24);
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.mt-nav__sub-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.mt-nav__list-item--nested > .mt-nav__sub-list {
  margin-left: $nesting-line-offset;
  position: relative;
  padding-left: $nesting-line-indent - $nesting-line-offset - 1px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--color-border-secondary-default);
    border-radius: 1px;
  }
}

// Shorten the tree line when the last visible row is a closed leaf
.mt-nav__list-item--nested:last-child
  > .mt-nav__sub-list:has(> .mt-nav__list-item:last-child:not(.is--entry-expanded))::before {
  bottom: var(--scale-size-12);
}

.mt-nav__list-item--nested > .mt-nav__item-row > .mt-nav__link {
  padding-left: $nesting-line-indent;

  &::before {
    content: "";
    position: absolute;
    left: $nesting-line-offset;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--color-border-secondary-default);
    border-radius: 1px;
  }

  // The transparent outline acts as a colour-swappable halo, so no extra element is needed
  &::after {
    content: "";
    position: absolute;
    left: $nesting-line-offset - 1px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 16px;
    border-radius: 5px;
    opacity: 0;
    pointer-events: none;
    outline: 4px solid transparent;
  }

  &:not(.is--active):hover::after {
    opacity: 1;
    background: var(--color-border-primary-default);
    outline-color: var(--color-interaction-secondary-hover);
  }

  &.is--active::after {
    opacity: 1;
    background: var(--color-icon-brand-default);
    outline-color: var(--color-background-brand-default);
  }
}

.mt-nav__list-item--nested.is--child-active > .mt-nav__item-row {
  > .mt-nav__link::after {
    opacity: 1;
    background: var(--color-border-primary-default);
    outline-color: var(--color-elevation-surface-sunken);
  }

  > .mt-nav__link:hover::after {
    outline-color: var(--color-interaction-secondary-hover);
  }
}

.mt-nav__list-item--nested:first-child > .mt-nav__item-row {
  > .mt-nav__link::before {
    top: var(--scale-size-12);
  }
}

.mt-nav__list-item--nested:last-child:not(.is--entry-expanded) > .mt-nav__item-row {
  > .mt-nav__link::before {
    bottom: var(--scale-size-12);
  }
}

.mt-nav__list-item:not(.mt-nav__list-item--nested) > .mt-nav__item-row {
  > .mt-nav__link.is--active {
    background: var(--color-background-brand-default);
  }
}

.mt-nav__link.is--active {
  background: none;
  color: var(--color-icon-brand-default);

  .mt-nav__collapsible-text {
    color: var(--color-icon-brand-default);
  }

  .mt-nav__link-icon {
    color: var(--color-icon-brand-default);
  }
}

.mt-nav__list-item.is--entry-expanded {
  .mt-nav__collapsible-text {
    color: var(--color-text-primary-default);
  }

  & > .mt-nav__item-row > .mt-nav__link.is--active .mt-nav__collapsible-text {
    color: var(--color-icon-brand-default);
  }
}

// Tree lines and indicators follow .mt-nav__hide-on-collapse timing, scoped to the toggle window
.mt-nav.is--toggling .mt-nav__list-item--nested {
  > .mt-nav__sub-list::before,
  > .mt-nav__item-row > .mt-nav__link::before,
  > .mt-nav__item-row > .mt-nav__link::after {
    transition:
      opacity 0.3s ease-in-out 0.1s,
      visibility 0.3s ease-in-out 0.1s;
  }
}

.mt-nav.is--collapsed .mt-nav__list-item--nested {
  > .mt-nav__sub-list::before,
  > .mt-nav__item-row > .mt-nav__link::before,
  > .mt-nav__item-row > .mt-nav__link::after {
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.05s ease-out,
      visibility 0.05s ease-out;
  }
}
</style>
