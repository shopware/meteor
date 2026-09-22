<template>
  <nav class="mt-nav" :aria-labelledby="navigationLabelId">
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
  onMounted,
  provide,
  ref,
  shallowRef,
  useId,
  watch,
  type PropType,
} from "vue";
import { useI18n } from "vue-i18n";
import {
  NAV_CONTEXT,
  type NavBranchRegistration,
  type NavLinkComponent,
  type NavNavigateEvent,
} from "./_internal/mt-nav-context";

export type { NavLinkComponent, NavLinkTarget, NavNavigateEvent } from "./_internal/mt-nav-context";

const props = defineProps({
  /**
   * Component rendering the navigation links. Receives the target of an item as `to`.
   */
  linkComponent: {
    type: [String, Object] as PropType<NavLinkComponent>,
    default: "router-link",
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
const expandedKeys = ref<string[]>([]);
const activeBranchKey = ref<string | null>(null);

// The top-level rows of every mounted section, in mount order
const branches = shallowRef<NavBranchRegistration[]>([]);

const hasActiveItem = computed(() => branches.value.some((branch) => branch.isActive.value));

// The top-level branch holding the active item, if the active item sits inside a branch
const activeOwnerKey = computed(
  () =>
    branches.value.find((branch) => branch.hasChildren.value && branch.isActive.value)?.key ?? null,
);

const scrollbarOffsetStyle = computed(() => ({
  right: scrollbarOffset.value,
  "margin-left": scrollbarOffset.value,
}));

provide(NAV_CONTEXT, {
  linkComponent: computed(() => props.linkComponent),
  hasExpandedBranches: computed(() => expandedKeys.value.length > 0),
  isBranchExpanded,
  registerBranch,
  onBranchToggle,
  onLinkClick,
});

// Rows report their active state once mounted, so wait for the render before opening a branch
watch([activeOwnerKey, hasActiveItem], () => {
  nextTick(() => openBranchOfActiveItem());
});

onMounted(() => {
  addScrollbarOffset();
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
  // Body vertical padding, doubling as the control points of its edge fade mask
  --mt-nav-body-fade: var(--scale-size-20);

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

  .mt-nav__link-text {
    display: inline-block;
    white-space: nowrap;
    width: 100%;
    position: relative;
    pointer-events: none;
  }

  .mt-nav__link.is--active {
    background: var(--color-background-brand-default);

    .mt-nav__link-text {
      color: var(--color-icon-brand-default);
    }
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

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
