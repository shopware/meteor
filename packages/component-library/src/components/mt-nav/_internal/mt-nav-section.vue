<template>
  <div class="mt-nav__section">
    <mt-text
      v-if="section.header"
      :id="headerId"
      as="h3"
      class="mt-nav__section-header"
      size="2xs"
      weight="semibold"
      color="color-text-secondary-default"
      :title="section.header"
    >
      {{ section.header }}
    </mt-text>

    <ul class="mt-nav__list" :aria-labelledby="section.header ? headerId : undefined">
      <mt-nav-item
        v-for="item in section.items"
        :key="item.label"
        :item="item"
        :depth="1"
        :branch-key="branchKey(sectionIndex, item)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useId } from "vue";
import MtText from "@/components/mt-text/mt-text.vue";
import MtNavItem from "./mt-nav-item.vue";
import { branchKey, type NavSection } from "./mt-nav-context";

defineProps<{
  section: NavSection;
  /** Position of the section in the navigation, part of the keys of its top-level rows. */
  sectionIndex: number;
}>();

const headerId = `mt-nav-section-header-${useId()}`;
</script>

<style>
.mt-nav__section {
  display: flex;
  flex-direction: column;
}

/* Typography comes from mt-text */
.mt-nav__section-header {
  height: var(--scale-size-24);
  margin: 0 0 var(--scale-size-4);
  padding: 0 var(--scale-size-10);
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mt-nav__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
