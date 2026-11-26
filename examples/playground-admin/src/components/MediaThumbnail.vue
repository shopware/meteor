<script setup lang="ts">
import { MtIcon } from "@shopware-ag/meteor-component-library";

/** The empty image preview of the Administration, for entities without a cover image. */
withDefaults(defineProps<{ size?: string }>(), { size: "1.875rem" });
</script>

<template>
  <span class="media-thumbnail" :style="{ '--media-thumbnail-size': size }">
    <mt-icon name="regular-image" size="45%" decorative />
  </span>
</template>

<style scoped>
.media-thumbnail {
  display: inline-grid;
  flex: none;
  place-items: center;
  width: var(--media-thumbnail-size);
  height: var(--media-thumbnail-size);
  color: var(--color-icon-secondary-default);
  background-color: var(--color-background-secondary-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-xs);
}
</style>
