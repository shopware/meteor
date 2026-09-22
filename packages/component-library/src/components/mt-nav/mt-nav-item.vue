<template>
  <mt-collapsible
    v-if="hasCollapsibleSubtree"
    as="li"
    :class="rowClasses"
    :aria-current="rowActive ? 'page' : 'false'"
    :open="subtreeOpen"
    @update:open="setSubtreeOpen"
  >
    <div class="mt-nav__item-row">
      <component
        :is="linkTag"
        class="mt-nav__link"
        :class="{ 'is--active': rowActive }"
        v-bind="linkAttrs"
        v-on="to || href ? { click: onLinkClick } : {}"
      >
        <mt-icon
          v-if="icon && depth === 1"
          size="16px"
          class="mt-nav__link-icon"
          :name="iconName"
        />

        <span class="mt-nav__link-label" :title="label">
          {{ label }}
        </span>

        <slot name="suffix" />

        <span class="mt-nav__link-expand-icon-box">
          <mt-icon :name="expandIcon" size="8" class="mt-nav__link-expand-icon" />
        </span>
      </component>
    </div>

    <mt-collapsible-content as="ul" class="mt-nav__sub-list">
      <slot />
    </mt-collapsible-content>
  </mt-collapsible>

  <li v-else :class="rowClasses" :aria-current="rowActive ? 'page' : 'false'">
    <div class="mt-nav__item-row">
      <component
        :is="linkTag"
        class="mt-nav__link"
        :class="{ 'is--active': rowActive }"
        v-bind="linkAttrs"
        v-on="to || href ? { click: onLinkClick } : {}"
      >
        <mt-icon
          v-if="icon && depth === 1"
          size="16px"
          class="mt-nav__link-icon"
          :name="iconName"
        />

        <span class="mt-nav__link-label" :title="label">
          {{ label }}
        </span>

        <slot name="suffix" />
      </component>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, provide, ref, useId, useSlots, watch } from "vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtCollapsible from "@/components/mt-collapsible/mt-collapsible.vue";
import MtCollapsibleTrigger from "@/components/mt-collapsible/mt-collapsible-trigger.vue";
import MtCollapsibleContent from "@/components/mt-collapsible/mt-collapsible-content.vue";
import { NAV_CONTEXT, NAV_ITEM_CONTEXT, type NavLinkTarget } from "./_internal/mt-nav-context";

const MAX_NESTING_LEVEL = 3;

const props = defineProps<{
  /**
   * Translated label of the row.
   */
  label: string;
  /**
   * Icon name of the meteor icon kit, e.g. `regular-products`. Shown on top-level rows only.
   */
  icon?: string;
  /**
   * Route location handed to the link component of the navigation as `to`.
   */
  to?: NavLinkTarget;
  /**
   * External URL, rendered as a plain anchor when no `to` is set.
   */
  href?: string;
  /**
   * Anchor target for `href`.
   */
  target?: string;
  /**
   * Whether the row is the current page. Its ancestors open and highlight accordingly.
   */
  active?: boolean;
}>();

defineSlots<{
  /** Nested `mt-nav-item` rows, up to three levels deep in total. */
  default?: () => unknown;
  /** Rendered after the label, e.g. for a badge or counter. */
  suffix?: () => unknown;
}>();

const slots = useSlots();

const context = inject(NAV_CONTEXT);

if (!context) {
  throw new Error("mt-nav-item must be rendered inside mt-nav");
}

const parent = inject(NAV_ITEM_CONTEXT, null);
const depth = parent ? parent.depth + 1 : 1;
const key = useId();

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
const activeChildKey = computed(() => activeDescendants.value[0] ?? null);
const hasActiveDescendant = computed(() => activeDescendants.value.length > 0);
const isActive = computed(() => props.active || hasActiveDescendant.value);

provide(NAV_ITEM_CONTEXT, {
  depth,
  reportActive(childKey, active) {
    // Records whether a nested row is active or holds the active row
    if (active === activeDescendants.value.includes(childKey)) {
      return;
    }

    activeDescendants.value = active
      ? [...activeDescendants.value, childKey]
      : activeDescendants.value.filter((existing) => existing !== childKey);
  },
});

if (parent) {
  watch(isActive, (active) => parent.reportActive(key, active), { immediate: true });
  onBeforeUnmount(() => parent.reportActive(key, false));
} else {
  onBeforeUnmount(context.registerBranch({ key, hasChildren, isActive, activeChildKey }));
}

// The user's last toggle of a nested row. Unset, the row is open while it holds the active row.
const manualOpen = ref<boolean | null>(null);

// A manual collapse holds until the active row changes
watch(activeDescendants, () => {
  if (manualOpen.value === false) {
    manualOpen.value = null;
  }
});

// Top-level rows are opened by the navigation, which keeps one branch open at a time
const subtreeOpen = computed(() =>
  depth === 1 ? context.isBranchExpanded(key) : manualOpen.value ?? hasActiveDescendant.value,
);

// A closed branch stands in for the active row it hides
const rowActive = computed(() => props.active || (hasActiveDescendant.value && !subtreeOpen.value));

const childActive = computed(() => hasActiveDescendant.value && subtreeOpen.value);

const expandIcon = computed(() =>
  subtreeOpen.value ? "regular-chevron-up-xs" : "regular-chevron-down-xs",
);

const iconName = computed(() =>
  props.icon ? getIconName(props.icon, rowActive.value || childActive.value) : undefined,
);

const rowClasses = computed(() => [
  "mt-nav__list-item",
  {
    "mt-nav__list-item--nested": depth > 1,
    "is--entry-expanded": subtreeOpen.value,
    "is--child-active": childActive.value,
  },
]);

const linkTag = computed(() => {
  if (props.to) {
    return context.linkComponent.value;
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
      "aria-expanded": hasCollapsibleSubtree.value ? subtreeOpen.value : undefined,
    };
  }

  if (props.href) {
    return { href: props.href, target: props.target, title: props.label };
  }

  return hasCollapsibleSubtree.value ? { type: "button" } : {};
});

function getIconName(name: string, isActive: boolean) {
  // Swaps a regular icon for its solid variant while the row is active
  return isActive && name.startsWith("regular-") ? name.replace("regular-", "solid-") : name;
}

function onLinkClick() {
  // Reports the click to the navigation and, for a link with nested rows, toggles them too
  if (hasCollapsibleSubtree.value) {
    setSubtreeOpen(!subtreeOpen.value);
  }

  context.onLinkClick({ label: props.label, to: props.to, href: props.href });
}

function setSubtreeOpen(open: boolean) {
  // Opens or closes the nested rows: the navigation decides for top-level rows, the row itself below
  if (depth === 1) {
    context.onBranchToggle(key, open);
  } else {
    manualOpen.value = open;
  }
}
</script>

<style>
.mt-nav__list-item .mt-collapsible-content[data-state="open"],
.mt-nav__list-item .mt-collapsible-content[data-state="closed"] {
  animation-duration: 0.3s;
  animation-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
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
}

.mt-nav__link:not(.is--active):hover {
  background: var(--color-interaction-secondary-hover);
}

.mt-nav__link:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: calc(-1 * var(--scale-size-2));
}

.mt-nav__link .mt-icon {
  flex-shrink: 0;
}

.mt-nav__link .mt-nav__link-label {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex-grow: 1;
  text-align: left;
  min-width: 0;
}

/* Native button variants of the navigation link, dropping the user agent chrome */
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

/* Nested rows draw a tree line at the offset and indent their link past it */
.mt-nav__list-item--nested {
  --mt-nav-tree-line-offset: 18px;
  --mt-nav-tree-indent: 36px;
}

.mt-nav__list-item--nested > .mt-nav__sub-list {
  margin-left: var(--mt-nav-tree-line-offset);
  position: relative;
  padding-left: calc(var(--mt-nav-tree-indent) - var(--mt-nav-tree-line-offset) - 1px);
}

.mt-nav__list-item--nested > .mt-nav__sub-list::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--color-border-secondary-default);
  border-radius: 1px;
}

/* Shorten the tree line when the last visible row is a closed leaf */
.mt-nav__list-item--nested:last-child
  > .mt-nav__sub-list:has(> .mt-nav__list-item:last-child:not(.is--entry-expanded))::before {
  bottom: var(--scale-size-12);
}

.mt-nav__list-item--nested > .mt-nav__item-row > .mt-nav__link {
  padding-left: var(--mt-nav-tree-indent);
}

.mt-nav__list-item--nested > .mt-nav__item-row > .mt-nav__link::before {
  content: "";
  position: absolute;
  left: var(--mt-nav-tree-line-offset);
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--color-border-secondary-default);
  border-radius: 1px;
}

/* The transparent outline acts as a colour-swappable halo, so no extra element is needed */
.mt-nav__list-item--nested > .mt-nav__item-row > .mt-nav__link::after {
  content: "";
  position: absolute;
  left: calc(var(--mt-nav-tree-line-offset) - 1px);
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  border-radius: 5px;
  opacity: 0;
  pointer-events: none;
  outline: 4px solid transparent;
}

.mt-nav__list-item--nested > .mt-nav__item-row > .mt-nav__link:not(.is--active):hover::after {
  opacity: 1;
  background: var(--color-border-primary-default);
  outline-color: var(--color-interaction-secondary-hover);
}

.mt-nav__list-item--nested > .mt-nav__item-row > .mt-nav__link.is--active::after {
  opacity: 1;
  background: var(--color-icon-brand-default);
  outline-color: var(--color-background-brand-default);
}

.mt-nav__list-item--nested.is--child-active > .mt-nav__item-row > .mt-nav__link::after {
  opacity: 1;
  background: var(--color-border-primary-default);
  outline-color: var(--color-elevation-surface-sunken);
}

.mt-nav__list-item--nested.is--child-active > .mt-nav__item-row > .mt-nav__link:hover::after {
  outline-color: var(--color-interaction-secondary-hover);
}

.mt-nav__list-item--nested:first-child > .mt-nav__item-row > .mt-nav__link::before {
  top: var(--scale-size-12);
}

.mt-nav__list-item--nested:last-child:not(.is--entry-expanded)
  > .mt-nav__item-row
  > .mt-nav__link::before {
  bottom: var(--scale-size-12);
}

.mt-nav__list-item:not(.mt-nav__list-item--nested) > .mt-nav__item-row > .mt-nav__link.is--active {
  background: var(--color-background-brand-default);
}

.mt-nav__link.is--active {
  background: none;
  color: var(--color-icon-brand-default);
}

.mt-nav__link.is--active .mt-nav__link-icon {
  color: var(--color-icon-brand-default);
}

.mt-nav__list-item.is--entry-expanded .mt-nav__link-label,
.mt-nav__list-item.is--entry-expanded .mt-nav__link-expand-icon {
  color: var(--color-text-primary-default);
}

.mt-nav__list-item.is--entry-expanded
  > .mt-nav__item-row
  > .mt-nav__link.is--active
  .mt-nav__link-label,
.mt-nav__list-item.is--entry-expanded
  > .mt-nav__item-row
  > .mt-nav__link.is--active
  .mt-nav__link-expand-icon {
  color: var(--color-icon-brand-default);
}
</style>
