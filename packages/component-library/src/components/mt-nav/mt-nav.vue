<template>
  <nav class="mt-nav" :aria-labelledby="navigationLabelId">
    <h2 :id="navigationLabelId" class="visually-hidden">
      {{ t("navigationLabel") }}
    </h2>

    <div ref="navBodyElement" class="mt-nav__body" @keydown="onNavigationKeydown">
      <slot />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, provide, ref, shallowRef, useId, watch } from "vue";
import { useI18n } from "vue-i18n";
import {
  NAV_CONTEXT,
  type NavBranchRegistration,
  type NavLinkComponent,
  type NavNavigateEvent,
} from "./_internal/mt-nav-context";

export type { NavLinkComponent, NavLinkTarget, NavNavigateEvent } from "./_internal/mt-nav-context";

const props = withDefaults(
  defineProps<{
    /**
     * Component rendering the navigation links. Receives the target of an item as `to`.
     */
    linkComponent?: NavLinkComponent;
  }>(),
  {
    linkComponent: "router-link",
  },
);

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

const expandedKeys = ref<string[]>([]);

const branches = shallowRef<NavBranchRegistration[]>([]);

const hasActiveItem = computed(() => branches.value.some((branch) => branch.isActive.value));

const activeOwnerKey = computed(
  () =>
    branches.value.find((branch) => branch.hasChildren.value && branch.isActive.value)?.key ?? null,
);

const activeRowSignature = computed(() =>
  branches.value
    .filter((branch) => branch.isActive.value)
    .map((branch) => `${branch.key}/${branch.activeChildKey.value ?? ""}`)
    .join(","),
);

provide(NAV_CONTEXT, {
  linkComponent: computed(() => props.linkComponent),
  isBranchExpanded,
  registerBranch,
  onBranchToggle,
  onLinkClick: (event) => emit("navigate", event),
});

watch(activeRowSignature, openBranchOfActiveItem, { flush: "post" });

function registerBranch(registration: NavBranchRegistration) {
  // Adds a top-level row to the list and returns the function that removes it again
  branches.value = [...branches.value, registration];

  return () => {
    branches.value = branches.value.filter((branch) => branch !== registration);
    collapseBranch(registration.key);
  };
}

function isBranchExpanded(key: string) {
  // Tells whether the top-level row with this key is open
  return expandedKeys.value.includes(key);
}

function expandBranch(key: string) {
  // Opens the top-level row with this key
  if (!isBranchExpanded(key)) {
    expandedKeys.value = [...expandedKeys.value, key];
  }
}

function collapseBranch(key: string) {
  // Closes the top-level row with this key
  expandedKeys.value = expandedKeys.value.filter((expanded) => expanded !== key);
}

function onBranchToggle(key: string, open: boolean) {
  // Applies a user toggle: opening a row closes the others, except the one holding the active item
  if (!open) {
    collapseBranch(key);
    return;
  }

  collapseInactiveBranches(key);
  expandBranch(key);
}

function collapseInactiveBranches(exceptKey: string | null) {
  // Closes every open row that neither holds the active item nor matches the given key
  expandedKeys.value = expandedKeys.value.filter((key) => {
    if (key === exceptKey) {
      return true;
    }

    return branches.value.find((branch) => branch.key === key)?.isActive.value ?? false;
  });
}

function openBranchOfActiveItem() {
  // Opens the row holding the active item and closes the others; leaves the tree alone if nothing is active
  if (!hasActiveItem.value) {
    return;
  }

  const ownerKey = activeOwnerKey.value;

  // Branches only stay open while they hold the active item
  collapseInactiveBranches(ownerKey);

  if (ownerKey) {
    expandBranch(ownerKey);
  }
}

function onNavigationKeydown(event: KeyboardEvent) {
  // Moves focus between the visible links with the arrow, Home and End keys
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

<style>
.mt-nav {
  height: 100%;
  min-height: 0;
  overflow: hidden;
  white-space: nowrap;

  mask-image: linear-gradient(
    to bottom,
    transparent var(--scale-size-4),
    #000 var(--scale-size-20),
    #000 calc(100% - var(--scale-size-20)),
    transparent calc(100% - var(--scale-size-4))
  );
}

.mt-nav .mt-nav__link.is--active {
  background: var(--color-background-brand-default);
}

.mt-nav .mt-nav__link.is--active .mt-nav__link-label,
.mt-nav .mt-nav__link.is--active .mt-nav__link-expand-icon {
  color: var(--color-icon-brand-default);
}

.mt-nav__body {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
  padding: var(--scale-size-20) 0;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.mt-nav__body::-webkit-scrollbar {
  display: none;
}
</style>
