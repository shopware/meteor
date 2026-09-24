<script setup lang="ts">
import { ref } from "vue";

const curves = [
  {
    key: "decelerate",
    label: "Decelerate",
    value: "cubic-bezier(0.05, 0.7, 0.1, 1)",
  },
  {
    key: "standard",
    label: "Standard",
    value: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  {
    key: "accelerate",
    label: "Accelerate",
    value: "cubic-bezier(0.3, 0, 0.8, 0.15)",
  },
  { key: "linear", label: "Linear", value: "linear", avoid: true },
];

const moved = ref(false);
</script>

<template>
  <div class="easings">
    <div class="easings__rows">
      <div v-for="curve in curves" :key="curve.key" class="easings__row">
        <span
          class="easings__name"
          :class="{ 'easings__name--avoid': curve.avoid }"
          >{{ curve.label }}</span
        >
        <div class="easings__track">
          <div
            class="easings__puck"
            :class="[
              `easings__puck--${curve.key}`,
              { 'easings__puck--moved': moved },
            ]"
          />
        </div>
        <code class="easings__value">{{ curve.value }}</code>
      </div>
    </div>
    <div class="easings__footer">
      <button type="button" class="easings__control" @click="moved = !moved">
        Play
      </button>
      <span class="easings__label"
        >Slowed to 600ms so the curve differences stay visible.</span
      >
    </div>
  </div>
</template>

<style scoped>
.easings {
  background: var(--color-elevation-surface-raised);
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary-default);
  padding: 24px;
  margin: 24px 0;
}

.easings__rows {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 16px;
}

.easings__row {
  display: flex;
  align-items: center;
  row-gap: 6px;
  column-gap: 16px;
  flex-wrap: wrap;
}

.easings__name {
  width: 84px;
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary-default);
}

.easings__name--avoid {
  color: var(--color-text-critical-default);
}

.easings__track {
  width: 200px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid var(--color-border-secondary-default);
}

.easings__puck {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-interaction-primary-default);
  translate: 0 0;
}

.easings__puck--linear {
  background: var(--color-interaction-critical-default);
}

.easings__puck--moved {
  translate: 166px 0;
}

@media (prefers-reduced-motion: no-preference) {
  .easings__puck--decelerate {
    transition: translate 600ms cubic-bezier(0.05, 0.7, 0.1, 1);
  }

  .easings__puck--standard {
    transition: translate 600ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .easings__puck--accelerate {
    transition: translate 600ms cubic-bezier(0.3, 0, 0.8, 0.15);
  }

  .easings__puck--linear {
    transition: translate 600ms linear;
  }
}

.easings__value {
  font-size: 11px;
  color: var(--color-text-secondary-default);
}

.easings__footer {
  display: flex;
  align-items: center;
  row-gap: 6px;
  column-gap: 16px;
  flex-wrap: wrap;
}

.easings__control {
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

.easings__control:hover {
  background: var(--color-interaction-secondary-hover);
}

.easings__label {
  font-size: 12px;
  color: var(--color-text-secondary-default);
}
</style>
