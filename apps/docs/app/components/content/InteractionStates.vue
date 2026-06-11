<template>
  <div class="interaction-states">
    <div class="interaction-states__list">
      <div
        v-for="state in states"
        :key="state"
        class="interaction-states__card"
      >
        <button
          tabindex="-1"
          type="button"
          class="interaction-states__button"
          :class="`interaction-states__button--${state}`"
          :disabled="state === 'disabled'"
        >
          Add product
        </button>
        <span class="interaction-states__label">
          {{ state.charAt(0).toUpperCase() + state.slice(1) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const states = ["resting", "hover", "focus", "pressed", "disabled"];
</script>

<style scoped>
.interaction-states {
  background: var(--color-elevation-surface-raised);
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary-default);
  padding: 24px;
  margin: 24px 0;
}

.interaction-states__list {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.interaction-states__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.interaction-states__label {
  font-size: 12px;
  color: var(--color-text-secondary-default);
}

.interaction-states__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 15px;
  border-radius: var(--border-radius-button);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  border: 1px solid transparent;
  color: #fff;
  user-select: none;
}

.interaction-states__button--resting {
  background: var(--color-interaction-primary-default);
  border-color: var(--color-interaction-primary-default);
}

.interaction-states__button--hover {
  background: var(--color-interaction-primary-hover);
  border-color: var(--color-interaction-primary-hover);
}

.interaction-states__button--focus {
  background: var(--color-interaction-primary-default);
  border-color: var(--color-interaction-primary-default);
  outline: 2px solid var(--color-border-brand-default);
  outline-offset: 2px;
}

.interaction-states__button--pressed {
  background: var(--color-interaction-primary-pressed);
  border-color: var(--color-interaction-primary-pressed);
}

.interaction-states__button--disabled {
  background: var(--color-interaction-primary-disabled);
  border-color: var(--color-interaction-primary-disabled);
  color: rgba(255, 255, 255, 0.55);
  cursor: not-allowed;
}
</style>
