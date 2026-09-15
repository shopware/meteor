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
      <mt-nav-section
        v-for="(section, index) in prunedSections"
        :key="section.id ?? section.header ?? index"
        :header="section.header"
        @mouseenter="cancelFlyoutClose"
        @focusin="cancelFlyoutClose"
        @mouseleave="onSectionMouseLeave"
        @focusout="onSectionMouseLeave"
      >
        <mt-nav-item
          v-for="entry in section.entries"
          :key="entry.id || entry.path"
          :nav-expanded="expanded"
          :is-expanded="isEntryExpanded(entry)"
          :flyout-active="isFlyoutEntryActive(entry)"
          :entry="entry"
          @menu-item-hover="onMenuItemHover"
          @branch-toggle="onMenuBranchToggle"
          @flyout-focus-request="onFlyoutFocusRequest"
          @flyout-close-request="onFlyoutLeave"
          @flyout-navigate="onFlyoutNavigate"
          @navigation-link-click="onNavigationLinkClicked"
        >
          <template #entry-suffix="slotProps">
            <slot name="entry-suffix" v-bind="slotProps" />
          </template>
        </mt-nav-item>
      </mt-nav-section>
    </div>

    <!--
    <mt-floating-ui
      :is-opened="!expanded && flyoutEntries.length > 0"
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
            v-for="entry in flyoutEntries"
            :key="entry.id || entry.path"
            :entry="entry"
            :menu-depth="2"
            :nav-expanded="expanded"
            :display-icon="false"
            :collapsible-text="false"
            @flyout-navigate="onFlyoutNavigate"
            @navigation-link-click="onNavigationLinkClicked"
          >
            <template #entry-suffix="slotProps">
              <slot name="entry-suffix" v-bind="slotProps" />
            </template>
          </mt-nav-item>
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
  useId,
  watch,
  type PropType,
} from "vue";
import { createFocusTrap, type FocusTrap } from "focus-trap";
import { useI18n } from "vue-i18n";
import MtText from "@/components/mt-text/mt-text.vue";
// import MtFloatingUi from "@/components/mt-floating-ui/mt-floating-ui.vue";
import MtNavItem from "./_internal/mt-nav-item.vue";
import MtNavSection from "./_internal/mt-nav-section.vue";
import { NAV_CONTEXT } from "./_internal/mt-nav-context";
import { getActiveRouteNames, isEntryOnActiveRoute } from "./_internal/nav-item-active.helper";
import type { NavEntry, NavLinkComponent, NavRoute, NavRouter, NavSection } from "./mt-nav.types";

export type { NavEntry, NavLinkComponent, NavRoute, NavRouter, NavSection } from "./mt-nav.types";

const TOGGLE_ANIMATION_DURATION = 500;
const FLYOUT_CLOSE_DELAY = 180;
const FLYOUT_CLOSE_ANIMATION_DURATION = 200;
const MAX_NESTING_LEVEL = 3;

const props = defineProps({
  /**
   * Sections of the navigation, each with an optional header and a tree of entries nested via
   * `children`, up to three levels deep.
   */
  sections: {
    type: Array as PropType<NavSection[]>,
    required: true,
  },
  /**
   * The current route, used to highlight the active entry and open its branch.
   */
  route: {
    type: Object as PropType<NavRoute>,
    default: undefined,
  },
  /**
   * The router, used to follow `meta.parentPath` of routes not listed in the menu.
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
  (e: "navigate", entry: NavEntry): void;
}>();

defineSlots<{
  /** Rendered after the label of every entry, e.g. for a badge or counter. */
  "entry-suffix"?: (props: { entry: NavEntry }) => unknown;
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

const activeEntry = ref<{ entry: NavEntry; target: HTMLElement } | null>(null);
const flyoutEntries = ref<NavEntry[]>([]);
const flyoutTitle = ref("");
const isFlyoutClosing = ref(false);
const isFlyoutPinned = ref(false);
const flyoutReferenceElement = ref<HTMLElement | null>(null);
const scrollbarOffset = ref("");
const isToggling = ref(false);
const activeBranchKey = ref<string | null | undefined>(null);
const expandedEntries = ref<NavEntry[]>([]);

let flyoutCloseTimeoutId: ReturnType<typeof setTimeout> | null = null;
let toggleTimeout: ReturnType<typeof setTimeout> | null = null;
let flyoutFocusTrap: FocusTrap | null = null;

const prunedSections = computed(() =>
  props.sections.map((section) => ({
    ...section,
    entries: pruneDeepEntries(section.entries),
  })),
);

// Every top level entry across the sections; branches are keyed globally, not per section
const mainEntries = computed(() => prunedSections.value.flatMap((section) => section.entries));

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
  hasExpandedBranches: computed(() => expandedEntries.value.length > 0),
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

// Entries usually arrive after the first render (app modules, plugins), so revisit the active branch
watch(mainEntries, () => {
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

/**
 * Identity of an entry: its id, with the path as fallback. Branches are keyed by it, so entries
 * without either share the key undefined and are compared by reference instead.
 */
function menuEntryKey(entry: NavEntry): string | undefined {
  return entry.id ?? entry.path;
}

function pruneDeepEntries(entries: NavEntry[], level = 1): NavEntry[] {
  return entries.map((entry) => {
    const children = entry.children ?? [];

    if (level < MAX_NESTING_LEVEL) {
      return { ...entry, children: pruneDeepEntries(children, level + 1) };
    }

    // Nesting beyond level 3 is unsupported: report it and drop the children.
    children.forEach((child) => {
      console.error(
        `[mt-nav] The navigation entry "${menuEntryKey(child)}" is nested on level 4 or higher. ` +
          "The navigation only supports up to three levels of nesting.",
      );
    });

    return { ...entry, children: [] };
  });
}

function closeFlyoutAfterNavigation() {
  // Ensure an open flyout closes once the page changes
  if (!props.expanded && flyoutEntries.value.length && !isFlyoutPinned.value) {
    // Ensure the keyboard focus stays on the new page
    deactivateFlyoutFocusTrap(false);
    onFlyoutLeave();
  }
}

function onNavigationLinkClicked(entry: NavEntry) {
  // Tapping the current route's entry aborts as redundant navigation, so no route watcher fires
  closeFlyoutAfterNavigation();

  emit("navigate", entry);
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
    expandedEntries.value = [];
    onFlyoutLeave();
  }

  flyoutEntries.value = [];
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

function expandEntry(entry: NavEntry) {
  const key = menuEntryKey(entry);

  // Entries without id and path share the key undefined, so never deduplicate them
  if (key !== undefined && expandedEntries.value.some((e) => menuEntryKey(e) === key)) {
    return;
  }

  expandedEntries.value = [...expandedEntries.value, entry];
}

function collapseEntry(entry: NavEntry) {
  const key = menuEntryKey(entry);

  if (key === undefined) {
    expandedEntries.value = expandedEntries.value.filter((e) => e !== entry);
    return;
  }

  expandedEntries.value = expandedEntries.value.filter((e) => menuEntryKey(e) !== key);
}

// Only top level rows emit branch-toggle, nested rows keep their own open state
function onMenuBranchToggle({ entry, open }: { entry: NavEntry; open: boolean }) {
  if (!props.expanded || !entry) {
    return;
  }

  if (!open) {
    collapseEntry(entry);
    return;
  }

  collapseInactiveBranches(entry);
  expandEntry(entry);
}

function collapseInactiveBranches(exceptEntry: NavEntry | null = null) {
  const exceptKey = exceptEntry ? menuEntryKey(exceptEntry) : null;
  const activeNames = getActiveRouteNames(props.route, props.router);

  expandedEntries.value
    .filter((expanded) => {
      const key = menuEntryKey(expanded);

      if (key === exceptKey) {
        return false;
      }

      const menuEntry = mainEntries.value.find((entry) => menuEntryKey(entry) === key);

      return !menuEntry || !isEntryOnActiveRoute(menuEntry, props.route, activeNames);
    })
    .forEach((expanded) => collapseEntry(expanded));
}

function onMenuItemHover(entry: NavEntry, eventTarget: HTMLElement) {
  if (props.expanded) {
    return;
  }

  cancelFlyoutClose();

  const target = eventTarget.closest<HTMLElement>(".mt-nav__list-item");

  if (!target) {
    return;
  }

  const hasChildrenClass = target.classList.contains("navigation-list-item__has-children");
  const children = hasChildrenClass ? entry.children ?? [] : [];

  if (!hasChildrenClass || children.length === 0) {
    onFlyoutLeave();
    return;
  }

  const entryKey = menuEntryKey(entry);
  const active = activeEntry.value?.entry;
  const activeKey = active ? menuEntryKey(active) : null;

  if (activeKey === entryKey && flyoutEntries.value.length > 0) {
    return;
  }

  flyoutReferenceElement.value = target.querySelector<HTMLElement>(".mt-nav__link") ?? target;
  isFlyoutPinned.value = false;
  flyoutEntries.value = children;
  flyoutTitle.value = entry.label;

  activeEntry.value = { entry, target };
}

function onSectionMouseLeave(event: MouseEvent | FocusEvent) {
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

  if ((event.relatedTarget as HTMLElement | null)?.closest(".mt-nav__section")) {
    return;
  }

  scheduleFlyoutClose();
}

function isSuppressedFlyoutFocusOut(event: Event) {
  return event.type === "focusout" && isFlyoutPinned.value;
}

function onFlyoutNavigate({ disclosesChildren }: { disclosesChildren: boolean }) {
  isFlyoutPinned.value = disclosesChildren;
}

function scheduleFlyoutClose() {
  if (props.expanded || !flyoutEntries.value.length) {
    return;
  }

  cancelFlyoutClose();

  flyoutCloseTimeoutId = setTimeout(() => {
    startFlyoutCloseAnimation();
  }, FLYOUT_CLOSE_DELAY);
}

function startFlyoutCloseAnimation() {
  if (!flyoutEntries.value.length) {
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

function isFlyoutEntryActive(entry: NavEntry) {
  if (props.expanded || flyoutEntries.value.length === 0) {
    return false;
  }

  const active = activeEntry.value?.entry;

  return !!active && menuEntryKey(active) === menuEntryKey(entry);
}

function onFlyoutFocusRequest() {
  nextTick(() => {
    const element = flyoutElement.value;

    if (!element || flyoutEntries.value.length === 0) {
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
  activeEntry.value = null;
  flyoutReferenceElement.value = null;
  flyoutEntries.value = [];
  flyoutTitle.value = "";
}

function expandAncestorBranchesForCurrentRoute() {
  // Only the expanded navigation shows a tree to open; collapsed entries use the flyout instead
  if (!props.expanded) {
    return;
  }

  const activeNames = getActiveRouteNames(props.route, props.router);
  const activeEntries = mainEntries.value.filter((entry) =>
    isEntryOnActiveRoute(entry, props.route, activeNames),
  );

  // Pages the menu does not list at all own no branch; leave the tree as the user left it
  if (!activeEntries.length) {
    return;
  }

  const owner = activeEntries.find((entry) => (entry.children ?? []).length > 0) ?? null;
  const ownerKey = owner ? menuEntryKey(owner) : null;

  // The cached owner may have been collapsed manually
  if (ownerKey === activeBranchKey.value && (!owner || isEntryExpanded(owner))) {
    return;
  }

  // Branches only stay open while they own the active item, or while nothing in the menu does.
  collapseInactiveBranches(owner);
  activeBranchKey.value = ownerKey;

  if (owner && !isEntryExpanded(owner)) {
    expandEntry(owner);
  }
}

function isEntryExpanded(entry: NavEntry) {
  const key = menuEntryKey(entry);

  return expandedEntries.value.some((expanded) => menuEntryKey(expanded) === key);
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
  // Aligns the first flyout item with the hovered entry: title height + padding + border
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
