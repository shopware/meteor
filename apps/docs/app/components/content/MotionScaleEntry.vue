<script setup lang="ts">
import { ref } from "vue";

const shown = ref(true);
</script>

<template>
  <div class="entry">
    <div class="entry__row">
      <div class="entry__card">
        <div class="entry__stage">
          <div
            class="entry__tile entry__tile--do"
            :class="{ 'entry__tile--hidden': !shown }"
          />
        </div>
        <span class="entry__label"
          ><strong>Do:</strong> fade with scale from 0.9.</span
        >
      </div>

      <div class="entry__card">
        <div class="entry__stage">
          <div
            class="entry__tile entry__tile--dont"
            :class="{ 'entry__tile--hidden': !shown }"
          />
        </div>
        <span class="entry__label"
          ><strong>Don't:</strong> grow from scale(0).</span
        >
      </div>
    </div>
    <button type="button" class="entry__control" @click="shown = !shown">
      Toggle
    </button>
  </div>
</template>

<style scoped>
.entry {
  --entry-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);

  background: var(--color-elevation-surface-raised);
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary-default);
  padding: 24px;
  margin: 24px 0;
}

.entry__row {
  display: flex;
  row-gap: 24px;
  column-gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.entry__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1 1 160px;
  max-width: 220px;
}

.entry__stage {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 88px;
  background: var(--color-elevation-surface-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: 8px;
}

.entry__tile {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--color-interaction-primary-default);
}

.entry__tile--do {
  opacity: 1;
  transition: opacity 250ms var(--entry-decelerate);
}

.entry__tile--do.entry__tile--hidden {
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .entry__tile--do {
    scale: 1;
    transition:
      opacity 250ms var(--entry-decelerate),
      scale 250ms var(--entry-decelerate);
  }

  .entry__tile--do.entry__tile--hidden {
    scale: 0.9;
  }
}

.entry__tile--dont {
  scale: 1;
}

.entry__tile--dont.entry__tile--hidden {
  scale: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .entry__tile--dont {
    transition: scale 250ms var(--entry-decelerate);
  }
}

.entry__label {
  font-size: 12px;
  color: var(--color-text-secondary-default);
  text-align: center;
}

.entry__control {
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

.entry__control:hover {
  background: var(--color-interaction-secondary-hover);
}
</style>
