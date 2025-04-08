<template>
  <li role="option" :aria-selected="false">
    <button
      class="mt-unit-select-result"
      @click="emit('click', unit)"
      type="button"
      :aria-label="`Select ${unitLabel.plural} (${unit})`"
      :data-testid="`unit-select-option-${unit}`"
    >
      <span>{{ unitLabel.plural }}</span>
      {{ unit }}
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
  min-width: 170px;
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

.mt-unit-select-result span {
  color: var(--color-slate-700);
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
