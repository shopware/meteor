<template>
  <div class="mt-stack" :style="{ gap }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  size: string;
}>();

const gap = computed(() => {
  if (props.size.startsWith("scale-size-")) {
    return `var(--${props.size})`;
  }

  return props.size;
});
</script>

<style scoped>
.mt-stack {
  display: flex;
  flex-direction: column;
}
</style>
