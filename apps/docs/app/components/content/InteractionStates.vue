<script setup lang="ts">
const states = [
  { key: "resting", label: "Resting" },
  { key: "hover", label: "Hover" },
  { key: "focus", label: "Focus" },
  { key: "pressed", label: "Pressed" },
  { key: "disabled", label: "Disabled" },
] as const;
</script>

<template>
  <div class="states">
    <div class="states__row">
      <div v-for="state in states" :key="state.key" class="states__card">
        <button
          type="button"
          tabindex="-1"
          class="states__button"
          :class="`states__button--${state.key}`"
          :disabled="state.key === 'disabled'"
        >
          Add product
        </button>
        <span class="states__label">{{ state.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.states {
  background: var(--color-elevation-surface-raised);
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary-default);
  padding: 24px;
  margin: 24px 0;
}

.states__row {
  display: flex;
  row-gap: 16px;
  column-gap: 24px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.states__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.states__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 15px;
  border-radius: var(--border-radius-button);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-semibold);
  color: #fff;
  border: 1px solid transparent;
  background: var(--color-interaction-primary-default);
  border-color: var(--color-interaction-primary-default);
  cursor: pointer;
  user-select: none;
}

.states__button--hover {
  background: var(--color-interaction-primary-hover);
  border-color: var(--color-interaction-primary-hover);
}

.states__button--focus {
  outline: 2px solid var(--color-border-brand-default);
  outline-offset: 2px;
}

.states__button--pressed {
  background: var(--color-interaction-primary-pressed);
  border-color: var(--color-interaction-primary-pressed);
}

.states__button--disabled {
  background: var(--color-interaction-primary-disabled);
  border-color: var(--color-interaction-primary-disabled);
  color: rgba(255, 255, 255, 0.55);
  cursor: not-allowed;
}

.states__label {
  font-size: 12px;
  color: var(--color-text-secondary-default);
}
</style>
