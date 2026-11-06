<template>
  <nav
    class="mt-nav"
    :class="{ 'mt-nav--horizontal': orientation === 'horizontal' }"
    :aria-labelledby="navigationLabelId"
  >
    <h2 :id="navigationLabelId" class="visually-hidden">
      {{ label ?? t("navigationLabel") }}
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
/**
 * Experimental: the API of mt-nav may still change in a future release.
 */

import { computed, provide, ref, useId, watch } from "vue";
import { useI18n } from "vue-i18n";
import MtNavSection from "./_internal/mt-nav-section.vue";
import {
  NAV_CONTEXT,
  branchKey,
  hasNestedItems,
  isItemActive,
  isRowActive,
  itemKey,
  type NavActiveMatcher,
  type NavItem,
  type NavLinkComponent,
  type NavOrientation,
  type NavSection,
  type NavSlots,
} from "./_internal/mt-nav-context";
import { moveLinkFocus } from "./_internal/mt-nav-focus";

export type {
  NavActiveMatcher,
  NavItem,
  NavLinkComponent,
  NavLinkTarget,
  NavOrientation,
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
    /**
     * Accessible name of the navigation. Defaults to the translated "Main". Pass another name when
     * the page has more than one `mt-nav`, for example "Settings".
     */
    label?: string;
    /**
     * Tells whether a row is the current page, e.g. by comparing its route with the current route.
     * Lets the sections stay static instead of setting `active` on every route change.
     */
    isActive?: NavActiveMatcher;
    /**
     * Direction the top-level rows run in. Horizontal rows show their nested rows in a floating
     * panel that opens on hover, or on click with the keyboard or touch.
     */
    orientation?: NavOrientation;
  }>(),
  {
    linkComponent: "router-link",
    label: undefined,
    isActive: undefined,
    orientation: "vertical",
  },
);

const emit = defineEmits<{
  /**
   * Emitted when a row with a `to` or `href` is clicked. Rows that only toggle nested rows do not emit it.
   */
  (e: "navigate", item: NavItem): void;
}>();

const slots = defineSlots<NavSlots>();

const { t } = useI18n({
  messages: {
    en: {
      navigationLabel: "Main",
    },
    de: {
      navigationLabel: "Hauptmenü",
    },
  },
});

const navigationLabelId = `mt-nav-label-${useId()}`;

const navBodyElement = ref<HTMLElement | null>(null);

// Keys of the open top-level rows. Nested rows keep their own open state.
const expandedKeys = ref<string[]>([]);

// Key of the top-level row whose floating panel is open, in a horizontal navigation
const openFlyoutKey = ref<string | null>(null);

// Set when the open panel took over from another open panel instead of opening from closed
const flyoutSwitched = ref(false);

// The top-level rows of every section, with the keys their open state is kept under
const branches = computed(() =>
  props.sections.flatMap((section, sectionIndex) =>
    section.items.map((item) => ({ key: branchKey(sectionIndex, item), item })),
  ),
);

function isActiveItem(item: NavItem) {
  // Tells whether the row or one of its descendants is active, through its flag or `isActive`
  return isItemActive(item, props.isActive);
}

const hasActiveItem = computed(() => branches.value.some((branch) => isActiveItem(branch.item)));

// The top-level branch holding the active item, if the active item sits inside a branch
const activeOwnerKey = computed(
  () =>
    branches.value.find((branch) => hasNestedItems(branch.item) && isActiveItem(branch.item))
      ?.key ?? null,
);

// Changes whenever the active row moves, also within the branch already holding it
const activeRowSignature = computed(() =>
  branches.value
    .filter((branch) => isActiveItem(branch.item))
    .map((branch) => {
      const activeChild = branch.item.children?.find(isActiveItem);

      return `${branch.key}/${activeChild ? itemKey(activeChild) : ""}`;
    })
    .join(","),
);

provide(NAV_CONTEXT, {
  linkComponent: computed(() => props.linkComponent),
  orientation: computed(() => props.orientation),
  isRowActive: (item) => isRowActive(item, props.isActive),
  isItemActive: isActiveItem,
  slots,
  isBranchExpanded,
  onBranchToggle,
  isFlyoutOpen: (key) => openFlyoutKey.value === key,
  onFlyoutToggle,
  flyoutSwitched: computed(() => flyoutSwitched.value),
  onNavigate: (item) => {
    // Choosing a page closes the open floating panel
    openFlyoutKey.value = null;
    emit("navigate", item);
  },
});

watch(activeRowSignature, openBranchOfActiveItem, { immediate: true });

watch(
  () => props.orientation,
  () => {
    openFlyoutKey.value = null;
  },
);

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

function onFlyoutToggle(key: string, open: boolean) {
  // Opens the panel with this key in place of any other, or closes it if it is still the open one.
  // A late close of the previous panel, e.g. from its hover timer, leaves the new one open.
  if (open) {
    flyoutSwitched.value = openFlyoutKey.value !== null && openFlyoutKey.value !== key;
    openFlyoutKey.value = key;
  } else if (openFlyoutKey.value === key) {
    openFlyoutKey.value = null;
  }
}

function collapseInactiveBranches(exceptKey: string | null) {
  // Closes every open row that neither holds the active item nor matches the given key
  expandedKeys.value = expandedKeys.value.filter((key) => {
    if (key === exceptKey) {
      return true;
    }

    const branch = branches.value.find((candidate) => candidate.key === key);

    return branch ? isActiveItem(branch.item) : false;
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
  // Moves focus between the visible links with the arrow keys of the orientation, Home and End
  if (!navBodyElement.value) {
    return;
  }

  moveLinkFocus(
    navBodyElement.value,
    event,
    props.orientation === "horizontal"
      ? { next: "ArrowRight", previous: "ArrowLeft" }
      : { next: "ArrowDown", previous: "ArrowUp" },
  );
}
</script>

<style>
.mt-nav {
  white-space: nowrap;
}

.mt-nav__body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-16);
  padding: var(--scale-size-20) 0;
}

.mt-nav--horizontal .mt-nav__body {
  flex-direction: row;
  align-items: center;
  padding: 0;
}
</style>
