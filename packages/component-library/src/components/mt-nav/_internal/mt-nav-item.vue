<template>
  <component :is="rowComponent" v-bind="rowProps" class="mt-nav__list-item" :class="rowClasses">
    <div
      ref="itemRowElement"
      class="mt-nav__item-row"
      @keydown="onRowKeydown"
      @pointerenter="onFlyoutPointerEnter"
      @pointerleave="onFlyoutPointerLeave"
    >
      <component
        :is="linkTag"
        class="mt-nav__link"
        :class="{ 'is--active': rowActive }"
        :aria-current="isCurrentPage ? 'page' : rowActive ? 'true' : undefined"
        v-bind="linkAttrs"
      >
        <mt-icon
          v-if="iconName && depth === 1"
          :name="iconName"
          size="16"
          class="mt-nav__link-icon"
        />

        <span class="mt-nav__link-label">
          {{ item.label }}
        </span>

        <component :is="context.slots.suffix" v-if="context.slots.suffix" :item="item" />

        <span v-if="isExternal" class="mt-nav__link-external-icon-box">
          <mt-icon
            name="regular-external-link-s"
            size="10"
            class="mt-nav__link-external-icon"
            aria-hidden="true"
          />
          <span v-if="item.target === '_blank'" class="visually-hidden">
            {{ t("opensInNewTab") }}
          </span>
        </span>

        <mt-icon
          v-if="hasChildren"
          name="regular-chevron-down-xs"
          size="8"
          class="mt-nav__link-expand-icon"
        />
      </component>
    </div>

    <mt-floating-ui
      v-if="isFlyout"
      detached
      :anchor-element="itemRowElement"
      :is-opened="subtreeOpen"
      @close="setSubtreeOpen(false)"
    >
      <div
        ref="flyoutElement"
        class="mt-nav__flyout"
        :class="{ 'mt-nav__flyout--switched': context.flyoutSwitched.value }"
        @keydown="onFlyoutKeydown"
        @pointerenter="onFlyoutPointerEnter"
        @pointerleave="onFlyoutPointerLeave"
      >
        <ul class="mt-nav__sub-list">
          <mt-nav-item
            v-for="child in item.children"
            :key="itemKey(child)"
            :item="child"
            :depth="depth + 1"
            :branch-key="branchKey"
          />
        </ul>
      </div>
    </mt-floating-ui>

    <mt-collapsible-content v-else-if="hasChildren" as="ul" class="mt-nav__sub-list">
      <mt-nav-item
        v-for="child in item.children"
        :key="itemKey(child)"
        :item="child"
        :depth="depth + 1"
        :branch-key="branchKey"
      />
    </mt-collapsible-content>
  </component>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, provide, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtCollapsible from "@/components/mt-collapsible/mt-collapsible.vue";
import MtCollapsibleTrigger from "@/components/mt-collapsible/mt-collapsible-trigger.vue";
import MtCollapsibleContent from "@/components/mt-collapsible/mt-collapsible-content.vue";
import MtFloatingUi from "@/components/mt-floating-ui/mt-floating-ui.vue";
import {
  MAX_NESTING_LEVEL,
  NAV_CONTEXT,
  focusableLinks,
  hasNestedItems,
  itemKey,
  moveLinkFocus,
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

const { t } = useI18n({
  messages: {
    en: {
      opensInNewTab: "(opens in a new tab)",
    },
    de: {
      opensInNewTab: "(öffnet in einem neuen Tab)",
    },
  },
});

const isLeafDepth = props.depth >= MAX_NESTING_LEVEL;

if (isLeafDepth && hasNestedItems(props.item)) {
  console.error(
    `[mt-nav] The navigation item "${props.item.label}" has nested items on level ${MAX_NESTING_LEVEL + 1} or higher. ` +
      `The navigation only supports up to ${MAX_NESTING_LEVEL} levels of nesting.`,
  );
}

// Rows on the last supported level are leaves even when they have nested items
const hasChildren = computed(() => hasNestedItems(props.item) && !isLeafDepth);

// Top-level rows of a horizontal navigation show their nested rows in a floating panel
const isFlyout = computed(
  () => context.orientation.value === "horizontal" && props.depth === 1 && hasChildren.value,
);

const itemRowElement = ref<HTMLElement | null>(null);
const flyoutElement = ref<HTMLElement | null>(null);

// Open state of the floating panel. The navigation keeps one open at a time, and unlike the inline
// branches it never opens on its own.
const flyoutOpen = computed(() => context.isFlyoutOpen(props.branchKey));

// Time the pointer may spend outside the row and panel, e.g. crossing the gap between them
const FLYOUT_CLOSE_DELAY = 200;

let flyoutCloseTimer: ReturnType<typeof setTimeout> | undefined;

// Set while the panel is open because the mouse rests on it, so a click does not close it again
let flyoutOpenedByHover = false;

onBeforeUnmount(() => clearTimeout(flyoutCloseTimer));

// Choosing a page inside the floating panel closes it
if (props.depth === 1) {
  provide(NAV_CONTEXT, {
    ...context,
    onNavigate: (item) => {
      context.onFlyoutToggle(props.branchKey, false);
      context.onNavigate(item);
    },
  });
}

// The nested row that is active or holds the active row
const activeChildKey = computed(() => {
  const activeChild = props.item.children?.find(context.isItemActive);

  return activeChild ? itemKey(activeChild) : null;
});

const hasActiveDescendant = computed(() => activeChildKey.value !== null);

// The user's last toggle of a nested row. Unset, the row is open while it holds the active row.
const manualOpen = ref<boolean | null>(null);

// A manual collapse holds until the active row changes
watch(activeChildKey, () => {
  if (manualOpen.value === false) {
    manualOpen.value = null;
  }
});

// Top-level rows are opened by the navigation, which keeps one branch open at a time
const subtreeOpen = computed(() => {
  if (isFlyout.value) {
    return flyoutOpen.value;
  }

  return props.depth === 1
    ? context.isBranchExpanded(props.branchKey)
    : manualOpen.value ?? hasActiveDescendant.value;
});

// The deepest active row is the current page, so a row holding an active row defers to it
const isCurrentPage = computed(() => context.isRowActive(props.item) && !hasActiveDescendant.value);

// A closed branch stands in for the active row it hides, and so does a floating panel, open or not
const rowActive = computed(
  () =>
    isCurrentPage.value ||
    (hasActiveDescendant.value && (isFlyout.value || !subtreeOpen.value)),
);

const childActive = computed(
  () => hasActiveDescendant.value && subtreeOpen.value && !isFlyout.value,
);

// Active rows show the solid variant of their regular icon
const iconName = computed(() =>
  rowActive.value || childActive.value
    ? props.item.icon?.replace(/^regular-/, "solid-")
    : props.item.icon,
);

// Rows leaving the app through a plain anchor mark themselves with a trailing icon
const isExternal = computed(() => !props.item.to && !!props.item.href);

const isCollapsible = computed(() => hasChildren.value && !isFlyout.value);

const rowComponent = computed(() => (isCollapsible.value ? MtCollapsible : "li"));

const rowProps = computed(() =>
  isCollapsible.value
    ? { as: "li", open: subtreeOpen.value, "onUpdate:open": setSubtreeOpen }
    : {},
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

  if (isFlyout.value) {
    return "button";
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

  if (isFlyout.value) {
    return {
      type: "button",
      "aria-expanded": subtreeOpen.value,
      onClick: onFlyoutRowClick,
    };
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

function onFlyoutRowClick() {
  // Keyboard and touch toggle the panel; a click on a panel the mouse already opened keeps it open
  if (flyoutOpenedByHover && flyoutOpen.value) {
    flyoutOpenedByHover = false;
    return;
  }

  setSubtreeOpen(!flyoutOpen.value);
}

function onFlyoutPointerEnter(event: PointerEvent) {
  // The mouse opens the panel while it rests on the row or the panel; touch opens it with a tap
  if (!isFlyout.value || event.pointerType !== "mouse") {
    return;
  }

  clearTimeout(flyoutCloseTimer);

  if (!flyoutOpen.value) {
    context.onFlyoutToggle(props.branchKey, true);
    flyoutOpenedByHover = true;
  }
}

function onFlyoutPointerLeave(event: PointerEvent) {
  // Closes the panel once the mouse has left both the row and the panel
  if (!isFlyout.value || event.pointerType !== "mouse") {
    return;
  }

  clearTimeout(flyoutCloseTimer);
  flyoutCloseTimer = setTimeout(() => setSubtreeOpen(false), FLYOUT_CLOSE_DELAY);
}

function setSubtreeOpen(open: boolean) {
  // Opens or closes the nested rows: the navigation decides for top-level rows, the row itself below
  if (isFlyout.value) {
    clearTimeout(flyoutCloseTimer);
    context.onFlyoutToggle(props.branchKey, open);
    flyoutOpenedByHover = false;
  } else if (props.depth === 1) {
    context.onBranchToggle(props.branchKey, open);
  } else {
    manualOpen.value = open;
  }
}

function onRowKeydown(event: KeyboardEvent) {
  // ArrowDown on a row whose floating panel is open moves focus to the first row in the panel
  const target = event.target;

  if (
    event.key !== "ArrowDown" ||
    !subtreeOpen.value ||
    !flyoutElement.value ||
    !(target instanceof HTMLElement) ||
    !target.matches(".mt-nav__link")
  ) {
    return;
  }

  const firstLink = focusableLinks(flyoutElement.value)[0];

  if (firstLink) {
    event.preventDefault();
    firstLink.focus();
  }
}

function onFlyoutKeydown(event: KeyboardEvent) {
  // Moves focus between the rows of the floating panel; Escape closes it and returns to its row
  if (event.key === "Escape") {
    context.onFlyoutToggle(props.branchKey, false);
    itemRowElement.value?.querySelector<HTMLElement>(".mt-nav__link")?.focus();
    return;
  }

  if (flyoutElement.value) {
    moveLinkFocus(flyoutElement.value, event, { next: "ArrowDown", previous: "ArrowUp" });
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
  padding: 0 var(--scale-size-12);
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

/* Rows of a horizontal navigation, in the bar and in its panels, fade into their hover background */
.mt-nav--horizontal .mt-nav__link,
.mt-nav__flyout .mt-nav__link {
  transition: background-color 0.2s ease-out;
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
  margin-left: auto;
  transition: transform 0.15s ease-out;
}

/* The chevron turns to point up while the row's nested rows are open */
.mt-nav__list-item.is--open > .mt-nav__item-row .mt-nav__link-expand-icon {
  transform: rotate(180deg);
}

.mt-nav__link-external-icon-box {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}

.mt-nav__link-external-icon {
  color: var(--color-icon-secondary-default);
}

.mt-nav__sub-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.mt-nav__list-item--nested {
  --mt-nav-tree-line-offset: var(--scale-size-18);
  --mt-nav-tree-indent: var(--scale-size-36);
}

.mt-nav__list-item--nested > .mt-nav__sub-list {
  margin-left: var(--mt-nav-tree-line-offset);
  position: relative;
  padding-left: calc(
    var(--mt-nav-tree-indent) - var(--mt-nav-tree-line-offset) - var(--scale-size-1)
  );
}

.mt-nav__list-item--nested > .mt-nav__sub-list::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--scale-size-1);
  background: var(--color-border-secondary-default);
  border-radius: var(--border-radius-2xs);
}

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
  width: var(--scale-size-1);
  background: var(--color-border-secondary-default);
  border-radius: var(--border-radius-2xs);
}

.mt-nav__list-item--nested > .mt-nav__item-row > .mt-nav__link::after {
  content: "";
  position: absolute;
  left: calc(var(--mt-nav-tree-line-offset) - var(--scale-size-1));
  top: 50%;
  transform: translateY(-50%);
  /* stylelint-disable-next-line meteor/prefer-sizing-token */
  width: 3px;
  height: var(--scale-size-16);
  border-radius: var(--border-radius-round);
  opacity: 0;
  pointer-events: none;
  outline: var(--scale-size-4) solid transparent;
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
  outline-color: var(--color-elevation-surface-default);
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

.mt-nav__item-row .mt-nav__link.is--active {
  background: var(--color-background-brand-default);
  color: var(--color-text-brand-default);
}

.mt-nav__item-row .mt-nav__link.is--active .mt-nav__link-icon,
.mt-nav__item-row .mt-nav__link.is--active .mt-nav__link-expand-icon {
  color: var(--color-icon-brand-default);
}

/* A fixed width keeps the panel steady while its rows open and close; long labels truncate */
.mt-nav__flyout {
  box-sizing: border-box;
  /* stylelint-disable-next-line meteor/prefer-sizing-token */
  width: 220px;
  padding: var(--scale-size-6);
  white-space: nowrap;
  background: var(--color-elevation-surface-raised);
  border: var(--scale-size-1) solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-card);
  box-shadow: 0 var(--scale-size-8) var(--scale-size-20) 0 var(--color-elevation-shadow-default);
  animation: mt-nav-flyout-in 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

@keyframes mt-nav-flyout-in {
  from {
    opacity: 0;
    transform: translateY(calc(-1 * var(--scale-size-4)));
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* A panel taking over from another open panel slides in sideways, so moving along the bar stays quick */
.mt-nav__flyout--switched {
  animation-name: mt-nav-flyout-switch-in;
}

@keyframes mt-nav-flyout-switch-in {
  from {
    opacity: 0;
    transform: translateX(calc(-1 * var(--scale-size-4)));
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mt-nav__flyout {
    animation: none;
  }

  .mt-nav__link-expand-icon {
    transition: none;
  }
}

/* The first level of the panel has no row above it to hang from, so it drops the tree line, indicator and indent */
.mt-nav__flyout
  > .mt-nav__sub-list
  > .mt-nav__list-item--nested
  > .mt-nav__item-row
  > .mt-nav__link {
  padding-left: var(--scale-size-12);
}

.mt-nav__flyout
  > .mt-nav__sub-list
  > .mt-nav__list-item--nested
  > .mt-nav__item-row
  > .mt-nav__link::before,
.mt-nav__flyout
  > .mt-nav__sub-list
  > .mt-nav__list-item--nested
  > .mt-nav__item-row
  > .mt-nav__link::after,
.mt-nav__flyout > .mt-nav__sub-list > .mt-nav__list-item--nested > .mt-nav__sub-list::before {
  content: none;
}

/* Their nested rows hang from the label instead */
.mt-nav__flyout > .mt-nav__sub-list > .mt-nav__list-item--nested > .mt-nav__sub-list {
  margin-left: 0;
  padding-left: var(--scale-size-12);
}
</style>
