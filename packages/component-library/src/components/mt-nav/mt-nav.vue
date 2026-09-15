<template>
  <nav
    class="mt-nav"
    :class="navClasses"
    :data-expanded="expanded"
    :aria-labelledby="navigationLabelId"
  >
    <h2 :id="navigationLabelId" class="visually-hidden">
      {{ t("navigationLabel") }}
    </h2>

    <div
      ref="navBodyElement"
      class="mt-nav__body"
      :style="scrollbarOffsetStyle"
      @keydown="onNavigationKeydown"
      @mouseenter="cancelFlyoutClose"
      @focusin="cancelFlyoutClose"
      @mouseleave="onBodyMouseLeave"
      @focusout="onBodyMouseLeave"
    >
      <slot />
    </div>

    <!--
    <mt-floating-ui
      :is-opened="!expanded && flyoutItems.length > 0"
      :anchor-element="flyoutReferenceElement"
      :floating-ui-options="{ placement: 'right-start' }"
      :offset="12"
      detached
      @close="onFlyoutLeave"
    >
      <div
        id="mt-nav-flyout"
        ref="flyoutElement"
        class="mt-nav__flyout-content"
        :class="{ 'is--closing': isFlyoutClosing }"
        tabindex="-1"
        @mouseenter="cancelFlyoutClose"
        @focusin="cancelFlyoutClose"
        @mouseleave="onFlyoutMouseLeave"
        @focusout="onFlyoutMouseLeave"
        @keydown="onFlyoutKeydown"
      >
        <mt-text
          v-if="flyoutTitle"
          as="span"
          class="mt-nav__flyout-title"
          size="xs"
          color="color-text-secondary-default"
        >
          {{ flyoutTitle }}
        </mt-text>

        <ul class="mt-nav__flyout-list">
          <mt-nav-item
            v-for="item in flyoutItems"
            :key="item.id || item.path"
            :item="item"
            :menu-depth="2"
            :display-icon="false"
            :collapsible-text="false"
          />
        </ul>
      </div>
    </mt-floating-ui>
    -->
  </nav>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  useId,
  watch,
  type PropType,
  type Ref,
} from "vue";
import { createFocusTrap, type FocusTrap } from "focus-trap";
import { useI18n } from "vue-i18n";
// import MtText from "@/components/mt-text/mt-text.vue";
// import MtFloatingUi from "@/components/mt-floating-ui/mt-floating-ui.vue";
// import MtNavItem from "./_internal/mt-nav-item.vue";
import { NAV_CONTEXT } from "./_internal/mt-nav-context";
import { navItemKey } from "./_internal/nav-item-key";
import { getActiveRouteNames, isEntryOnActiveRoute } from "./_internal/nav-item-active.helper";
import type { NavItem, NavLinkComponent, NavRoute, NavRouter } from "./mt-nav.types";

export type { NavItem, NavLinkComponent, NavRoute, NavRouter } from "./mt-nav.types";

const TOGGLE_ANIMATION_DURATION = 500;
const FLYOUT_CLOSE_DELAY = 180;
const FLYOUT_CLOSE_ANIMATION_DURATION = 200;

const props = defineProps({
  /**
   * The current route, used to highlight the active item and open its branch.
   */
  route: {
    type: Object as PropType<NavRoute>,
    default: undefined,
  },
  /**
   * The router, used to follow `meta.parentPath` of routes not listed in the navigation.
   */
  router: {
    type: Object as PropType<NavRouter>,
    default: undefined,
  },
  /**
   * Component rendering the navigation links. Receives the route location as `to`.
   */
  linkComponent: {
    type: [String, Object] as PropType<NavLinkComponent>,
    default: "router-link",
  },
  /**
   * Whether the navigation is expanded. Collapsed, it shows the top level icons only and opens
   * branches in a flyout.
   */
  expanded: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  (e: "navigate", item: NavItem): void;
}>();

defineSlots<{
  /** The `mt-nav-section` components holding the items. */
  default?: () => unknown;
}>();

const { t } = useI18n({
  messages: {
    en: {
      navigationLabel: "Main navigation",
    },
    de: {
      navigationLabel: "Hauptnavigation",
    },
  },
});

const navigationLabelId = `mt-nav-label-${useId()}`;

const navBodyElement = ref<HTMLElement | null>(null);
const flyoutElement = ref<HTMLElement | null>(null);

const activeItem = ref<{ item: NavItem; target: HTMLElement } | null>(null);
const flyoutItems = ref<NavItem[]>([]);
const flyoutTitle = ref("");
const isFlyoutClosing = ref(false);
const isFlyoutPinned = ref(false);
const flyoutReferenceElement = ref<HTMLElement | null>(null);
const scrollbarOffset = ref("");
const isToggling = ref(false);
const activeBranchKey = ref<string | null | undefined>(null);
const expandedItems = ref<NavItem[]>([]);

// The top level items of every mounted section, in registration order
const registeredItemLists = shallowRef<Ref<NavItem[]>[]>([]);

let flyoutCloseTimeoutId: ReturnType<typeof setTimeout> | null = null;
let toggleTimeout: ReturnType<typeof setTimeout> | null = null;
let flyoutFocusTrap: FocusTrap | null = null;

// Every top level item across the sections; branches are keyed globally, not per section
const mainItems = computed(() => registeredItemLists.value.flatMap((list) => list.value));

const navClasses = computed(() => ({
  "is--expanded": props.expanded,
  "is--collapsed": !props.expanded,
  "is--toggling": isToggling.value,
}));

const scrollbarOffsetStyle = computed(() => ({
  right: scrollbarOffset.value,
  "margin-left": scrollbarOffset.value,
}));

provide(NAV_CONTEXT, {
  route: computed(() => props.route),
  router: computed(() => props.router),
  linkComponent: computed(() => props.linkComponent),
  expanded: computed(() => props.expanded),
  hasExpandedBranches: computed(() => expandedItems.value.length > 0),
  isItemExpanded,
  isFlyoutItemActive,
  registerItems,
  onItemHover,
  onBranchToggle,
  onFlyoutFocusRequest,
  onFlyoutCloseRequest: onFlyoutLeave,
  onFlyoutNavigate,
  onLinkClick,
});

watch(
  () => props.expanded,
  () => {
    onExpandedChange();
    startToggleWindow();
  },
);

// Query-insensitive on purpose: listing pagination/sorting must not re-expand a collapsed branch
watch(
  () => props.route?.path,
  () => {
    closeFlyoutAfterNavigation();

    // Ensure the branch owning the new page is open, once the route change has rendered
    nextTick(() => expandAncestorBranchesForCurrentRoute());
  },
  { immediate: true },
);

// Sections usually mount after the first render (app modules, plugins), so revisit the active branch
watch(mainItems, () => {
  nextTick(() => expandAncestorBranchesForCurrentRoute());
});

onMounted(() => {
  addScrollbarOffset();
});

onBeforeUnmount(() => {
  cancelFlyoutClose();
  deactivateFlyoutFocusTrap(false);

  if (toggleTimeout) {
    clearTimeout(toggleTimeout);
  }
});

function registerItems(items: Ref<NavItem[]>) {
  registeredItemLists.value = [...registeredItemLists.value, items];

  return () => {
    registeredItemLists.value = registeredItemLists.value.filter((list) => list !== items);
  };
}

function closeFlyoutAfterNavigation() {
  // Ensure an open flyout closes once the page changes
  if (!props.expanded && flyoutItems.value.length && !isFlyoutPinned.value) {
    // Ensure the keyboard focus stays on the new page
    deactivateFlyoutFocusTrap(false);
    onFlyoutLeave();
  }
}

function onLinkClick(item: NavItem) {
  // Tapping the current route's item aborts as redundant navigation, so no route watcher fires
  closeFlyoutAfterNavigation();

  emit("navigate", item);
}

function startToggleWindow() {
  // Marks the navigation as mid-toggle so CSS can suppress unwanted animations while it resizes
  isToggling.value = true;

  if (toggleTimeout) {
    clearTimeout(toggleTimeout);
  }

  toggleTimeout = setTimeout(() => {
    isToggling.value = false;
    toggleTimeout = null;
  }, TOGGLE_ANIMATION_DURATION);
}

function onExpandedChange() {
  // Collapsing hides the expanded tree, so drop that state and close anything left floating
  if (!props.expanded) {
    expandedItems.value = [];
    onFlyoutLeave();
  }

  flyoutItems.value = [];
}

function addScrollbarOffset() {
  const body = navBodyElement.value;

  if (!body) {
    return;
  }

  // A negative offset pulls the scrollbar outside the navigation so it does not eat into the visible width
  const scrollbarWidthPx = body.offsetWidth - body.clientWidth;

  scrollbarOffset.value = `-${scrollbarWidthPx}px`;
}

function expandItem(item: NavItem) {
  const key = navItemKey(item);

  // Items without id and path share the key undefined, so never deduplicate them
  if (key !== undefined && expandedItems.value.some((e) => navItemKey(e) === key)) {
    return;
  }

  expandedItems.value = [...expandedItems.value, item];
}

function collapseItem(item: NavItem) {
  const key = navItemKey(item);

  if (key === undefined) {
    expandedItems.value = expandedItems.value.filter((e) => e !== item);
    return;
  }

  expandedItems.value = expandedItems.value.filter((e) => navItemKey(e) !== key);
}

// Only top level rows report their toggle, nested rows keep their own open state
function onBranchToggle(item: NavItem, open: boolean) {
  if (!props.expanded) {
    return;
  }

  if (!open) {
    collapseItem(item);
    return;
  }

  collapseInactiveBranches(item);
  expandItem(item);
}

function collapseInactiveBranches(exceptItem: NavItem | null = null) {
  const exceptKey = exceptItem ? navItemKey(exceptItem) : null;
  const activeNames = getActiveRouteNames(props.route, props.router);

  expandedItems.value
    .filter((expanded) => {
      const key = navItemKey(expanded);

      if (key === exceptKey) {
        return false;
      }

      const mainItem = mainItems.value.find((item) => navItemKey(item) === key);

      return !mainItem || !isEntryOnActiveRoute(mainItem, props.route, activeNames);
    })
    .forEach((expanded) => collapseItem(expanded));
}

function onItemHover(item: NavItem, eventTarget: HTMLElement) {
  if (props.expanded) {
    return;
  }

  cancelFlyoutClose();

  const target = eventTarget.closest<HTMLElement>(".mt-nav__list-item");

  if (!target) {
    return;
  }

  const hasChildrenClass = target.classList.contains("navigation-list-item__has-children");
  const children = hasChildrenClass ? item.children ?? [] : [];

  if (!hasChildrenClass || children.length === 0) {
    onFlyoutLeave();
    return;
  }

  const itemKey = navItemKey(item);
  const active = activeItem.value?.item;
  const activeKey = active ? navItemKey(active) : null;

  if (activeKey === itemKey && flyoutItems.value.length > 0) {
    return;
  }

  flyoutReferenceElement.value = target.querySelector<HTMLElement>(".mt-nav__link") ?? target;
  isFlyoutPinned.value = false;
  flyoutItems.value = children;
  flyoutTitle.value = item.label;

  activeItem.value = { item, target };
}

function onBodyMouseLeave(event: MouseEvent | FocusEvent) {
  if (isSuppressedFlyoutFocusOut(event)) {
    return;
  }

  if ((event.relatedTarget as HTMLElement | null)?.closest(".mt-nav__flyout-content")) {
    return;
  }

  scheduleFlyoutClose();
}

function onFlyoutMouseLeave(event: MouseEvent | FocusEvent) {
  if (isSuppressedFlyoutFocusOut(event)) {
    return;
  }

  if ((event.relatedTarget as HTMLElement | null)?.closest(".mt-nav__body")) {
    return;
  }

  scheduleFlyoutClose();
}

function isSuppressedFlyoutFocusOut(event: Event) {
  return event.type === "focusout" && isFlyoutPinned.value;
}

function onFlyoutNavigate(disclosesChildren: boolean) {
  isFlyoutPinned.value = disclosesChildren;
}

function scheduleFlyoutClose() {
  if (props.expanded || !flyoutItems.value.length) {
    return;
  }

  cancelFlyoutClose();

  flyoutCloseTimeoutId = setTimeout(() => {
    startFlyoutCloseAnimation();
  }, FLYOUT_CLOSE_DELAY);
}

function startFlyoutCloseAnimation() {
  if (!flyoutItems.value.length) {
    return;
  }

  isFlyoutClosing.value = true;

  flyoutCloseTimeoutId = setTimeout(() => {
    onFlyoutLeave();
  }, FLYOUT_CLOSE_ANIMATION_DURATION);
}

function cancelFlyoutClose() {
  if (flyoutCloseTimeoutId) {
    clearTimeout(flyoutCloseTimeoutId);
    flyoutCloseTimeoutId = null;
  }

  isFlyoutClosing.value = false;
}

function isFlyoutItemActive(item: NavItem) {
  if (props.expanded || flyoutItems.value.length === 0) {
    return false;
  }

  const active = activeItem.value?.item;

  return !!active && navItemKey(active) === navItemKey(item);
}

function onFlyoutFocusRequest() {
  nextTick(() => {
    const element = flyoutElement.value;

    if (!element || flyoutItems.value.length === 0) {
      return;
    }

    deactivateFlyoutFocusTrap(false);

    flyoutFocusTrap = createFocusTrap(element, {
      escapeDeactivates: true,
      clickOutsideDeactivates: true,
      returnFocusOnDeactivate: true,
      delayInitialFocus: false,
      fallbackFocus: element,
      onDeactivate: () => {
        flyoutFocusTrap = null;
        onFlyoutLeave();
      },
    });

    flyoutFocusTrap.activate();
  });
}

function deactivateFlyoutFocusTrap(returnFocus = true) {
  if (!flyoutFocusTrap) {
    return;
  }

  const trap = flyoutFocusTrap;
  flyoutFocusTrap = null;

  // Override the configured onDeactivate: it closes the flyout via onFlyoutLeave
  trap.deactivate({ returnFocus, onDeactivate: () => {} });
}

function getNavigationLinks(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(".mt-nav__link")).filter(
    (link) => !link.closest("[hidden]"),
  );
}

function moveListFocus(links: HTMLElement[], event: KeyboardEvent) {
  // arrow key support, per the APG disclosure navigation pattern.
  if (links.length === 0) {
    return;
  }

  const currentIndex = links.indexOf(document.activeElement as HTMLElement);
  let nextIndex: number;

  switch (event.key) {
    case "ArrowDown":
      nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % links.length;
      break;
    case "ArrowUp":
      nextIndex =
        currentIndex < 0 ? links.length - 1 : (currentIndex - 1 + links.length) % links.length;
      break;
    case "Home":
      nextIndex = 0;
      break;
    case "End":
      nextIndex = links.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  links[nextIndex]?.focus();
}

function onNavigationKeydown(event: KeyboardEvent) {
  const body = navBodyElement.value;

  if (!body) {
    return;
  }

  moveListFocus(getNavigationLinks(body), event);
}

function onFlyoutKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    deactivateFlyoutFocusTrap(true);
    onFlyoutLeave();

    return;
  }

  const element = flyoutElement.value;

  if (!element) {
    return;
  }

  moveListFocus(getNavigationLinks(element), event);
}

function onFlyoutLeave() {
  deactivateFlyoutFocusTrap();
  cancelFlyoutClose();
  isFlyoutPinned.value = false;
  activeItem.value = null;
  flyoutReferenceElement.value = null;
  flyoutItems.value = [];
  flyoutTitle.value = "";
}

function expandAncestorBranchesForCurrentRoute() {
  // Only the expanded navigation shows a tree to open; collapsed items use the flyout instead
  if (!props.expanded) {
    return;
  }

  const activeNames = getActiveRouteNames(props.route, props.router);
  const activeItems = mainItems.value.filter((item) =>
    isEntryOnActiveRoute(item, props.route, activeNames),
  );

  // Pages the navigation does not list at all own no branch; leave the tree as the user left it
  if (!activeItems.length) {
    return;
  }

  const owner = activeItems.find((item) => (item.children ?? []).length > 0) ?? null;
  const ownerKey = owner ? navItemKey(owner) : null;

  // The cached owner may have been collapsed manually
  if (ownerKey === activeBranchKey.value && (!owner || isItemExpanded(owner))) {
    return;
  }

  // Branches only stay open while they own the active item, or while nothing in the navigation does.
  collapseInactiveBranches(owner);
  activeBranchKey.value = ownerKey;

  if (owner && !isItemExpanded(owner)) {
    expandItem(owner);
  }
}

function isItemExpanded(item: NavItem) {
  const key = navItemKey(item);

  return expandedItems.value.some((expanded) => navItemKey(expanded) === key);
}
</script>

<style lang="scss">
.mt-nav {
  // Shared motion tokens for the collapse/expand animation, matching a 0.5s width transition of the host
  --mt-nav-bezier: cubic-bezier(0.32, 0.72, 0, 1);
  --mt-nav-duration: 0.5s;
  --mt-nav-fade-in-duration: 0.4s;
  --mt-nav-fade-in-delay: 0.05s;
  --mt-nav-fade-out-duration: 0.05s;

  // Body vertical padding, doubling as the control points of its edge fade mask
  --mt-nav-body-fade: var(--scale-size-16);

  height: 100%;
  min-height: 0;
  overflow: hidden;
  white-space: nowrap;

  // Fades from 4px inside the edge to the body padding, so resting content stays opaque
  mask-image: linear-gradient(
    to bottom,
    transparent var(--scale-size-4),
    #000 var(--mt-nav-body-fade),
    #000 calc(100% - var(--mt-nav-body-fade)),
    transparent calc(100% - var(--scale-size-4))
  );

  .mt-nav__collapsible-text {
    display: inline-block;
    white-space: nowrap;
    width: 100%;
    position: relative;
    pointer-events: none;
  }

  // Elements animating layout on top of this must keep that transition on a parent
  .mt-nav__hide-on-collapse {
    opacity: 1;
    transition:
      opacity var(--mt-nav-fade-in-duration) ease-in-out var(--mt-nav-fade-in-delay),
      visibility var(--mt-nav-fade-in-duration) ease-in-out var(--mt-nav-fade-in-delay);
  }

  &.is--collapsed .mt-nav__hide-on-collapse {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition:
      opacity var(--mt-nav-fade-out-duration) ease-out,
      visibility var(--mt-nav-fade-out-duration) ease-out;
  }

  &.is--expanded {
    --mt-nav-body-fade: var(--scale-size-20);

    .mt-nav__link.router-link-active {
      background: var(--color-background-brand-default);

      .mt-nav__collapsible-text {
        color: var(--color-icon-brand-default);
      }
    }
  }

  &.is--collapsed .mt-nav__link {
    width: var(--scale-size-36);
    height: var(--scale-size-36);
  }

  .mt-nav__body {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--scale-size-16);

    // Must live on the scroller: it clips at the padding box, keeping content visible for the mask
    padding: var(--mt-nav-body-fade) 0;
    overflow-x: hidden;
    overflow-y: scroll;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
    transition: padding var(--mt-nav-duration) var(--mt-nav-bezier);

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .mt-nav,
  .mt-nav .mt-nav__hide-on-collapse,
  .mt-nav .mt-nav__body {
    transition: none;
  }

  .mt-nav__flyout-content,
  .mt-nav__flyout-content.is--closing {
    animation: none;
  }
}

.mt-nav__flyout-content {
  // Aligns the first flyout item with the hovered row: title height + padding + border
  --mt-nav-flyout-shift: translateY(calc(-1 * (var(--scale-size-36) + var(--scale-size-6) + 1px)));

  width: 264px;
  padding: var(--scale-size-6);
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-m);
  border: 1px solid var(--color-border-secondary-default);
  background: var(--color-elevation-surface-raised);
  box-shadow: 0 6px 12px -8px var(--color-elevation-shadow-default);
  transform: var(--mt-nav-flyout-shift);
  transform-origin: left center;
  animation: mt-nav-flyout-in 0.1s ease;

  &.is--closing {
    animation: mt-nav-flyout-out 0.1s ease forwards;
  }
}

@keyframes mt-nav-flyout-in {
  from {
    opacity: 0;
    transform: var(--mt-nav-flyout-shift) scale(0.98);
  }

  to {
    opacity: 1;
    transform: var(--mt-nav-flyout-shift) scale(1);
  }
}

@keyframes mt-nav-flyout-out {
  from {
    opacity: 1;
    transform: var(--mt-nav-flyout-shift) scale(1);
  }

  to {
    opacity: 0;
    transform: var(--mt-nav-flyout-shift) scale(0.95);
  }
}

.mt-nav__flyout-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

// Typography comes from mt-text, layout and truncation are ours.
.mt-nav__flyout-title {
  height: var(--scale-size-36);
  padding: 0 var(--scale-size-6) 0 var(--scale-size-10);
  display: flex;
  align-items: center;
  gap: var(--scale-size-10);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
