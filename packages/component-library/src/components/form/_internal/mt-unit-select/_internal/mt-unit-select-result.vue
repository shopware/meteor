<template>
  <li role="option" :aria-selected="false">
    <button
      class="mt-unit-select-result"
      @click="emit('click', unit)"
      type="button"
      :aria-label="`Select ${unitLabel.plural} (${unit})`"
      :data-testid="`unit-select-option-${unit}`"
    >
      <span class="mt-unit-select-result__label">{{ unitLabel.plural }}</span>

      <span class="mt-unit-select-result__unit">{{ unit }}</span>
    </button>
  </li>
</template>

<script setup lang="ts">
import type { Unit } from "convert-units";

defineProps<{
  unit: Unit;
  unitLabel: { plural: string; singular: string };
}>();

const emit = defineEmits<{
  (e: "click", value: Unit): void;
}>();
</script>

<style lang="css" scoped>
.mt-unit-select-result {
  min-width: var(--scale-size-160);
  padding: var(--scale-size-10) var(--scale-size-16);
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--scale-size-8);
  border-radius: var(--border-radius-xs);
  text-align: left;
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-disabled);
  cursor: pointer;
}

.mt-unit-select-result:focus-visible {
  outline: var(--scale-size-2) solid var(--color-border-brand-default);
  outline-offset: 2px;
}

.mt-unit-select-result__label {
  color: var(--color-text-primary-default);
}

.mt-unit-select-result__unit {
  color: var(--color-text-secondary-default);
}

.mt-unit-select-result:hover {
  background-color: var(--color-background-brand-default);
}

.mt-unit-select-result--active {
  border-radius: var(--border-radius-xs);
  background-color: var(--color-background-brand-default);
}

.mt-unit-select-result--selected span {
  color: var(--color-text-brand-default);
}
</style>
