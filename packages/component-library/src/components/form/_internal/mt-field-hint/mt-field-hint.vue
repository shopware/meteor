<template>
  <span class="mt-field-hint">
    <mt-icon
      class="mt-field-hint__icon"
      name="solid-info-circle"
      size="var(--scale-size-12)"
      color="var(--color-icon-secondary-default)"
      decorative
    />
    <span class="mt-field-hint__text">
      <slot />
    </span>
  </span>
</template>

<script setup lang="ts">
import MtIcon from "@/components/icons-media/mt-icon/mt-icon.vue";
</script>

<style scoped>
.mt-field-hint {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--scale-size-4);
  padding: var(--scale-size-3);
  min-width: 0;
}

.mt-field-hint__icon {
  flex-shrink: 0;
}

.mt-field-hint__text {
  color: var(--color-text-secondary-default);
  font-family: var(--font-family-body);
  font-size: var(--font-size-xs, 14px);
  font-weight: var(--font-weight-regular);
  line-height: var(--font-line-height-xs);
}
</style>
