<template>
  <nav class="mt-nav" :aria-labelledby="navigationLabelId">
    <h2 :id="navigationLabelId" class="visually-hidden">
      {{ t("navigationLabel") }}
    </h2>

    <div ref="navBodyElement" class="mt-nav__body" @keydown="onNavigationKeydown">
      <mt-nav-section
        v-for="(section, index) in sections"
        :key="index"
        :section="section"
        :section-index="index"
      />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, provide, ref, useId, watch } from "vue";
import { useI18n } from "vue-i18n";
import MtNavSection from "./_internal/mt-nav-section.vue";
import {
  NAV_CONTEXT,
  branchKey,
  hasNestedItems,
  isItemActive,
  type NavItem,
  type NavLinkComponent,
  type NavSection,
  type NavSlots,
} from "./_internal/mt-nav-context";

export type {
  NavItem,
  NavLinkComponent,
  NavLinkTarget,
  NavSection,
} from "./_internal/mt-nav-context";

const props = withDefaults(
  defineProps<{
    /**
     * The sections of the navigation, each holding its rows. Rows nest through `children`.
     */
    sections: NavSection[];
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
  /** A row with a `to` or `href` was clicked. */
  (e: "navigate", item: NavItem): void;
}>();

const slots = defineSlots<NavSlots>();

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

// Keys of the open top-level rows. Nested rows keep their own open state.
const expandedKeys = ref<string[]>([]);

// The top-level rows of every section, with the keys their open state is kept under
const branches = computed(() =>
  props.sections.flatMap((section, sectionIndex) =>
    section.items.map((item) => ({ key: branchKey(sectionIndex, item), item })),
  ),
);

const hasActiveItem = computed(() => branches.value.some((branch) => isItemActive(branch.item)));

// The top-level branch holding the active item, if the active item sits inside a branch
const activeOwnerKey = computed(
  () =>
    branches.value.find((branch) => hasNestedItems(branch.item) && isItemActive(branch.item))
      ?.key ?? null,
);

// Changes whenever the active row moves, also within the branch already holding it
const activeRowSignature = computed(() =>
  branches.value
    .filter((branch) => isItemActive(branch.item))
    .map((branch) => `${branch.key}/${branch.item.children?.find(isItemActive)?.label ?? ""}`)
    .join(","),
);

provide(NAV_CONTEXT, {
  linkComponent: computed(() => props.linkComponent),
  slots,
  isBranchExpanded,
  onBranchToggle,
  onNavigate: (item) => emit("navigate", item),
});

watch(activeRowSignature, openBranchOfActiveItem, { immediate: true });

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

    const branch = branches.value.find((candidate) => candidate.key === key);

    return branch ? isItemActive(branch.item) : false;
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
  // Moves focus between the visible links with the arrow, Home and End keys, without wrapping
  const body = navBodyElement.value;
  const target = event.target;

  // Keys pressed inside slotted content, e.g. a button in a suffix, keep their meaning
  if (!body || !(target instanceof HTMLElement) || !target.matches(".mt-nav__link")) {
    return;
  }

  const links = Array.from(body.querySelectorAll<HTMLElement>(".mt-nav__link")).filter(
    (link) => !link.closest("[hidden]"),
  );

  const currentIndex = links.indexOf(target);
  let nextIndex: number;

  switch (event.key) {
    case "ArrowDown":
      nextIndex = Math.min(currentIndex + 1, links.length - 1);
      break;
    case "ArrowUp":
      nextIndex = Math.max(currentIndex - 1, 0);
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
