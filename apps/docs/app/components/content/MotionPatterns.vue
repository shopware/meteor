<script setup lang="ts">
import { ref } from "vue";

const entered = ref(true);
const moved = ref(false);
const active = ref(false);
</script>

<template>
  <div class="motion">
    <div class="motion__row">
      <div class="motion__card">
        <div class="motion__stage">
          <div
            class="motion__tile"
            :class="{ 'motion__tile--hidden': !entered }"
          />
        </div>
        <button
          type="button"
          class="motion__control"
          @click="entered = !entered"
        >
          Toggle
        </button>
        <span class="motion__label"
          >Enter: 250ms decelerate. Exit: 150ms accelerate.</span
        >
      </div>

      <div class="motion__card">
        <div class="motion__stage">
          <div class="motion__track">
            <div
              class="motion__puck"
              :class="{ 'motion__puck--moved': moved }"
            />
          </div>
        </div>
        <button type="button" class="motion__control" @click="moved = !moved">
          Move
        </button>
        <span class="motion__label">Movement: 300ms standard.</span>
      </div>

      <div class="motion__card">
        <div class="motion__stage">
          <span
            class="motion__pill"
            :class="{ 'motion__pill--active': active }"
          >
            {{ active ? "Active" : "Draft" }}
          </span>
        </div>
        <button type="button" class="motion__control" @click="active = !active">
          Toggle
        </button>
        <span class="motion__label">Color: 150ms ease.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.motion {
  --motion-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
  --motion-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
  --motion-standard: cubic-bezier(0.4, 0, 0.2, 1);

  background: var(--color-elevation-surface-raised);
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary-default);
  padding: 24px;
  margin: 24px 0;
}

.motion__row {
  display: flex;
  row-gap: 24px;
  column-gap: 24px;
  flex-wrap: wrap;
}

.motion__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1 1 180px;
  max-width: 240px;
}

.motion__stage {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 88px;
  background: var(--color-elevation-surface-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: 8px;
}

.motion__tile {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--color-interaction-primary-default);
  opacity: 1;
  transition: opacity 250ms var(--motion-decelerate);
}

.motion__tile--hidden {
  opacity: 0;
  transition: opacity 150ms var(--motion-accelerate);
}

@media (prefers-reduced-motion: no-preference) {
  .motion__tile {
    scale: 1;
    transition:
      opacity 250ms var(--motion-decelerate),
      scale 250ms var(--motion-decelerate);
  }

  .motion__tile--hidden {
    scale: 0.9;
    transition:
      opacity 150ms var(--motion-accelerate),
      scale 150ms var(--motion-accelerate);
  }
}

.motion__track {
  width: 128px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid var(--color-border-secondary-default);
}

.motion__puck {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-interaction-primary-default);
  translate: 0 0;
  transition: translate 300ms var(--motion-standard);
}

.motion__puck--moved {
  translate: 94px 0;
}

@media (prefers-reduced-motion: reduce) {
  .motion__puck {
    transition: none;
  }
}

.motion__pill {
  padding: 4px 14px;
  border-radius: 999px;
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary-default);
  background: var(--color-interaction-secondary-default);
  border: 1px solid var(--color-border-primary-default);
  user-select: none;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease;
}

.motion__pill--active {
  color: var(--color-text-primary-inverse);
  background: var(--color-interaction-primary-default);
  border-color: var(--color-interaction-primary-default);
}

.motion__control {
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

.motion__control:hover {
  background: var(--color-interaction-secondary-hover);
}

.motion__label {
  font-size: 12px;
  color: var(--color-text-secondary-default);
  text-align: center;
}
</style>
