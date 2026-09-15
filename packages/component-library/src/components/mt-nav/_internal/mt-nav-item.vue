<template>
  <mt-collapsible
    v-if="showMenuItem && hasCollapsibleSubtree"
    as="li"
    :class="collapsibleLiClass"
    :aria-current="rowActive ? 'page' : 'false'"
    :open="collapsibleOpen"
    @update:open="onCollapsibleOpenUpdate"
    @mouseenter="emit('menu-item-hover', entry, $event.currentTarget as HTMLElement)"
    @keydown="onCollapsedParentKeydown"
  >
    <div class="mt-nav__item-row">
      <component
        :is="entryPath ? linkComponent : MtCollapsibleTrigger"
        class="mt-nav__link"
        :class="{ 'router-link-active': rowActive }"
        :aria-label="collapsedAriaLabel"
        v-bind="entryPath ? { ...linkProps, 'aria-expanded': collapsibleOpen } : { type: 'button' }"
        v-on="entryPath ? { click: onNavigationLinkClick } : {}"
      >
        <mt-icon
          v-if="displayIcon"
          :size="iconSize"
          class="mt-nav__link-icon"
          :name="navigationIconName"
        />

        <span
          class="mt-nav__link-label"
          :class="collapsibleText ? 'mt-nav__collapsible-text mt-nav__hide-on-collapse' : ''"
          :title="entry.label"
        >
          {{ entry.label }}
        </span>

        <slot name="entry-suffix" :entry="entry" />

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
      <mt-nav-item
        v-for="(childEntry, subMenuIndex) in children"
        :key="childEntry.id ?? childEntry.path ?? subMenuIndex"
        :entry="childEntry"
        :menu-depth="menuDepth + 1"
        :display-icon="false"
        :nav-expanded="navExpanded"
        :collapsible-text="collapsibleText"
        :icon-size="iconSize"
        @menu-item-hover="forwardMenuItemHover"
        @flyout-navigate="forwardFlyoutNavigate"
        @navigation-link-click="forwardNavigationLinkClick"
      >
        <template #entry-suffix="slotProps">
          <slot name="entry-suffix" v-bind="slotProps" />
        </template>
      </mt-nav-item>
    </mt-collapsible-content>
  </mt-collapsible>

  <li
    v-else-if="showMenuItem"
    :class="leafLiClass"
    :aria-current="rowActive ? 'page' : 'false'"
    @mouseenter="emit('menu-item-hover', entry, $event.currentTarget as HTMLElement)"
  >
    <mt-tooltip :content="entry.label" placement="right">
      <template #default="tooltipProps">
        <div class="mt-nav__item-row" v-bind="collapsedTooltipTriggerProps(tooltipProps)">
          <component
            :is="leafTag"
            class="mt-nav__link"
            :class="{ 'router-link-active': rowActive }"
            v-bind="leafAttrs"
            v-on="entryPath ? { click: onNavigationLinkClick } : {}"
          >
            <mt-icon
              v-if="displayIcon"
              :size="iconSize"
              class="mt-nav__link-icon"
              :name="navigationIconName"
            />

            <span
              class="mt-nav__link-label"
              :class="collapsibleText ? 'mt-nav__collapsible-text mt-nav__hide-on-collapse' : ''"
              :title="entry.label"
            >
              {{ entry.label }}
            </span>

            <slot name="entry-suffix" :entry="entry" />
          </component>
        </div>
      </template>
    </mt-tooltip>
  </li>
</template>

<script setup lang="ts">
import { computed, inject, ref, watch, type PropType } from "vue";
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtTooltip from "@/components/mt-tooltip/mt-tooltip.vue";
import MtCollapsible from "@/components/mt-collapsible/mt-collapsible.vue";
import MtCollapsibleTrigger from "@/components/mt-collapsible/mt-collapsible-trigger.vue";
import MtCollapsibleContent from "@/components/mt-collapsible/mt-collapsible-content.vue";
import type { NavTreeEntry } from "../mt-nav.types";
import { NAV_CONTEXT } from "./mt-nav-context";
import {
  getActiveRouteNames,
  isEntryOnActiveRoute,
  entryParamsMatchRoute,
} from "./nav-item-active.helper";

/**
 * Props of the tooltip trigger that open it; stripped when the row shows no tooltip.
 */
const TOOLTIP_OPEN_TRIGGER_PROPS = ["onMouseover", "onFocus", "aria-describedby"];

const props = defineProps({
  entry: {
    type: Object as PropType<NavTreeEntry>,
    required: true,
  },
  menuDepth: {
    type: Number,
    default: 1,
    validator: (value: number) => [1, 2, 3].includes(value),
  },
  displayIcon: {
    type: Boolean,
    default: true,
  },
  iconSize: {
    type: String,
    default: "16px",
  },
  collapsibleText: {
    type: Boolean,
    default: true,
  },
  navExpanded: {
    type: Boolean,
    default: true,
  },
  isExpanded: {
    type: Boolean,
    default: false,
  },
  showActiveState: {
    type: Boolean,
    default: true,
  },
  flyoutActive: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "menu-item-hover", entry: NavTreeEntry, target: HTMLElement): void;
  (e: "branch-toggle", payload: { entry: NavTreeEntry; open: boolean }): void;
  (e: "flyout-focus-request"): void;
  (e: "flyout-close-request"): void;
  (e: "flyout-navigate", payload: { disclosesChildren: boolean }): void;
  (e: "navigation-link-click", entry: NavTreeEntry): void;
}>();

defineSlots<{
  /** Rendered after the label; forwarded to the nested rows. */
  "entry-suffix"?: (props: { entry: NavTreeEntry }) => unknown;
}>();

const context = inject(NAV_CONTEXT);

if (!context) {
  throw new Error("mt-nav-item must be rendered inside mt-nav");
}

const route = context.route;
const linkComponent = context.linkComponent;

const suppressRouteKeepsFolderOpen = ref(false);
const manualNestedOpen = ref(false);

// The navigation supports at most three levels; level-3 rows are leaf items only
const isLeafDepth = computed(() => props.menuDepth >= 3);

const activeRouteNames = computed(() => getActiveRouteNames(route.value, context.router.value));

const children = computed(() => props.entry.children ?? []);

const entryPath = computed(() => props.entry.path);

const hasActiveChild = computed(() =>
  children.value.some((child) => isEntryOnActiveRoute(child, route.value, activeRouteNames.value)),
);

const hasCollapsibleSubtree = computed(
  // Ignores the expanded state on purpose: switching template branch on collapse makes the icons flash
  () => children.value.length > 0 && !isLeafDepth.value,
);

const routeKeepsFolderOpen = computed(() => {
  if (!children.value.length || suppressRouteKeepsFolderOpen.value) {
    return false;
  }

  return hasActiveChild.value;
});

const submenuVisuallyOpen = computed(() => {
  if (props.menuDepth === 1) {
    if (!props.navExpanded) {
      return false;
    }

    return context.hasExpandedBranches.value
      ? props.isExpanded
      : props.isExpanded || routeKeepsFolderOpen.value;
  }

  return routeKeepsFolderOpen.value || manualNestedOpen.value;
});

const collapsibleOpen = computed(() => hasCollapsibleSubtree.value && submenuVisuallyOpen.value);

const rowActive = computed(() => {
  if (!props.showActiveState) {
    return false;
  }

  if (!isEntryOnActiveRoute(props.entry, route.value, activeRouteNames.value)) {
    return false;
  }

  const selfIsCurrent =
    !hasActiveChild.value &&
    !!props.entry.path &&
    activeRouteNames.value.has(props.entry.path) &&
    entryParamsMatchRoute(props.entry, route.value);

  if (!selfIsCurrent && children.value.length > 0 && submenuVisuallyOpen.value) {
    return false;
  }

  return true;
});

const linkTo = computed(() => {
  if (props.entry.params) {
    return { name: props.entry.path, params: props.entry.params };
  }

  return { name: props.entry.path };
});

const showMenuItem = computed(
  () => children.value.length > 0 || !!entryPath.value || !!props.entry.link,
);

const expandIcon = computed(() =>
  submenuVisuallyOpen.value ? "regular-chevron-up-xs" : "regular-chevron-down-xs",
);

const childRouteActive = computed(
  () => children.value.length > 0 && submenuVisuallyOpen.value && hasActiveChild.value,
);

const navigationIconName = computed(() =>
  getIconName(props.entry.icon, rowActive.value || childRouteActive.value),
);

function getElementClasses() {
  const key = (props.entry.id ?? entryPath.value ?? "").replace(/\./g, "-");

  return [
    key,
    `navigation-list-item__type-${props.entry.moduleType}`,
    `navigation-list-item__${key}`,
    `mt-nav__item--${props.entry.id}`,
    `navigation-list-item__level-${props.entry.level}`,
    {
      "navigation-list-item__has-children": children.value.length > 0,
      "navigation-list-item--nested": props.menuDepth > 1,
    },
  ];
}

const collapsibleLiClass = computed(() => [
  "mt-nav__list-item",
  getElementClasses(),
  {
    "is--entry-expanded": collapsibleOpen.value,
    "is--child-active": childRouteActive.value,
    "is--flyout-enabled": props.flyoutActive,
  },
]);

const leafLiClass = computed(() => [
  "mt-nav__list-item",
  getElementClasses(),
  {
    "is--entry-expanded": submenuVisuallyOpen.value,
    "is--child-active": childRouteActive.value,
  },
]);

const collapsedFlyoutAria = computed<{ "aria-expanded"?: string; "aria-controls"?: string }>(() => {
  if (props.navExpanded || props.menuDepth !== 1 || children.value.length === 0) {
    return {};
  }

  // aria-controls only while open
  if (!props.flyoutActive) {
    return { "aria-expanded": "false" };
  }

  return {
    "aria-expanded": "true",
    "aria-controls": "mt-nav-flyout",
  };
});

// Collapsed top-level rows hide their label, so the accessible name needs an aria-label.
const collapsedAriaLabel = computed(() =>
  !props.navExpanded && props.menuDepth === 1 ? props.entry.label : undefined,
);

const linkProps = computed(() => ({
  to: linkTo.value,
  activeClass: props.showActiveState ? "router-link-active" : "",
  exactActiveClass: props.showActiveState ? "router-link-exact-active" : "",
  ...collapsedFlyoutAria.value,
}));

const leafTag = computed(() => {
  if (entryPath.value) {
    return linkComponent.value;
  }

  return props.entry.link ? "a" : "span";
});

const leafAttrs = computed(() => {
  if (entryPath.value) {
    return {
      ...linkProps.value,
      "aria-label": collapsedAriaLabel.value,
    };
  }

  if (props.entry.link) {
    return {
      href: props.entry.link,
      target: props.entry.target,
      title: props.entry.label,
      "aria-label": collapsedAriaLabel.value,
    };
  }

  return {};
});

// Top-level entries without children have no flyout, label is accessible via a tooltip
const showsCollapsedTooltip = computed(
  () => !props.navExpanded && props.menuDepth === 1 && children.value.length === 0,
);

// Query-insensitive on purpose: listing pagination/sorting must not undo a manual collapse
watch(
  () => route.value?.path,
  () => {
    suppressRouteKeepsFolderOpen.value = false;
  },
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

function toggleSubmenu() {
  if (!hasCollapsibleSubtree.value) {
    return;
  }

  onCollapsibleOpenUpdate(!collapsibleOpen.value);
}

function onNavigationLinkClick() {
  if (!props.navExpanded) {
    emit("flyout-navigate", { disclosesChildren: hasCollapsibleSubtree.value });
  }

  // No-op unless this row has a collapsible subtree.
  toggleSubmenu();

  emit("navigation-link-click", props.entry);
}

function forwardNavigationLinkClick(entry: NavTreeEntry) {
  emit("navigation-link-click", entry);
}

function forwardFlyoutNavigate(payload: { disclosesChildren: boolean }) {
  emit("flyout-navigate", payload);
}

function forwardMenuItemHover(entry: NavTreeEntry, target: HTMLElement) {
  emit("menu-item-hover", entry, target);
}

function onCollapsibleOpenUpdate(open: boolean) {
  suppressRouteKeepsFolderOpen.value = !open;

  if (props.menuDepth >= 2) {
    manualNestedOpen.value = open;
  }

  if (props.menuDepth === 1 && props.navExpanded) {
    emit("branch-toggle", { entry: props.entry, open });
  }
}

function onCollapsedParentKeydown(event: KeyboardEvent) {
  // Keyboard access to the collapsed flyout - disclosure navigation pattern
  if (props.navExpanded || props.menuDepth !== 1 || children.value.length === 0) {
    return;
  }

  if ((event.key === "Escape" || event.key === "ArrowLeft") && props.flyoutActive) {
    emit("flyout-close-request");
    return;
  }

  const isActivationKey = event.key === "Enter" || event.key === " ";
  // Entries with an own route keep Enter/Space for navigation.
  const opensFlyout = event.key === "ArrowRight" || (isActivationKey && !entryPath.value);

  if (!opensFlyout) {
    return;
  }

  event.preventDefault();
  emit("menu-item-hover", props.entry, event.currentTarget as HTMLElement);
  emit("flyout-focus-request");
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

  &:not(.router-link-active):hover {
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

.navigation-list-item--nested > .mt-nav__sub-list {
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
.navigation-list-item--nested:last-child
  > .mt-nav__sub-list:has(> .mt-nav__list-item:last-child:not(.is--entry-expanded))::before {
  bottom: var(--scale-size-12);
}

.navigation-list-item--nested > .mt-nav__item-row > .mt-nav__link {
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

  &:not(.router-link-active):hover::after {
    opacity: 1;
    background: var(--color-border-primary-default);
    outline-color: var(--color-interaction-secondary-hover);
  }

  &.router-link-active::after {
    opacity: 1;
    background: var(--color-icon-brand-default);
    outline-color: var(--color-background-brand-default);
  }
}

.navigation-list-item--nested.is--child-active > .mt-nav__item-row {
  > .mt-nav__link::after {
    opacity: 1;
    background: var(--color-border-primary-default);
    outline-color: var(--color-elevation-surface-sunken);
  }

  > .mt-nav__link:hover::after {
    outline-color: var(--color-interaction-secondary-hover);
  }
}

.navigation-list-item--nested:first-child > .mt-nav__item-row {
  > .mt-nav__link::before {
    top: var(--scale-size-12);
  }
}

.navigation-list-item--nested:last-child:not(.is--entry-expanded) > .mt-nav__item-row {
  > .mt-nav__link::before {
    bottom: var(--scale-size-12);
  }
}

.navigation-list-item__level-1 > .mt-nav__item-row {
  > .mt-nav__link.router-link-active {
    background: var(--color-background-brand-default);
  }
}

.mt-nav__link.router-link-active {
  background: none;
  color: var(--color-icon-brand-default);

  .mt-nav__collapsible-text {
    color: var(--color-icon-brand-default);
  }

  .mt-nav__link-icon {
    color: var(--color-icon-brand-default);
  }
}

.mt-nav__flyout-content .mt-nav__link.router-link-active {
  background: var(--color-background-brand-default);
}

.mt-nav__list-item.is--flyout-enabled > .mt-nav__item-row {
  > .mt-nav__link {
    color: var(--color-text-primary-default);
    background: var(--color-interaction-secondary-hover);
  }
}

.mt-nav__list-item.is--entry-expanded {
  .mt-nav__collapsible-text {
    color: var(--color-text-primary-default);
  }

  & > .mt-nav__item-row > .mt-nav__link.router-link-active .mt-nav__collapsible-text {
    color: var(--color-icon-brand-default);
  }
}

// Tree lines and indicators follow .mt-nav__hide-on-collapse timing, scoped to the toggle window
.mt-nav.is--toggling .navigation-list-item--nested {
  > .mt-nav__sub-list::before,
  > .mt-nav__item-row > .mt-nav__link::before,
  > .mt-nav__item-row > .mt-nav__link::after {
    transition:
      opacity 0.3s ease-in-out 0.1s,
      visibility 0.3s ease-in-out 0.1s;
  }
}

.mt-nav.is--collapsed .navigation-list-item--nested {
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
