<script setup lang="ts">
/** Framed like the content panel; inside a drawer the frame is dropped. */
defineProps<{
  framed?: boolean;
}>();
</script>

<template>
  <div class="sidebar" :class="{ 'sidebar--framed': framed }" />
</template>

<style scoped>
.sidebar {
  width: 20rem;
  padding: var(--scale-size-16);
}

.sidebar--framed {
  height: 100%;
  overflow: auto;
  background-color: var(--color-elevation-surface-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: var(--border-radius-m);
}
</style>
