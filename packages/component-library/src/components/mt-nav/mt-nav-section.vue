<template>
  <div class="mt-nav__section">
    <mt-text
      v-if="header"
      :id="headerId"
      as="h3"
      class="mt-nav__section-header"
      size="2xs"
      weight="semibold"
      color="color-text-secondary-default"
      :title="header"
    >
      {{ header }}
    </mt-text>

    <ul class="mt-nav__list" :aria-labelledby="header ? headerId : undefined">
      <slot />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { inject, useId } from "vue";
import MtText from "@/components/mt-text/mt-text.vue";
import { NAV_CONTEXT } from "./_internal/mt-nav-context";

defineProps<{
  /**
   * Heading above the items of the section.
   */
  header?: string;
}>();

defineSlots<{
  /** The `mt-nav-item` rows of the section. */
  default?: () => unknown;
}>();

if (!inject(NAV_CONTEXT)) {
  throw new Error("mt-nav-section must be rendered inside mt-nav");
}

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
