<template>
  <div class="mt-segmented-control">
    <button v-for="action in actions" :key="action.id" @click="action.onClick">
      {{ action.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
type Action = {
  id: string;
  label: string;
  onClick: () => void;
};

defineProps<{
  actions: Action[];
}>();
</script>

<style scoped>
.mt-segmented-control {
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-button);
  height: 2rem;
  width: max-content;
}
</style>
