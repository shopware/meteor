<template>
  <transition name="mt-sidebar__backdrop">
    <div
      v-if="isMobileViewport && offCanvasOpen"
      class="mt-sidebar__backdrop"
      @click="dismissOffCanvas"
    ></div>
  </transition>

  <aside
    ref="menuElement"
    class="mt-sidebar"
    :class="sidebarClasses"
    :data-expanded="isExpanded"
    :inert="isMobileViewport && !offCanvasOpen"
  >
    <div class="mt-sidebar__header">
      <div
        class="mt-sidebar__header-logo-wrapper"
        :class="{ 'mt-sidebar__header-logo-wrapper--empty': !$slots.logo }"
      >
        <div v-if="$slots.logo" class="mt-sidebar__header-logo-box">
          <slot name="logo" />
        </div>

        <button
          v-if="!isExpanded"
          type="button"
          class="mt-sidebar__header-logo-expand-button"
          :aria-label="t('expandMenu')"
          @click.stop="onToggleSidebar"
        >
          <mt-icon name="regular-panel-left" size="16px" />
        </button>
      </div>

      <div
        v-if="title || subtitle"
        class="mt-sidebar__collapsible-text mt-sidebar__hide-on-collapse mt-sidebar__heading"
      >
        <mt-text
          v-if="title"
          as="div"
          class="mt-sidebar__title"
          size="s"
          weight="semibold"
          :title="title"
        >
          {{ title }}
        </mt-text>

        <mt-text
          v-if="subtitle"
          as="div"
          class="mt-sidebar__subtitle"
          size="2xs"
          color="color-text-secondary-default"
        >
          {{ subtitle }}
        </mt-text>
      </div>

      <mt-button
        v-if="isMobileViewport"
        class="mt-sidebar__off-canvas-close"
        variant="tertiary"
        size="default"
        square
        :aria-label="t('closeMenu')"
        @click.stop="dismissOffCanvas"
      >
        <template #iconFront>
          <mt-icon name="solid-times" size="12px" />
        </template>
      </mt-button>
      <mt-button
        v-else
        class="mt-sidebar__collapse-button"
        variant="tertiary"
        size="default"
        square
        :aria-label="t('collapseMenu')"
        @click.stop="onToggleSidebar"
      >
        <template #iconFront>
          <mt-icon class="mt-sidebar__hide-on-collapse" name="regular-panel-left" size="16px" />
        </template>
      </mt-button>
    </div>

    <div class="mt-sidebar__body-container">
      <div
        ref="menuBodyElement"
        class="mt-sidebar__body"
        :style="scrollbarOffsetStyle"
        @keydown="onNavigationKeydown"
      >
        <nav class="mt-sidebar__navigation" :aria-labelledby="navigationLabelId">
          <h2 :id="navigationLabelId" class="visually-hidden">
            {{ t("navigationLabel") }}
          </h2>

          <ul
            class="mt-sidebar__navigation-list"
            @mouseenter="cancelFlyoutClose"
            @focusin="cancelFlyoutClose"
            @mouseleave="onNavigationListMouseLeave"
            @focusout="onNavigationListMouseLeave"
          >
            <mt-sidebar-item
              v-for="entry in mainEntries"
              :key="entry.id || entry.path"
              :sidebar-expanded="isExpanded"
              :is-expanded="isNavigationEntryExpanded(entry)"
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
            </mt-sidebar-item>
          </ul>
        </nav>
      </div>
    </div>

    <div class="mt-sidebar__footer">
      <slot name="footer" :expanded="isExpanded" />
    </div>

    <mt-floating-ui
      :is-opened="!isExpanded && flyoutEntries.length > 0"
      :anchor-element="flyoutReferenceElement"
      :floating-ui-options="{ placement: 'right-start' }"
      :offset="12"
      detached
      @close="onFlyoutLeave"
    >
      <div
        id="mt-sidebar-flyout"
        ref="flyoutElement"
        class="mt-sidebar__flyout-content"
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
          class="mt-sidebar__flyout-title"
          size="xs"
          color="color-text-secondary-default"
        >
          {{ flyoutTitle }}
        </mt-text>

        <ul class="mt-sidebar__flyout-list">
          <mt-sidebar-item
            v-for="entry in flyoutEntries"
            :key="entry.id || entry.path"
            :entry="entry"
            :menu-depth="2"
            :sidebar-expanded="isExpanded"
            :display-icon="false"
            :collapsible-text="false"
            @flyout-navigate="onFlyoutNavigate"
            @navigation-link-click="onNavigationLinkClicked"
          >
            <template #entry-suffix="slotProps">
              <slot name="entry-suffix" v-bind="slotProps" />
            </template>
          </mt-sidebar-item>
        </ul>
      </div>
    </mt-floating-ui>
  </aside>
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
import MtIcon from "@/components/mt-icon/mt-icon.vue";
import MtText from "@/components/mt-text/mt-text.vue";
import MtButton from "@/components/mt-button/mt-button.vue";
import MtFloatingUi from "@/components/mt-floating-ui/mt-floating-ui.vue";
import MtSidebarItem from "./_internal/mt-sidebar-item.vue";
import { SIDEBAR_CONTEXT } from "./_internal/mt-sidebar-context";
import { buildSidebarTree, menuEntryKey } from "./_internal/build-sidebar-tree";
import { getActiveRouteNames, isEntryOnActiveRoute } from "./_internal/sidebar-item-active.helper";
import type {
  SidebarEntry,
  SidebarLinkComponent,
  SidebarRoute,
  SidebarRouter,
  SidebarTreeEntry,
} from "./mt-sidebar.types";

export type {
  SidebarEntry,
  SidebarLinkComponent,
  SidebarRoute,
  SidebarRouter,
  SidebarTreeEntry,
} from "./mt-sidebar.types";

const SIDEBAR_TOGGLE_ANIMATION_DURATION = 500;
const VIEWPORT_RESIZE_SETTLE_DURATION = 200;
const FLYOUT_CLOSE_DELAY = 180;
const FLYOUT_CLOSE_ANIMATION_DURATION = 200;
const MAX_NESTING_LEVEL = 3;

const props = defineProps({
  /**
   * Flat list of navigation entries. Nested via `parent`, sorted via `position`.
   */
  entries: {
    type: Array as PropType<SidebarEntry[]>,
    required: true,
  },
  /**
   * The current route, used to highlight the active entry and open its branch.
   */
  route: {
    type: Object as PropType<SidebarRoute>,
    default: undefined,
  },
  /**
   * The router, used to follow `meta.parentPath` of routes not listed in the menu.
   */
  router: {
    type: Object as PropType<SidebarRouter>,
    default: undefined,
  },
  /**
   * Component rendering the navigation links. Receives the route location as `to`.
   */
  linkComponent: {
    type: [String, Object] as PropType<SidebarLinkComponent>,
    default: "router-link",
  },
  /**
   * Heading next to the logo, e.g. the name of the shop or application.
   */
  title: {
    type: String,
    default: undefined,
  },
  /**
   * Secondary line below the title.
   */
  subtitle: {
    type: String,
    default: undefined,
  },
  /**
   * Viewport width in px at and below which the menu turns into the mobile off-canvas panel.
   */
  mobileBreakpoint: {
    type: Number,
    default: 1280,
  },
});

const emit = defineEmits<{
  (e: "navigate", entry: SidebarTreeEntry): void;
}>();

defineSlots<{
  /** Logo shown in the header. Add the `mt-sidebar__header-logo` class to an icon to size it. */
  logo?: () => unknown;
  /**
   * Footer below the navigation, e.g. the current user with an action menu. Receives the
   * expanded state so its content can adapt to the collapsed rail.
   */
  footer?: (props: { expanded: boolean }) => unknown;
  /** Rendered after the label of every entry, e.g. for a badge or counter. */
  "entry-suffix"?: (props: { entry: SidebarTreeEntry }) => unknown;
}>();

/**
 * Whether the sidebar is expanded. Ignored on mobile viewports, where the panel is always expanded.
 */
const expanded = defineModel<boolean>("expanded", { default: true });

/**
 * Whether the mobile off-canvas panel is shown.
 */
const offCanvasOpen = defineModel<boolean>("offCanvasOpen", { default: false });

const { t } = useI18n({
  messages: {
    en: {
      expandMenu: "Expand menu",
      collapseMenu: "Collapse menu",
      closeMenu: "Close menu",
      navigationLabel: "Main navigation",
    },
    de: {
      expandMenu: "Menü ausklappen",
      collapseMenu: "Menü einklappen",
      closeMenu: "Menü schließen",
      navigationLabel: "Hauptnavigation",
    },
  },
});

const navigationLabelId = `mt-sidebar-navigation-label-${useId()}`;

const menuElement = ref<HTMLElement | null>(null);
const menuBodyElement = ref<HTMLElement | null>(null);
const flyoutElement = ref<HTMLElement | null>(null);

const activeEntry = ref<{ entry: SidebarTreeEntry; target: HTMLElement } | null>(null);
const flyoutEntries = ref<SidebarTreeEntry[]>([]);
const flyoutTitle = ref("");
const isFlyoutClosing = ref(false);
const isFlyoutPinned = ref(false);
const flyoutReferenceElement = ref<HTMLElement | null>(null);
const scrollbarOffset = ref("");
const viewportWidth = ref<number | null>(typeof window === "undefined" ? null : window.innerWidth);
const isTogglingSidebar = ref(false);
const isViewportResizing = ref(false);
const activeBranchKey = ref<string | null | undefined>(null);
const expandedEntries = ref<SidebarTreeEntry[]>([]);

let flyoutCloseTimeoutId: ReturnType<typeof setTimeout> | null = null;
let toggleSidebarTimeout: ReturnType<typeof setTimeout> | null = null;
let viewportResizeTimeout: ReturnType<typeof setTimeout> | null = null;
let flyoutFocusTrap: FocusTrap | null = null;
let offCanvasFocusTrap: FocusTrap | null = null;
let menuDropdownObserver: MutationObserver | null = null;
let openMenuDropdownTrigger: HTMLElement | null = null;

const isMobileViewport = computed(
  () => viewportWidth.value !== null && viewportWidth.value <= props.mobileBreakpoint,
);

const isExpanded = computed(() => expanded.value || isMobileViewport.value);

const mainEntries = computed(() => pruneDeepEntries(buildSidebarTree(props.entries)));

const sidebarClasses = computed(() => ({
  "is--expanded": isExpanded.value,
  "is--collapsed": !isExpanded.value,
  "is--off-canvas-shown": offCanvasOpen.value,
  "is--toggling": isTogglingSidebar.value,
  "is--viewport-resizing": isViewportResizing.value,
}));

const scrollbarOffsetStyle = computed(() => ({
  right: scrollbarOffset.value,
  "margin-left": scrollbarOffset.value,
}));

provide(SIDEBAR_CONTEXT, {
  route: computed(() => props.route),
  router: computed(() => props.router),
  linkComponent: computed(() => props.linkComponent),
  hasExpandedBranches: computed(() => expandedEntries.value.length > 0),
});

watch(isExpanded, () => {
  toggleSidebar();
  startSidebarToggleWindow();
});

watch(offCanvasOpen, (isShown) => {
  if (isShown) {
    activateOffCanvasFocusTrap();
  } else {
    deactivateOffCanvasFocusTrap();
  }
});

watch(isMobileViewport, (isMobile) => {
  if (!isMobile && offCanvasOpen.value) {
    closeOffCanvas();
  }
});

// Query-insensitive on purpose: listing pagination/sorting must not re-expand a collapsed branch
watch(
  () => props.route?.path,
  () => {
    closeNavigationOverlays();

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
  window.addEventListener("resize", onViewportResize);
  addScrollbarOffset();
});

onBeforeUnmount(() => {
  cancelFlyoutClose();
  deactivateFlyoutFocusTrap(false);
  deactivateOffCanvasFocusTrap();

  window.removeEventListener("resize", onViewportResize);

  if (toggleSidebarTimeout) {
    clearTimeout(toggleSidebarTimeout);
  }

  if (viewportResizeTimeout) {
    clearTimeout(viewportResizeTimeout);
  }
});

function pruneDeepEntries(entries: SidebarTreeEntry[]): SidebarTreeEntry[] {
  return entries.map((entry) => {
    if (entry.level < MAX_NESTING_LEVEL) {
      return { ...entry, children: pruneDeepEntries(entry.children) };
    }

    // Nesting beyond level 3 is unsupported: report it and drop the children.
    entry.children.forEach((child) => {
      console.error(
        `[mt-sidebar] The navigation entry "${menuEntryKey(child)}" is nested on level 4 or higher. ` +
          "The sidebar only supports up to three levels of nesting.",
      );
    });

    return { ...entry, children: [] };
  });
}

function onViewportResize() {
  viewportWidth.value = window.innerWidth;
  isViewportResizing.value = true;

  if (viewportResizeTimeout) {
    clearTimeout(viewportResizeTimeout);
  }

  viewportResizeTimeout = setTimeout(() => {
    isViewportResizing.value = false;
  }, VIEWPORT_RESIZE_SETTLE_DURATION);
}

function closeOffCanvas() {
  offCanvasOpen.value = false;
}

function closeNavigationOverlays() {
  // Ensure an open flyout closes once the page changes
  if (!isExpanded.value && flyoutEntries.value.length && !isFlyoutPinned.value) {
    // Ensure the keyboard focus stays on the new page
    deactivateFlyoutFocusTrap(false);
    onFlyoutLeave();
  }

  // Make sure the mobile off-canvas panel closes so the new page is not left hidden behind it
  if (isMobileViewport.value && offCanvasOpen.value) {
    closeOffCanvas();
  }
}

function onNavigationLinkClicked(entry: SidebarTreeEntry) {
  // Tapping the current route's entry aborts as redundant navigation, so no route watcher fires
  closeNavigationOverlays();

  emit("navigate", entry);
}

function dismissOffCanvas() {
  // Explicit dismissal restores focus to the opener
  if (offCanvasFocusTrap) {
    offCanvasFocusTrap.deactivate();
    return;
  }

  closeOffCanvas();
}

function activateOffCanvasFocusTrap() {
  nextTick(() => {
    const panelElement = menuElement.value;

    if (!panelElement || !offCanvasOpen.value || offCanvasFocusTrap) {
      return;
    }

    offCanvasFocusTrap = createFocusTrap(panelElement, {
      escapeDeactivates: true,
      clickOutsideDeactivates: false,
      allowOutsideClick: true,
      returnFocusOnDeactivate: true,
      delayInitialFocus: false,
      fallbackFocus: panelElement,
      onDeactivate: () => {
        stopMenuDropdownObserver();
        offCanvasFocusTrap = null;
        closeOffCanvas();
      },
    });

    offCanvasFocusTrap.activate();
    startMenuDropdownObserver(panelElement);
  });
}

function startMenuDropdownObserver(panelElement: HTMLElement) {
  menuDropdownObserver = new MutationObserver(syncMenuDropdownFocusOwner);

  menuDropdownObserver.observe(panelElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["data-state"],
  });
}

function stopMenuDropdownObserver() {
  menuDropdownObserver?.disconnect();
  menuDropdownObserver = null;
  openMenuDropdownTrigger = null;
}

function syncMenuDropdownFocusOwner() {
  if (!offCanvasFocusTrap) {
    return;
  }

  // aria-haspopup narrows this to dropdown triggers: open navigation collapsibles share the same data-state
  const openTrigger = menuElement.value?.querySelector<HTMLElement>(
    '[aria-haspopup="menu"][data-state="open"]',
  );

  if (openTrigger && !openMenuDropdownTrigger) {
    openMenuDropdownTrigger = openTrigger;
    offCanvasFocusTrap.pause();

    return;
  }

  if (!openTrigger && openMenuDropdownTrigger) {
    const previousTrigger = openMenuDropdownTrigger;
    openMenuDropdownTrigger = null;

    if (previousTrigger.isConnected) {
      previousTrigger.focus();
    }

    offCanvasFocusTrap.unpause();
  }
}

function deactivateOffCanvasFocusTrap() {
  if (!offCanvasFocusTrap) {
    return;
  }

  const trap = offCanvasFocusTrap;
  offCanvasFocusTrap = null;

  trap.deactivate({ returnFocus: false });
}

function onToggleSidebar() {
  expanded.value = !isExpanded.value;

  toggleSidebar();
}

function startSidebarToggleWindow() {
  // Marks the sidebar as mid-toggle so CSS can suppress unwanted animations while it slides
  isTogglingSidebar.value = true;

  if (toggleSidebarTimeout) {
    clearTimeout(toggleSidebarTimeout);
  }

  toggleSidebarTimeout = setTimeout(() => {
    isTogglingSidebar.value = false;
    toggleSidebarTimeout = null;
  }, SIDEBAR_TOGGLE_ANIMATION_DURATION);
}

function toggleSidebar() {
  // Collapsing hides the expanded tree, so drop that state and close anything left floating
  if (!isExpanded.value) {
    expandedEntries.value = [];
    onFlyoutLeave();
  }

  flyoutEntries.value = [];
}

function addScrollbarOffset() {
  const body = menuBodyElement.value;

  if (!body) {
    return;
  }

  // A negative offset pulls the scrollbar outside the menu so it does not eat into the visible width
  const scrollbarWidthPx = body.offsetWidth - body.clientWidth;

  scrollbarOffset.value = `-${scrollbarWidthPx}px`;
}

function expandSidebarEntry(entry: SidebarTreeEntry) {
  const key = menuEntryKey(entry);

  // Entries without id and path share the key undefined, so never deduplicate them
  if (key !== undefined && expandedEntries.value.some((e) => menuEntryKey(e) === key)) {
    return;
  }

  expandedEntries.value = [...expandedEntries.value, entry];
}

function collapseSidebarEntry(entry: SidebarTreeEntry) {
  const key = menuEntryKey(entry);

  if (key === undefined) {
    expandedEntries.value = expandedEntries.value.filter((e) => e !== entry);
    return;
  }

  expandedEntries.value = expandedEntries.value.filter((e) => menuEntryKey(e) !== key);
}

function onMenuBranchToggle({ entry, open }: { entry: SidebarTreeEntry; open: boolean }) {
  if (!isExpanded.value || !entry || entry.level !== 1) {
    return;
  }

  if (!open) {
    collapseSidebarEntry(entry);
    return;
  }

  collapseInactiveBranches(entry);
  expandSidebarEntry(entry);
}

function collapseInactiveBranches(exceptEntry: SidebarTreeEntry | null = null) {
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
    .forEach((expanded) => collapseSidebarEntry(expanded));
}

function onMenuItemHover(entry: SidebarTreeEntry, eventTarget: HTMLElement) {
  if (isExpanded.value) {
    return;
  }

  cancelFlyoutClose();

  const target = eventTarget.closest<HTMLElement>(".mt-sidebar__navigation-list-item");

  if (!target) {
    return;
  }

  const hasChildrenClass = target.classList.contains("navigation-list-item__has-children");
  const children = hasChildrenClass ? entry.children : [];

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

  flyoutReferenceElement.value =
    target.querySelector<HTMLElement>(".mt-sidebar__navigation-link") ?? target;
  isFlyoutPinned.value = false;
  flyoutEntries.value = children;
  flyoutTitle.value = entry.label;

  activeEntry.value = { entry, target };
}

function onNavigationListMouseLeave(event: MouseEvent | FocusEvent) {
  if (isSuppressedFlyoutFocusOut(event)) {
    return;
  }

  if ((event.relatedTarget as HTMLElement | null)?.closest(".mt-sidebar__flyout-content")) {
    return;
  }

  scheduleFlyoutClose();
}

function onFlyoutMouseLeave(event: MouseEvent | FocusEvent) {
  if (isSuppressedFlyoutFocusOut(event)) {
    return;
  }

  if ((event.relatedTarget as HTMLElement | null)?.closest(".mt-sidebar__navigation-list")) {
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
  if (isExpanded.value || !flyoutEntries.value.length) {
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

function isFlyoutEntryActive(entry: SidebarTreeEntry) {
  if (isExpanded.value || flyoutEntries.value.length === 0) {
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
  return Array.from(container.querySelectorAll<HTMLElement>(".mt-sidebar__navigation-link")).filter(
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
  const menuBody = menuBodyElement.value;

  if (!menuBody) {
    return;
  }

  moveListFocus(getNavigationLinks(menuBody), event);
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
  // Only the expanded sidebar shows a tree to open; collapsed entries use the flyout instead
  if (!isExpanded.value) {
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

  const owner = activeEntries.find((entry) => entry.children.length > 0) ?? null;
  const ownerKey = owner ? menuEntryKey(owner) : null;

  // The cached owner may have been collapsed manually
  if (ownerKey === activeBranchKey.value && (!owner || isNavigationEntryExpanded(owner))) {
    return;
  }

  // Branches only stay open while they own the active item, or while nothing in the menu does.
  collapseInactiveBranches(owner);
  activeBranchKey.value = ownerKey;

  if (owner && !isNavigationEntryExpanded(owner)) {
    expandSidebarEntry(owner);
  }
}

function isNavigationEntryExpanded(entry: SidebarTreeEntry) {
  const key = menuEntryKey(entry);

  return expandedEntries.value.some((expanded) => menuEntryKey(expanded) === key);
}
</script>

<style lang="scss">
.mt-sidebar__backdrop {
  position: fixed;
  inset: 0;
  background: var(--color-elevation-backdrop-default);
  z-index: $z-index-off-canvas - 1;
  cursor: pointer;
}

.mt-sidebar__backdrop-enter-active,
.mt-sidebar__backdrop-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.mt-sidebar__backdrop-enter-from,
.mt-sidebar__backdrop-leave-to {
  opacity: 0;
}

.mt-sidebar {
  // Shared motion tokens for the collapse/expand animation.
  --mt-sidebar-bezier: cubic-bezier(0.32, 0.72, 0, 1);
  --mt-sidebar-duration: 0.5s; // root width/padding
  --mt-sidebar-duration-inner: 0.3s; // inner layout following the collapse
  --mt-sidebar-fade-in-duration: 0.4s;
  --mt-sidebar-fade-in-delay: 0.05s;
  --mt-sidebar-fade-out-duration: 0.05s;

  // Body vertical padding, doubling as the control points of its edge fade mask
  --mt-sidebar-body-fade: var(--scale-size-16);

  background: var(--color-elevation-surface-sunken);
  width: 60px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: var(--scale-size-16) var(--scale-size-12) var(--scale-size-8) var(--scale-size-12);
  transition:
    width var(--mt-sidebar-duration) var(--mt-sidebar-bezier),
    padding var(--mt-sidebar-duration) var(--mt-sidebar-bezier);

  // Keep in sync with the `mobileBreakpoint` prop default
  @media screen and (max-width: 1280px) {
    position: absolute;
    top: 0;

    // Shift by the margin too, it would keep 8px of the panel in view
    transform: translateX(calc(-100% - var(--scale-size-8)));
    bottom: 0;
    height: auto;
    margin: var(--scale-size-8);
    background: var(--color-elevation-surface-default);
    border: 1px solid var(--color-border-secondary-default);
    border-radius: var(--border-radius-l);
    box-shadow: 0 0 80px var(--color-elevation-shadow-default);
    z-index: $z-index-off-canvas;
    transition: transform var(--mt-sidebar-duration-inner) var(--mt-sidebar-bezier);

    &.is--off-canvas-shown {
      transform: translateX(0);
    }
  }

  .mt-sidebar__collapsible-text {
    display: inline-block;
    white-space: nowrap;
    width: 100%;
    position: relative;
    pointer-events: none;
  }

  // Elements animating layout on top of this must keep that transition on a parent
  .mt-sidebar__hide-on-collapse {
    opacity: 1;
    transition:
      opacity var(--mt-sidebar-fade-in-duration) ease-in-out var(--mt-sidebar-fade-in-delay),
      visibility var(--mt-sidebar-fade-in-duration) ease-in-out var(--mt-sidebar-fade-in-delay);
  }

  &.is--collapsed .mt-sidebar__hide-on-collapse {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition:
      opacity var(--mt-sidebar-fade-out-duration) ease-out,
      visibility var(--mt-sidebar-fade-out-duration) ease-out;
  }

  &.is--expanded {
    --mt-sidebar-body-fade: var(--scale-size-20);

    width: 300px;
    padding: var(--scale-size-24) var(--scale-size-12) var(--scale-size-8) var(--scale-size-12);

    .mt-sidebar__navigation-link.router-link-active {
      background: var(--color-background-brand-default);

      .mt-sidebar__collapsible-text {
        color: var(--color-icon-brand-default);
      }
    }
  }

  .mt-sidebar__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--scale-size-12);
    position: relative;
    padding-left: var(--scale-size-10);
    transition: padding var(--mt-sidebar-duration) var(--mt-sidebar-bezier);
  }

  // Keeps its layout size so the crossfade below never shifts the header
  .mt-sidebar__header-logo-wrapper {
    width: var(--scale-size-40);
    height: var(--scale-size-40);
    flex-shrink: 0;
    position: relative;
    transition:
      width var(--mt-sidebar-duration-inner) var(--mt-sidebar-bezier),
      height var(--mt-sidebar-duration-inner) var(--mt-sidebar-bezier);
  }

  // Crossfades with the expand button on hover while collapsed
  .mt-sidebar__header-logo-box {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-icon-brand-default);
    border-radius: var(--border-radius-m);
    transition:
      opacity 0.12s var(--mt-sidebar-bezier),
      transform 0.175s var(--mt-sidebar-bezier),
      filter 0.175s var(--mt-sidebar-bezier);
  }

  .mt-sidebar__header-logo {
    width: var(--scale-size-26);
    height: var(--scale-size-26);
    color: var(--color-static-white);
    transition:
      width var(--mt-sidebar-duration-inner) var(--mt-sidebar-bezier),
      height var(--mt-sidebar-duration-inner) var(--mt-sidebar-bezier);

    // The icon kit sizes the inner svg via an id selector, hence !important
    > svg {
      width: 100% !important;
      height: 100% !important;
    }
  }

  .mt-sidebar__heading {
    flex: 1 1 auto;
    gap: 0;
    margin-top: calc(-1 * var(--scale-size-1));
    min-width: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  // Typography comes from mt-text, only the truncation is ours.
  .mt-sidebar__title,
  .mt-sidebar__subtitle {
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 1.4;
  }

  .mt-sidebar__collapse-button {
    flex-shrink: 0;
    overflow: hidden;

    // Shrinks out of the header layout; visibility drops it from the tab order
    transition:
      width 0.25s var(--mt-sidebar-bezier),
      visibility 0.25s var(--mt-sidebar-bezier);
  }

  .mt-sidebar__off-canvas-close {
    flex-shrink: 0;
  }

  // Scale + blur mask the overlap with the logo so it reads as one morphing element
  .mt-sidebar__header-logo-expand-button {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-m);
    background: var(--color-interaction-secondary-default);
    border: 1px solid var(--color-border-primary-default);
    color: var(--color-icon-primary-default);
    cursor: pointer;

    // Opacity only: visibility hidden would stop keyboard users tabbing to it
    opacity: 0;
    transform: scale(1.15);
    filter: blur(2px);

    &:hover {
      background: var(--color-interaction-secondary-hover);
    }

    &:active {
      background: var(--color-interaction-secondary-pressed);
    }

    // Opacity resolves faster than the transform so the scale motion stays visible
    transition:
      opacity 0.12s var(--mt-sidebar-bezier),
      transform 0.2s var(--mt-sidebar-bezier),
      filter 0.2s var(--mt-sidebar-bezier);
  }

  .mt-sidebar__body-container {
    flex: 1 1 0;
    overflow: hidden;

    // Fades from 4px inside the edge to the body padding, so resting content stays opaque
    mask-image: linear-gradient(
      to bottom,
      transparent var(--scale-size-4),
      #000 var(--mt-sidebar-body-fade),
      #000 calc(100% - var(--mt-sidebar-body-fade)),
      transparent calc(100% - var(--scale-size-4))
    );
  }

  .mt-sidebar__body {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--scale-size-16);

    // Must live on the scroller: it clips at the padding box, keeping content visible for the mask
    padding: var(--mt-sidebar-body-fade) 0;
    overflow-x: hidden;
    overflow-y: scroll;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
    transition: padding var(--mt-sidebar-duration) var(--mt-sidebar-bezier);

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .mt-sidebar__navigation {
    white-space: nowrap;
  }

  .mt-sidebar__navigation-list {
    list-style: none;
  }

  &.is--collapsed {
    .mt-sidebar__collapse-button {
      width: 0;
      min-width: 0;
      padding: 0;
      border: 0;
      visibility: hidden;

      // Hide instantly when collapsing; the base state still animates the reveal
      transition: none;
    }

    .mt-sidebar__navigation-link {
      width: var(--scale-size-36);
      height: var(--scale-size-36);
    }

    @media not screen and (max-width: 1280px) {
      .mt-sidebar__header {
        padding: 0;
        margin: 0;
      }
    }

    .mt-sidebar__header-logo-wrapper {
      width: var(--scale-size-36);
      height: var(--scale-size-36);
    }

    .mt-sidebar__header-logo {
      width: var(--scale-size-24);
      height: var(--scale-size-24);
    }

    &:hover .mt-sidebar__header-logo-box,
    &:has(.mt-sidebar__header-logo-expand-button:focus-visible) .mt-sidebar__header-logo-box {
      opacity: 0;
      transform: scale(0.85);
      filter: blur(2px);
    }

    &:hover .mt-sidebar__header-logo-expand-button,
    .mt-sidebar__header-logo-expand-button:focus-visible {
      opacity: 1;
      transform: scale(1);
      filter: blur(0);
    }

    &.is--toggling:hover {
      .mt-sidebar__header-logo-box {
        opacity: 1;
        transform: none;
        filter: none;
      }

      .mt-sidebar__header-logo-expand-button {
        opacity: 0;
      }
    }
  }

  // Without a logo there is nothing to crossfade, so the expand button is always shown
  .mt-sidebar__header-logo-wrapper--empty .mt-sidebar__header-logo-expand-button,
  &.is--collapsed.is--toggling:hover
    .mt-sidebar__header-logo-wrapper--empty
    .mt-sidebar__header-logo-expand-button {
    opacity: 1;
    transform: none;
    filter: none;
  }

  // Crossing the off-canvas breakpoint would animate the width difference between both modes
  &.is--viewport-resizing,
  &.is--viewport-resizing * {
    transition: none;
  }

  // Keyframes need their own suppression; only closing, else it replays when the class is removed
  &.is--viewport-resizing .mt-collapsible-content[data-state="closed"] {
    animation: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mt-sidebar,
  .mt-sidebar .mt-sidebar__hide-on-collapse,
  .mt-sidebar .mt-sidebar__body,
  .mt-sidebar .mt-sidebar__header,
  .mt-sidebar .mt-sidebar__header-logo,
  .mt-sidebar .mt-sidebar__header-logo-box,
  .mt-sidebar .mt-sidebar__header-logo-expand-button,
  .mt-sidebar__backdrop-enter-active,
  .mt-sidebar__backdrop-leave-active {
    transition: none;
  }

  .mt-sidebar__flyout-content,
  .mt-sidebar__flyout-content.is--closing {
    animation: none;
  }
}

.mt-sidebar__flyout-content {
  // Aligns the first flyout item with the hovered entry: title height + padding + border
  --mt-sidebar-flyout-shift: translateY(
    calc(-1 * (var(--scale-size-36) + var(--scale-size-6) + 1px))
  );

  width: 264px;
  padding: var(--scale-size-6);
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius-m);
  border: 1px solid var(--color-border-secondary-default);
  background: var(--color-elevation-surface-raised);
  box-shadow: 0 6px 12px -8px var(--color-elevation-shadow-default);
  transform: var(--mt-sidebar-flyout-shift);
  transform-origin: left center;
  animation: mt-sidebar-flyout-in 0.1s ease;

  &.is--closing {
    animation: mt-sidebar-flyout-out 0.1s ease forwards;
  }
}

@keyframes mt-sidebar-flyout-in {
  from {
    opacity: 0;
    transform: var(--mt-sidebar-flyout-shift) scale(0.98);
  }

  to {
    opacity: 1;
    transform: var(--mt-sidebar-flyout-shift) scale(1);
  }
}

@keyframes mt-sidebar-flyout-out {
  from {
    opacity: 1;
    transform: var(--mt-sidebar-flyout-shift) scale(1);
  }

  to {
    opacity: 0;
    transform: var(--mt-sidebar-flyout-shift) scale(0.95);
  }
}

.mt-sidebar__flyout-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

// Typography comes from mt-text, layout and truncation are ours.
.mt-sidebar__flyout-title {
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
