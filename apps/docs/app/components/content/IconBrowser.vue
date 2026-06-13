<script setup lang="ts">
import MtIcon from "@shopware-ag/meteor-component-library/MtIcon";
import MtSearch from "@shopware-ag/meteor-component-library/MtSearch";
import MtTabs from "@shopware-ag/meteor-component-library/MtTabs";
import MtPagination from "@shopware-ag/meteor-component-library/MtPagination";
import MtEmptyState from "@shopware-ag/meteor-component-library/MtEmptyState";
import MtSnackbar from "@shopware-ag/meteor-component-library/MtSnackbar";
import { useSnackbar } from "@shopware-ag/meteor-component-library";
import iconMeta from "@icon-kit/icons/meta.json";

interface IconMetaEntry {
  name: string;
  mode: "regular" | "solid";
  tags?: string[];
}

// meta.json has one entry per icon SVG (mode + name + tags).
const allIcons = (iconMeta as IconMetaEntry[])
  .map((icon) => ({
    fullName: `${icon.mode}-${icon.name}`,
    mode: icon.mode,
    name: icon.name,
    tags: icon.tags ?? [],
  }))
  .sort((a, b) => a.fullName.localeCompare(b.fullName));

const { addSnackbar } = useSnackbar();
const itemsPerPage = 48;
const searchTerm = ref("");
const activeMode = ref("all");
const currentPage = ref(1);
const hoveredIconName = ref<string | null>(null);
const focusVisibleIconName = ref<string | null>(null);
const lastInteractionWasKeyboard = ref(false);

const searchMatchedIcons = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  return allIcons.filter((icon) => {
    if (!term) return true;
    return (
      icon.name.toLowerCase().includes(term) ||
      icon.fullName.toLowerCase().includes(term) ||
      icon.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  });
});

const modeTabs = computed(() => {
  const regularCount = searchMatchedIcons.value.filter((i) => i.mode === "regular").length;
  const solidCount = searchMatchedIcons.value.filter((i) => i.mode === "solid").length;
  return [
    { label: "All", name: "all" },
    { label: `Regular (${regularCount})`, name: "regular" },
    { label: `Solid (${solidCount})`, name: "solid" },
  ];
});

const filteredIcons = computed(() =>
  searchMatchedIcons.value.filter(
    (icon) => activeMode.value === "all" || icon.mode === activeMode.value,
  ),
);

watch([searchTerm, activeMode], () => {
  currentPage.value = 1;
});

const visibleIcons = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredIcons.value.slice(start, start + itemsPerPage);
});

function handleKeyboard() {
  lastInteractionWasKeyboard.value = true;
}
function handlePointer() {
  lastInteractionWasKeyboard.value = false;
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyboard, true);
  window.addEventListener("mousedown", handlePointer, true);
  window.addEventListener("pointerdown", handlePointer, true);
  window.addEventListener("touchstart", handlePointer, true);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyboard, true);
  window.removeEventListener("mousedown", handlePointer, true);
  window.removeEventListener("pointerdown", handlePointer, true);
  window.removeEventListener("touchstart", handlePointer, true);
});

function isHighlighted(fullName: string) {
  return hoveredIconName.value === fullName || focusVisibleIconName.value === fullName;
}

function setHoveredIcon(fullName: string | null) {
  hoveredIconName.value = fullName;
}
function setFocusedIcon(fullName: string) {
  focusVisibleIconName.value = lastInteractionWasKeyboard.value ? fullName : null;
}
function clearFocusedIcon() {
  focusVisibleIconName.value = null;
}

async function copyIconName(fullName: string) {
  if (!navigator.clipboard?.writeText) return;
  try {
    await navigator.clipboard.writeText(fullName);
    addSnackbar({ message: `Copied ${fullName} to clipboard`, variant: "success" });
  } catch {
    addSnackbar({ message: `Couldn't copy ${fullName}`, variant: "error" });
  }
}
</script>

<template>
  <div class="icon-browser">
    <MtSearch v-model="searchTerm" placeholder="Search icons by name..." />

    <div class="icon-browser__tabs">
      <MtTabs
        :items="modeTabs"
        :default-item="activeMode"
        @new-item-active="activeMode = $event"
      />
    </div>

    <div v-if="filteredIcons.length" class="icon-browser__grid">
      <div
        v-for="icon in visibleIcons"
        :key="icon.fullName"
        role="button"
        tabindex="0"
        class="icon-card"
        :class="{
          'icon-card--active': isHighlighted(icon.fullName),
          'icon-card--focus': focusVisibleIconName === icon.fullName,
        }"
        :aria-label="`Copy ${icon.fullName} icon name`"
        :title="`Copy ${icon.fullName}`"
        @mouseenter="setHoveredIcon(icon.fullName)"
        @mouseleave="setHoveredIcon(null)"
        @focus="setFocusedIcon(icon.fullName)"
        @blur="clearFocusedIcon()"
        @click="copyIconName(icon.fullName)"
        @keydown.enter.prevent="copyIconName(icon.fullName)"
        @keydown.space.prevent="copyIconName(icon.fullName)"
      >
        <MtIcon
          :name="icon.name"
          :mode="icon.mode"
          size="var(--scale-size-24)"
          color="var(--color-icon-primary-default)"
          decorative
        />
        <span class="icon-card__name">{{ icon.fullName }}</span>
      </div>
    </div>

    <div v-else class="icon-browser__empty">
      <MtEmptyState
        icon="regular-search"
        headline="No icons found"
        description="Try a different search term or switch the icon mode."
        centered
      />
    </div>

    <div v-if="filteredIcons.length > itemsPerPage" class="icon-browser__pagination">
      <MtPagination
        :current-page="currentPage"
        :limit="itemsPerPage"
        :total-items="filteredIcons.length"
        @change-current-page="currentPage = $event"
      />
    </div>

    <MtSnackbar />
  </div>
</template>

<style scoped>
.icon-browser {
  display: grid;
  gap: 16px;
}

.icon-browser__tabs {
  width: 100%;
  margin-bottom: 8px;
}

.icon-browser__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.icon-card {
  display: grid;
  gap: 12px;
  align-items: start;
  justify-items: center;
  text-align: center;
  padding: 16px;
  border-radius: var(--border-radius-m);
  border: 1px solid var(--color-border-secondary-default);
  cursor: pointer;
  transition: background-color 120ms ease-out;
  background-color: var(--color-interaction-secondary-default);
}

.icon-card--active {
  background-color: var(--color-interaction-secondary-hover);
}

.icon-card--focus {
  outline: 2px solid var(--color-border-brand-default);
  outline-offset: 2px;
}

.icon-card__name {
  color: var(--color-text-secondary-default);
  font-size: var(--font-size-2xs);
  line-height: var(--font-line-height-2xs);
  font-weight: var(--font-weight-medium);
  word-break: break-word;
}

.icon-browser__empty {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.icon-browser__pagination {
  display: flex;
  justify-content: end;
}
</style>
