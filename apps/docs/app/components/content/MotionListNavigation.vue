<script setup lang="ts">
import { ref } from "vue";

const items = ["Products", "Orders", "Customers", "Media"];
const instantIndex = ref(0);
const animatedIndex = ref(0);

function onKeydown(event: KeyboardEvent, which: "instant" | "animated") {
  const index = which === "instant" ? instantIndex : animatedIndex;

  if (event.key === "ArrowDown") {
    event.preventDefault();
    index.value = Math.min(items.length - 1, index.value + 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    index.value = Math.max(0, index.value - 1);
  }
}
</script>

<template>
  <div class="listnav">
    <div class="listnav__row">
      <div class="listnav__card">
        <div class="listnav__list" @keydown="onKeydown($event, 'instant')">
          <span
            class="listnav__highlight"
            :style="{ translate: `0 ${instantIndex * 32}px` }"
          />
          <button
            v-for="(item, index) in items"
            :key="item"
            type="button"
            class="listnav__item"
            :class="{ 'listnav__item--active': instantIndex === index }"
            @click="instantIndex = index"
          >
            {{ item }}
          </button>
        </div>
        <span class="listnav__label">Instant: keeps up with held arrow keys.</span>
      </div>

      <div class="listnav__card">
        <div class="listnav__list" @keydown="onKeydown($event, 'animated')">
          <span
            class="listnav__highlight listnav__highlight--animated"
            :style="{ translate: `0 ${animatedIndex * 32}px` }"
          />
          <button
            v-for="(item, index) in items"
            :key="item"
            type="button"
            class="listnav__item"
            :class="{ 'listnav__item--active': animatedIndex === index }"
            @click="animatedIndex = index"
          >
            {{ item }}
          </button>
        </div>
        <span class="listnav__label">Animated 250ms: lags behind rapid input.</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.listnav {
  background: var(--color-elevation-surface-raised);
  border-radius: 8px;
  border: 1px solid var(--color-border-secondary-default);
  padding: 24px;
  margin: 24px 0;
}

.listnav__row {
  display: flex;
  row-gap: 24px;
  column-gap: 24px;
  flex-wrap: wrap;
}

.listnav__card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 180px;
  max-width: 240px;
}

.listnav__list {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 4px;
  background: var(--color-elevation-surface-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: 8px;
}

.listnav__highlight {
  position: absolute;
  top: 4px;
  left: 4px;
  right: 4px;
  height: 32px;
  border-radius: 4px;
  background: var(--color-interaction-secondary-hover);
  translate: 0 0;
}

@media (prefers-reduced-motion: no-preference) {
  .listnav__highlight--animated {
    transition: translate 250ms cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.listnav__item {
  position: relative;
  height: 32px;
  padding: 0 10px;
  border: none;
  background: none;
  text-align: left;
  font-size: var(--font-size-2xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary-default);
  cursor: pointer;
  user-select: none;
}

.listnav__item--active {
  color: var(--color-text-primary-default);
}

.listnav__label {
  font-size: 12px;
  color: var(--color-text-secondary-default);
}
</style>
