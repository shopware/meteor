<template>
  <div class="SearchResult">
    <div class="SearchResult_list">
      <IconDisplay
        v-for="icon in resultIcons"
        :icon="icon"
        :key="icon"
        @select="selectedIcon = icon"
      />
    </div>

    <div v-if="selectedIcon" class="SearchResult_sidebar">
      <IconSelection
        :icon="selectedIcon"
        @switch="switchSelectedIcon"
        :icons="icons"
      />
    </div>
  </div>
</template>

<script setup>
import IconDisplay from "./IconDisplay.vue";
import { ref, computed } from "vue";
import Fuse from "fuse.js";
import IconSelection from "./IconSelection.vue";

// context of the developer portal
import meta from "../public/icons/meta.json";

const icons = ref(meta);

const selectedIcon = ref(null);

const props = defineProps({
  phrase: String,
  mode: "solid" | "regular",
});

const resultIcons = computed(() => {
  const filteredIcons = icons.value.filter((i) => i.mode === props.mode);
  if (props.phrase.length <= 0) {
    return filteredIcons;
  }

  const fuse = new Fuse(filteredIcons, {
    keys: ["name"],
  });

  const searchResult = fuse.search(props.phrase);

  return searchResult.map((r) => r.item);
});

const switchSelectedIcon = (data) => {
  if (!data) {
    selectedIcon.value = null;
    return;
  }
  const { basename, size, mode } = data;
  selectedIcon.value = icons.value.find(
    (icon) =>
      icon.basename === basename && icon.size === size && icon.mode === mode
  );
};
</script>

<style lang="scss">
.SearchResult {
  @apply flex gap-12;
  flex-wrap: nowrap;

  &_list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
    flex-direction: row;
    justify-content: space-evenly;
    align-items: flex-start;
    gap: 24px;
    row-gap: 2rem;
    flex-wrap: wrap;
    flex-grow: 1;
  }

  &_sidebar {
    @media (min-width: 960.5px) {
      flex-basis: 24rem;
      flex-grow: 0;
      flex-shrink: 0;
      position: relative;
    }
  }
}
</style>
