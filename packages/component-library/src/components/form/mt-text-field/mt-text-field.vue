<template>
  <div>
    <mt-field-label :label="label" id="some-id" style="margin-block-end: 1px" />

    <div class="mt-text-field__input">
      <input type="text" id="some-id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import MtFieldLabel from "../_internal/mt-field-label/mt-field-label.vue";

defineProps<{
  label: string;
}>();
</script>

<style scoped>
.mt-text-field__input {
  border: 1px solid var(--color-border-primary-default);
  border-radius: var(--border-radius-xs);
  background: var(--color-elevation-surface-raised);
  height: 3rem;
  width: 100%;

  &:focus-within {
    border-color: var(--color-border-brand-selected);
    box-shadow: 0 0 4px 0 rgba(24, 158, 255, 0.3);
  }
}

.mt-text-field__input input {
  font-family: var(--font-family-body);
  border: none;
  background: none;
  height: 100%;
  width: 100%;
  padding-inline: 1rem;
  color: var(--color-text-primary-default);
  font-size: var(--font-size-xs);
  outline: none;
  line-height: 1;
}
</style>
