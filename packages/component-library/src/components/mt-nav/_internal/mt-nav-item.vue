<template>
  <component :is="rowComponent" v-bind="rowProps" class="mt-nav__list-item" :class="rowClasses">
    <div class="mt-nav__item-row">
      <component
        :is="linkTag"
        class="mt-nav__link"
        :class="{ 'is--active': rowActive }"
        :aria-current="rowActive ? 'page' : undefined"
        v-bind="linkAttrs"
      >
        <mt-icon
          v-if="iconName && depth === 1"
          :name="iconName"
          size="16"
          class="mt-nav__link-icon"
        />

        <span class="mt-nav__link-label" :title="item.label">
          {{ item.label }}
        </span>

        <component :is="context.slots.suffix" v-if="context.slots.suffix" :item="item" />

        <span v-if="hasChildren" class="mt-nav__link-expand-icon-box">
          <mt-icon
            :name="subtreeOpen ? 'regular-chevron-up-xs' : 'regular-chevron-down-xs'"
            size="8"
            class="mt-nav__link-expand-icon"
          />
        </span>
      </component>
    </div>

    <mt-collapsible-content v-if="hasChildren" as="ul" class="mt-nav__sub-list">
      <mt-nav-item
        v-for="child in item.children"
        :key="child.label"
        :item="child"
        :depth="depth + 1"
        :branch-key="branchKey"
      />
    </mt-collapsible-content>
  </component>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtCollapsible from "@/components/mt-collapsible/mt-collapsible.vue";
import MtCollapsibleTrigger from "@/components/mt-collapsible/mt-collapsible-trigger.vue";
import MtCollapsibleContent from "@/components/mt-collapsible/mt-collapsible-content.vue";
import {
  MAX_NESTING_LEVEL,
  hasNestedItems,
  isItemActive,
  useNavContext,
  type NavItem,
} from "./mt-nav-context";

const props = defineProps<{
  item: NavItem;
  /** Nesting depth of the row, starting at 1 for the top level. */
  depth: number;
  /** Key of the top-level row this row belongs to, under which the navigation keeps the open state. */
  branchKey: string;
}>();

const context = useNavContext();

const isLeafDepth = props.depth >= MAX_NESTING_LEVEL;

if (isLeafDepth && hasNestedItems(props.item)) {
  console.error(
    `[mt-nav] The navigation item "${props.item.label}" has nested items on level ${MAX_NESTING_LEVEL + 1} or higher. ` +
      `The navigation only supports up to ${MAX_NESTING_LEVEL} levels of nesting.`,
  );
}

// Rows on the last supported level are leaves even when they have nested items
const hasChildren = computed(() => hasNestedItems(props.item) && !isLeafDepth);

// The nested row that is active or holds the active row
const activeChildLabel = computed(() => props.item.children?.find(isItemActive)?.label ?? null);

const hasActiveDescendant = computed(() => activeChildLabel.value !== null);

// The user's last toggle of a nested row. Unset, the row is open while it holds the active row.
const manualOpen = ref<boolean | null>(null);

// A manual collapse holds until the active row changes
watch(activeChildLabel, () => {
  if (manualOpen.value === false) {
    manualOpen.value = null;
  }
});

// Top-level rows are opened by the navigation, which keeps one branch open at a time
const subtreeOpen = computed(() =>
  props.depth === 1
    ? context.isBranchExpanded(props.branchKey)
    : manualOpen.value ?? hasActiveDescendant.value,
);

// A closed branch stands in for the active row it hides
const rowActive = computed(
  () => !!props.item.active || (hasActiveDescendant.value && !subtreeOpen.value),
);

const childActive = computed(() => hasActiveDescendant.value && subtreeOpen.value);

// Active rows show the solid variant of their regular icon
const iconName = computed(() =>
  rowActive.value || childActive.value
    ? props.item.icon?.replace(/^regular-/, "solid-")
    : props.item.icon,
);

const rowComponent = computed(() => (hasChildren.value ? MtCollapsible : "li"));

const rowProps = computed(() =>
  hasChildren.value ? { as: "li", open: subtreeOpen.value, "onUpdate:open": setSubtreeOpen } : {},
);

const rowClasses = computed(() => ({
  "mt-nav__list-item--nested": props.depth > 1,
  "is--open": subtreeOpen.value,
  "is--child-active": childActive.value,
}));

const linkTag = computed(() => {
  if (props.item.to) {
    return context.linkComponent.value;
  }

  if (props.item.href) {
    return "a";
  }

  return hasChildren.value ? MtCollapsibleTrigger : "span";
});

const linkAttrs = computed(() => {
  if (props.item.to) {
    return {
      to: props.item.to,
      "aria-expanded": hasChildren.value ? subtreeOpen.value : undefined,
      onClick: onLinkClick,
    };
  }

  if (props.item.href) {
    return { href: props.item.href, target: props.item.target, onClick: onLinkClick };
  }

  // The collapsible trigger toggles the nested rows itself
  return hasChildren.value ? { type: "button" } : {};
});

function onLinkClick() {
  // Reports the click to the navigation and, for a link with nested rows, toggles them too
  if (hasChildren.value) {
    setSubtreeOpen(!subtreeOpen.value);
  }

  context.onNavigate(props.item);
}

function setSubtreeOpen(open: boolean) {
  // Opens or closes the nested rows: the navigation decides for top-level rows, the row itself below
  if (props.depth === 1) {
    context.onBranchToggle(props.branchKey, open);
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
  > .mt-nav__sub-list:has(> .mt-nav__list-item:last-child:not(.is--open))::before {
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

.mt-nav__list-item--nested:last-child:not(.is--open) > .mt-nav__item-row > .mt-nav__link::before {
  bottom: var(--scale-size-12);
}

/* Scoped to the row so the rule also beats the user agent reset on button links */
.mt-nav__item-row .mt-nav__link.is--active {
  background: var(--color-background-brand-default);
  color: var(--color-icon-brand-default);
}

.mt-nav__item-row .mt-nav__link.is--active .mt-nav__link-icon,
.mt-nav__item-row .mt-nav__link.is--active .mt-nav__link-expand-icon {
  color: var(--color-icon-brand-default);
}
</style>
