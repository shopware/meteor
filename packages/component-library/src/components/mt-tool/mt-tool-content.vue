<template>
  <mt-collapsible-content class="mt-tool-content">
    <div class="mt-tool-content__inner">
      <slot />
    </div>
  </mt-collapsible-content>
</template>

<script setup lang="ts">
import MtCollapsibleContent from "@/components/mt-collapsible/mt-collapsible-content.vue";

/**
 * The details of `mt-tool`, shown while the card is open.
 *
 * @experimental This can be used, but the API may still change in a future release.
 */
defineSlots<{
  /** `mt-tool-input` and `mt-tool-output`. */
  default?(): unknown;
}>();
</script>

<style scoped>
.mt-tool-content__inner {
  display: grid;
  gap: var(--scale-size-12);
  padding: 0 var(--scale-size-12) var(--scale-size-12);
}
</style>
