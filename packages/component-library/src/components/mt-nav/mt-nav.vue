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
    >
      <slot />
    </div>
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
import { useI18n } from "vue-i18n";
import { NAV_CONTEXT } from "./_internal/mt-nav-context";
import { navItemKey } from "./_internal/nav-item-key";
import { getActiveRouteNames, isItemOnActiveRoute } from "./_internal/nav-item-active.helper";
import type { NavItem, NavLinkComponent, NavRoute, NavRouter } from "./mt-nav.types";

export type { NavItem, NavLinkComponent, NavRoute, NavRouter } from "./mt-nav.types";

const TOGGLE_ANIMATION_DURATION = 500;

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
   * Whether the navigation is expanded. Collapsed, it shows the top level icons only.
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
  /** The `mt-nav-section` components holding the rows. */
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

const scrollbarOffset = ref("");
const isToggling = ref(false);
const activeBranchKey = ref<string | null | undefined>(null);
const expandedItems = ref<NavItem[]>([]);

// The top level rows of every mounted section, in mount order
const registeredItemLists = shallowRef<Ref<NavItem[]>[]>([]);

let toggleTimeout: ReturnType<typeof setTimeout> | null = null;

// Every top level row across the sections; branches are keyed globally, not per section
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
  registerItems,
  onBranchToggle,
  onLinkClick,
});

watch(
  () => props.expanded,
  () => {
    // Collapsing hides the expanded tree, so drop that state
    if (!props.expanded) {
      expandedItems.value = [];
    }

    startToggleWindow();
  },
);

// Query-insensitive on purpose: listing pagination/sorting must not re-expand a collapsed branch
watch(
  () => props.route?.path,
  () => {
    // Ensure the branch owning the new page is open, once the route change has rendered
    nextTick(() => expandAncestorBranchesForCurrentRoute());
  },
  { immediate: true },
);

// Rows usually mount after the first render (app modules, plugins), so revisit the active branch
watch(mainItems, () => {
  nextTick(() => expandAncestorBranchesForCurrentRoute());
});

onMounted(() => {
  addScrollbarOffset();
});

onBeforeUnmount(() => {
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

function onLinkClick(item: NavItem) {
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

      return !mainItem || !isItemOnActiveRoute(mainItem, props.route, activeNames);
    })
    .forEach((expanded) => collapseItem(expanded));
}

function onNavigationKeydown(event: KeyboardEvent) {
  // arrow key support, per the APG disclosure navigation pattern.
  const body = navBodyElement.value;

  if (!body) {
    return;
  }

  const links = Array.from(body.querySelectorAll<HTMLElement>(".mt-nav__link")).filter(
    (link) => !link.closest("[hidden]"),
  );

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

function expandAncestorBranchesForCurrentRoute() {
  // Only the expanded navigation shows a tree to open
  if (!props.expanded) {
    return;
  }

  const activeNames = getActiveRouteNames(props.route, props.router);
  const activeItems = mainItems.value.filter((item) =>
    isItemOnActiveRoute(item, props.route, activeNames),
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
}
</style>
