<template>
  <mt-collapsible
    v-if="showMenuItem && hasCollapsibleSubtree"
    as="li"
    :class="collapsibleLiClass"
    :style="moduleColorStyle"
    :aria-current="rowActive ? 'page' : 'false'"
    :open="collapsibleOpen"
    @update:open="onCollapsibleOpenUpdate"
    @mouseenter="emit('menu-item-hover', entry, $event.currentTarget as HTMLElement)"
    @keydown="onCollapsedParentKeydown"
  >
    <div class="mt-sidebar__navigation-item-row">
      <component
        :is="entryPath ? linkComponent : MtCollapsibleTrigger"
        class="mt-sidebar__navigation-link"
        :class="{ 'router-link-active': rowActive }"
        :aria-label="collapsedAriaLabel"
        v-bind="entryPath ? { ...linkProps, 'aria-expanded': collapsibleOpen } : { type: 'button' }"
        v-on="entryPath ? { click: onNavigationLinkClick } : {}"
      >
        <mt-icon
          v-if="displayIcon"
          :size="iconSize"
          class="mt-sidebar__navigation-link-icon"
          :name="navigationIconName"
          :color="navigationIconColor"
        />

        <span
          class="mt-sidebar__navigation-link-label"
          :class="collapsibleText ? 'collapsible-text hide-on-collapse' : ''"
          :title="entry.label"
        >
          {{ entry.label }}
        </span>

        <slot name="additional-text" />

        <span class="mt-sidebar__navigation-link-expand-icon-box">
          <mt-icon
            :name="expandIcon"
            size="8"
            class="mt-sidebar__navigation-link-expand-icon collapsible-text hide-on-collapse"
          />
        </span>
      </component>
    </div>

    <mt-collapsible-content as="ul" class="mt-sidebar__sub-navigation-list">
      <mt-sidebar-item
        v-for="(childEntry, subMenuIndex) in children"
        :key="childEntry.id ?? childEntry.path ?? subMenuIndex"
        :entry="childEntry"
        :menu-depth="menuDepth + 1"
        :display-icon="false"
        :sidebar-expanded="sidebarExpanded"
        :collapsible-text="collapsibleText"
        :icon-size="iconSize"
        @menu-item-hover="forwardMenuItemHover"
        @flyout-navigate="forwardFlyoutNavigate"
        @navigation-link-click="forwardNavigationLinkClick"
      />
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
        <div
          class="mt-sidebar__navigation-item-row"
          v-bind="collapsedTooltipTriggerProps(tooltipProps)"
        >
          <component
            :is="leafTag"
            class="mt-sidebar__navigation-link"
            :class="{ 'router-link-active': rowActive }"
            v-bind="leafAttrs"
            v-on="entryPath ? { click: onNavigationLinkClick } : {}"
          >
            <mt-icon
              v-if="displayIcon"
              :size="iconSize"
              class="mt-sidebar__navigation-link-icon"
              :name="navigationIconName"
              :color="navigationIconColor"
            />

            <span
              class="mt-sidebar__navigation-link-label"
              :class="collapsibleText ? 'collapsible-text hide-on-collapse' : ''"
              :title="entry.label"
            >
              {{ entry.label }}
            </span>

            <slot name="additional-text" />
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
import type { SidebarTreeEntry } from "../mt-sidebar.types";
import { SIDEBAR_CONTEXT } from "./mt-sidebar-context";
import {
  getActiveRouteNames,
  isEntryOnActiveRoute,
  entryParamsMatchRoute,
} from "./sidebar-item-active.helper";

/**
 * Props of the tooltip trigger that open it; stripped when the row shows no tooltip.
 */
const TOOLTIP_OPEN_TRIGGER_PROPS = ["onMouseover", "onFocus", "aria-describedby"];

const props = defineProps({
  entry: {
    type: Object as PropType<SidebarTreeEntry>,
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
  sidebarExpanded: {
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
  (e: "menu-item-hover", entry: SidebarTreeEntry, target: HTMLElement): void;
  (e: "branch-toggle", payload: { entry: SidebarTreeEntry; open: boolean }): void;
  (e: "flyout-focus-request"): void;
  (e: "flyout-close-request"): void;
  (e: "flyout-navigate", payload: { disclosesChildren: boolean }): void;
  (e: "navigation-link-click", entry: SidebarTreeEntry): void;
}>();

const context = inject(SIDEBAR_CONTEXT);

if (!context) {
  throw new Error("mt-sidebar-item must be rendered inside mt-sidebar");
}

const route = context.route;
const linkComponent = context.linkComponent;

const suppressRouteKeepsFolderOpen = ref(false);
const manualNestedOpen = ref(false);

// Sidebar supports at most three levels; level-3 rows are leaf items only
const isLeafDepth = computed(() => props.menuDepth >= 3);

const activeRouteNames = computed(() => getActiveRouteNames(route.value, context.router.value));

const children = computed(() => props.entry.children ?? []);

const entryPath = computed(() => props.entry.path);

const hasActiveChild = computed(() =>
  children.value.some((child) => isEntryOnActiveRoute(child, route.value, activeRouteNames.value)),
);

const hasCollapsibleSubtree = computed(
  // Ignores the sidebar state on purpose: switching template branch on collapse makes the icons flash
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
    if (!props.sidebarExpanded) {
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

// Undefined leaves the icon to the stylesheet, which also owns the active state color
const navigationIconColor = computed(() =>
  context.moduleIconColors.value ? props.entry.color : undefined,
);

// Inherited by the sub items, which mark their active state with the parent module color
const moduleColorStyle = computed(() =>
  navigationIconColor.value
    ? { "--mt-sidebar-module-color": navigationIconColor.value }
    : undefined,
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
    `mt-sidebar__item--${props.entry.id}`,
    `navigation-list-item__level-${props.entry.level}`,
    {
      "navigation-list-item__has-children": children.value.length > 0,
      "navigation-list-item--nested": props.menuDepth > 1,
    },
  ];
}

const collapsibleLiClass = computed(() => [
  "mt-sidebar__navigation-list-item",
  getElementClasses(),
  {
    "is--entry-expanded": collapsibleOpen.value,
    "is--child-active": childRouteActive.value,
    "is--flyout-enabled": props.flyoutActive,
    "is--module-colored": !!navigationIconColor.value,
  },
]);

const leafLiClass = computed(() => [
  "mt-sidebar__navigation-list-item",
  getElementClasses(),
  {
    "is--entry-expanded": submenuVisuallyOpen.value,
    "is--child-active": childRouteActive.value,
    "is--module-colored": !!navigationIconColor.value,
  },
]);

const collapsedFlyoutAria = computed<{ "aria-expanded"?: string; "aria-controls"?: string }>(() => {
  if (props.sidebarExpanded || props.menuDepth !== 1 || children.value.length === 0) {
    return {};
  }

  // aria-controls only while open
  if (!props.flyoutActive) {
    return { "aria-expanded": "false" };
  }

  return {
    "aria-expanded": "true",
    "aria-controls": "mt-sidebar-flyout",
  };
});

// Collapsed top-level rows hide their label, so the accessible name needs an aria-label.
const collapsedAriaLabel = computed(() =>
  !props.sidebarExpanded && props.menuDepth === 1 ? props.entry.label : undefined,
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
  () => !props.sidebarExpanded && props.menuDepth === 1 && children.value.length === 0,
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
  if (!props.sidebarExpanded) {
    emit("flyout-navigate", { disclosesChildren: hasCollapsibleSubtree.value });
  }

  // No-op unless this row has a collapsible subtree.
  toggleSubmenu();

  emit("navigation-link-click", props.entry);
}

function forwardNavigationLinkClick(entry: SidebarTreeEntry) {
  emit("navigation-link-click", entry);
}

function forwardFlyoutNavigate(payload: { disclosesChildren: boolean }) {
  emit("flyout-navigate", payload);
}

function forwardMenuItemHover(entry: SidebarTreeEntry, target: HTMLElement) {
  emit("menu-item-hover", entry, target);
}

function onCollapsibleOpenUpdate(open: boolean) {
  suppressRouteKeepsFolderOpen.value = !open;

  if (props.menuDepth >= 2) {
    manualNestedOpen.value = open;
  }

  if (props.menuDepth === 1 && props.sidebarExpanded) {
    emit("branch-toggle", { entry: props.entry, open });
  }
}

function onCollapsedParentKeydown(event: KeyboardEvent) {
  // Keyboard access to the collapsed flyout - disclosure navigation pattern
  if (props.sidebarExpanded || props.menuDepth !== 1 || children.value.length === 0) {
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

.mt-sidebar__navigation-list-item {
  .mt-collapsible-content[data-state="open"],
  .mt-collapsible-content[data-state="closed"] {
    animation-duration: 0.3s;
    animation-timing-function: cubic-bezier(0.32, 0.72, 0, 1);
  }
}

.mt-sidebar__navigation-link {
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

  .mt-sidebar__navigation-link-label {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex-grow: 1;
    text-align: left;
    min-width: 0;
  }
}

// Native button variants of the navigation link, dropping the user agent chrome
.mt-sidebar__navigation-item-row button.mt-sidebar__navigation-link {
  border: 0;
  background: none;
}

.mt-sidebar__navigation-item-row {
  display: flex;
  align-items: stretch;
}

.mt-sidebar__navigation-link-expand-icon {
  flex-shrink: 0;
  color: var(--color-icon-primary-default);
}

.mt-sidebar__navigation-link-expand-icon-box {
  width: var(--scale-size-24);
  height: var(--scale-size-24);
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.mt-sidebar__sub-navigation-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.navigation-list-item--nested > .mt-sidebar__sub-navigation-list {
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
  > .mt-sidebar__sub-navigation-list:has(
    > .mt-sidebar__navigation-list-item:last-child:not(.is--entry-expanded)
  )::before {
  bottom: var(--scale-size-12);
}

.navigation-list-item--nested > .mt-sidebar__navigation-item-row > .mt-sidebar__navigation-link {
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

.navigation-list-item--nested.is--child-active > .mt-sidebar__navigation-item-row {
  > .mt-sidebar__navigation-link::after {
    opacity: 1;
    background: var(--color-border-primary-default);
    outline-color: var(--color-elevation-surface-sunken);
  }

  > .mt-sidebar__navigation-link:hover::after {
    outline-color: var(--color-interaction-secondary-hover);
  }
}

.navigation-list-item--nested:first-child > .mt-sidebar__navigation-item-row {
  > .mt-sidebar__navigation-link::before {
    top: var(--scale-size-12);
  }
}

.navigation-list-item--nested:last-child:not(.is--entry-expanded)
  > .mt-sidebar__navigation-item-row {
  > .mt-sidebar__navigation-link::before {
    bottom: var(--scale-size-12);
  }
}

.navigation-list-item__level-1 > .mt-sidebar__navigation-item-row {
  > .mt-sidebar__navigation-link.router-link-active {
    background: var(--color-background-brand-default);
  }
}

.mt-sidebar__navigation-link.router-link-active {
  background: none;
  color: var(--color-icon-brand-default);

  .collapsible-text {
    color: var(--color-icon-brand-default);
  }

  .mt-sidebar__navigation-link-icon {
    color: var(--color-icon-brand-default);
  }
}

.mt-sidebar__flyout-content .mt-sidebar__navigation-link.router-link-active {
  background: var(--color-background-brand-default);
}

.mt-sidebar__navigation-list-item.is--flyout-enabled > .mt-sidebar__navigation-item-row {
  > .mt-sidebar__navigation-link {
    color: var(--color-text-primary-default);
    background: var(--color-interaction-secondary-hover);
  }
}

.mt-sidebar__navigation-list-item.is--entry-expanded {
  .collapsible-text {
    color: var(--color-text-primary-default);
  }

  &
    > .mt-sidebar__navigation-item-row
    > .mt-sidebar__navigation-link.router-link-active
    .collapsible-text {
    color: var(--color-icon-brand-default);
  }
}

// With module colors the icon carries the accent, so the active row drops the brand tint for the
// neutral hover grey. Level 1 only, the rows that actually show a colored icon.
.navigation-list-item__level-1.is--module-colored > .mt-sidebar__navigation-item-row {
  > .mt-sidebar__navigation-link.router-link-active {
    background: var(--color-interaction-secondary-hover);
    color: var(--color-text-primary-default);

    .collapsible-text {
      color: var(--color-text-primary-default);
    }
  }
}

// An active sub item picks up the same neutral background as its colored parent row and keeps
// the regular text color, so only the marker signals the active state.
.navigation-list-item__level-1.is--module-colored .navigation-list-item--nested {
  > .mt-sidebar__navigation-item-row > .mt-sidebar__navigation-link.router-link-active {
    background: var(--color-interaction-secondary-hover);
    color: var(--color-text-primary-default);

    .collapsible-text {
      color: var(--color-text-primary-default);
    }

    // The halo matches the row background so the line reads against it
    &::after {
      background: var(--mt-sidebar-module-color, var(--color-icon-brand-default));
      outline-color: var(--color-interaction-secondary-hover);
    }
  }
}

// Tree lines and indicators follow .hide-on-collapse timing, scoped to the toggle window
.mt-sidebar.is--toggling .navigation-list-item--nested {
  > .mt-sidebar__sub-navigation-list::before,
  > .mt-sidebar__navigation-item-row > .mt-sidebar__navigation-link::before,
  > .mt-sidebar__navigation-item-row > .mt-sidebar__navigation-link::after {
    transition:
      opacity 0.3s ease-in-out 0.1s,
      visibility 0.3s ease-in-out 0.1s;
  }
}

.mt-sidebar.is--collapsed .navigation-list-item--nested {
  > .mt-sidebar__sub-navigation-list::before,
  > .mt-sidebar__navigation-item-row > .mt-sidebar__navigation-link::before,
  > .mt-sidebar__navigation-item-row > .mt-sidebar__navigation-link::after {
    opacity: 0;
    visibility: hidden;
    transition:
      opacity 0.05s ease-out,
      visibility 0.05s ease-out;
  }
}
</style>
