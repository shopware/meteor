<script setup lang="ts">
import { MtSkeletonBar } from "@shopware-ag/meteor-component-library";

withDefaults(
  defineProps<{
    /** The number of lines. */
    lines?: number;
  }>(),
  { lines: 3 },
);

// Lines of different lengths read as text.
const widths = ["100%", "85%", "60%", "92%", "70%"];
</script>

<template>
  <div class="app-skeleton" aria-hidden="true">
    <mt-skeleton-bar
      v-for="line in lines"
      :key="line"
      class="app-skeleton__bar"
      :style="{ width: widths[(line - 1) % widths.length] }"
    />
  </div>
</template>

<style scoped>
.app-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-12);
}

/* Text-sized lines instead of the bar's default height and spacing. */
.app-skeleton .app-skeleton__bar {
  height: var(--scale-size-16);
  margin: 0;
}
</style>
