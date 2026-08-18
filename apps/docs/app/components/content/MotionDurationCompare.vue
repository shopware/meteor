<script setup lang="ts">
import { ref } from "vue";

const speeds = [
  { key: "100", label: "100ms", note: "Micro feedback" },
  { key: "250", label: "250ms", note: "Standard transition" },
  { key: "600", label: "600ms", note: "Too slow for product UI", avoid: true },
];

const shown = ref(true);
</script>

<template>
  <div class="durations">
    <div class="durations__row">
      <div v-for="speed in speeds" :key="speed.key" class="durations__card">
        <div class="durations__stage">
          <div
            class="durations__tile"
            :class="[
              `durations__tile--${speed.key}`,
              { 'durations__tile--hidden': !shown },
            ]"
          />
        </div>
        <span class="durations__name">{{ speed.label }}</span>
        <span
          class="durations__label"
          :class="{ 'durations__label--avoid': speed.avoid }"
          >{{ speed.note }}</span
        >
      </div>
    </div>
    <button type="button" class="durations__control" @click="shown = !shown">
      Toggle
    </button>
  </div>
</template>

<style scoped>
.durations {
  --durations-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);

  background: var(--color-elevation-surface-raised);
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary-default);
  padding: 24px;
  margin: 24px 0;
}

.durations__row {
  display: flex;
  row-gap: 24px;
  column-gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.durations__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1 1 140px;
  max-width: 200px;
}

.durations__stage {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 88px;
  background: var(--color-elevation-surface-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: 8px;
}

.durations__tile {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--color-interaction-primary-default);
  opacity: 1;
  transition-property: opacity;
  transition-timing-function: var(--durations-decelerate);
}

.durations__tile--hidden {
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .durations__tile {
    scale: 1;
    transition-property: opacity, scale;
  }

  .durations__tile--hidden {
    scale: 0.9;
  }
}

.durations__tile--100 {
  transition-duration: 100ms;
}

.durations__tile--250 {
  transition-duration: 250ms;
}

.durations__tile--600 {
  transition-duration: 600ms;
}

.durations__name {
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary-default);
}

.durations__label {
  font-size: 12px;
  color: var(--color-text-secondary-default);
  text-align: center;
}

.durations__label--avoid {
  color: var(--color-text-critical-default);
}

.durations__control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: var(--border-radius-button);
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary-default);
  background: var(--color-interaction-secondary-default);
  border: 1px solid var(--color-border-primary-default);
  cursor: pointer;
  user-select: none;
}

.durations__control:hover {
  background: var(--color-interaction-secondary-hover);
}
</style>
