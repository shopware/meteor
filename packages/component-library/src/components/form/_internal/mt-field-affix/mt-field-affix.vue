<template>
  <div :class="['mt-field-affix', `mt-field-affix--${type}`]">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: "prefix" | "suffix";
}>();
</script>

<style scoped>
.mt-field-affix {
  display: grid;
  place-items: center;
  padding-inline: var(--scale-size-12);
  color: var(--color-text-primary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-2xs);
  line-height: var(--line-height-2xs);
  font-weight: var(--font-weight-medium);
  background: var(--color-interaction-secondary-dark);
  height: 100%;
}

.mt-field-affix--suffix {
  border-inline-start: 1px solid var(--color-border-primary-default);
  border-top-right-radius: var(--border-radius-xs);
  border-bottom-right-radius: var(--border-radius-xs);
}

.mt-field-affix--prefix {
  border-inline-end: 1px solid var(--color-border-primary-default);
  border-top-left-radius: var(--border-radius-xs);
  border-bottom-left-radius: var(--border-radius-xs);
}
</style>
