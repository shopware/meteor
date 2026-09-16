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
} from "vue";
import { useI18n } from "vue-i18n";
import { NAV_CONTEXT, type NavBranchRegistration } from "./_internal/mt-nav-context";
import type { NavLinkComponent, NavNavigateEvent } from "./mt-nav.types";

export type { NavLinkComponent, NavLinkTarget, NavNavigateEvent } from "./mt-nav.types";

const TOGGLE_ANIMATION_DURATION = 500;

const props = defineProps({
  /**
   * Component rendering the navigation links. Receives the target of an item as `to`.
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
  (e: "navigate", event: NavNavigateEvent): void;
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
const expandedKeys = ref<string[]>([]);
const activeBranchKey = ref<string | null>(null);

// The top-level rows of every mounted section, in mount order
const branches = shallowRef<NavBranchRegistration[]>([]);

let toggleTimeout: ReturnType<typeof setTimeout> | null = null;

const hasActiveItem = computed(() => branches.value.some((branch) => branch.isActive.value));

// The top-level branch holding the active item, if the active item sits inside a branch
const activeOwnerKey = computed(
  () =>
    branches.value.find((branch) => branch.hasChildren.value && branch.isActive.value)?.key ?? null,
);

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
  linkComponent: computed(() => props.linkComponent),
  expanded: computed(() => props.expanded),
  hasExpandedBranches: computed(() => expandedKeys.value.length > 0),
  isBranchExpanded,
  registerBranch,
  onBranchToggle,
  onLinkClick,
});

watch(
  () => props.expanded,
  () => {
    // Collapsing hides the expanded tree, so drop that state
    if (!props.expanded) {
      expandedKeys.value = [];
    }

    startToggleWindow();
  },
);

// Rows report their active state once mounted, so wait for the render before opening a branch
watch([activeOwnerKey, hasActiveItem], () => {
  nextTick(() => openBranchOfActiveItem());
});

onMounted(() => {
  addScrollbarOffset();
});

onBeforeUnmount(() => {
  if (toggleTimeout) {
    clearTimeout(toggleTimeout);
  }
});

function registerBranch(registration: NavBranchRegistration) {
  branches.value = [...branches.value, registration];

  return () => {
    branches.value = branches.value.filter((branch) => branch !== registration);
    collapseBranch(registration.key);
  };
}

function onLinkClick(event: NavNavigateEvent) {
  emit("navigate", event);
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

function isBranchExpanded(key: string) {
  return expandedKeys.value.includes(key);
}

function expandBranch(key: string) {
  if (!isBranchExpanded(key)) {
    expandedKeys.value = [...expandedKeys.value, key];
  }
}

function collapseBranch(key: string) {
  expandedKeys.value = expandedKeys.value.filter((expanded) => expanded !== key);
}

// Only top-level rows report their toggle, nested rows keep their own open state
function onBranchToggle(key: string, open: boolean) {
  if (!props.expanded) {
    return;
  }

  if (!open) {
    collapseBranch(key);
    return;
  }

  collapseInactiveBranches(key);
  expandBranch(key);
}

function collapseInactiveBranches(exceptKey: string | null = null) {
  expandedKeys.value = expandedKeys.value.filter((key) => {
    if (key === exceptKey) {
      return true;
    }

    return branches.value.find((branch) => branch.key === key)?.isActive.value ?? false;
  });
}

function openBranchOfActiveItem() {
  // Only the expanded navigation shows a tree to open
  if (!props.expanded) {
    return;
  }

  // Pages the navigation does not list own no branch; leave the tree as the user left it
  if (!hasActiveItem.value) {
    return;
  }

  const ownerKey = activeOwnerKey.value;

  // The cached owner may have been collapsed manually
  if (ownerKey === activeBranchKey.value && (!ownerKey || isBranchExpanded(ownerKey))) {
    return;
  }

  // Branches only stay open while they hold the active item, or while nothing in the navigation does.
  collapseInactiveBranches(ownerKey);
  activeBranchKey.value = ownerKey;

  if (ownerKey) {
    expandBranch(ownerKey);
  }
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

    .mt-nav__link.is--active {
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
