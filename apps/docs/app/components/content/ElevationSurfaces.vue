<script setup lang="ts">
const surfaces = [
  {
    token: "--color-elevation-surface-sunken",
    label: "Sunken",
    bottom: "18%",
    centerY: 133,
  },
  {
    token: "--color-elevation-surface-default",
    label: "Default",
    bottom: "30%",
    centerY: 102,
  },
  {
    token: "--color-elevation-surface-raised",
    label: "Raised",
    bottom: "42%",
    centerY: 71,
  },
];

const panels = [
  { theme: undefined, caption: "Light mode" },
  { theme: "dark", caption: "Dark mode" },
] as const;
</script>

<template>
  <div class="elevation">
    <div
      v-for="panel in panels"
      :key="panel.caption"
      class="elevation__panel"
      :data-theme="panel.theme"
    >
      <div class="elevation__stage">
        <div class="elevation__scene">
          <div
            v-for="surface in surfaces"
            :key="surface.token"
            class="elevation__card"
            :style="{
              bottom: surface.bottom,
              background: `var(${surface.token})`,
            }"
          />
        </div>

        <span class="elevation__caption">{{ panel.caption }}</span>

        <div
          v-for="surface in surfaces"
          :key="`${surface.token}-legend`"
          class="elevation__legend"
          :style="{ top: `${surface.centerY}px` }"
        >
          <span class="elevation__dot" />
          <span class="elevation__line" />
          <span class="elevation__legend-label">{{ surface.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.elevation {
  display: flex;
  gap: 16px;
  margin: 24px 0;
}

.elevation__panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  background: var(--color-elevation-surface-default);
}

.elevation__stage {
  position: relative;
  width: 340px;
  height: 260px;
}

.elevation__scene {
  position: absolute;
  left: 0;
  top: 0;
  width: 260px;
  height: 260px;
  perspective: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.elevation__card {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 12px;
  border: 1px solid var(--color-border-secondary-default);
  transform: rotateX(45deg) rotateZ(-45deg);
  transform-style: preserve-3d;
}

.elevation__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 260px;
  text-align: center;
  font-size: 12px;
  color: var(--color-text-primary-default);
}

.elevation__legend {
  position: absolute;
  left: 256px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

.elevation__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--color-border-secondary-default);
  flex-shrink: 0;
}

.elevation__line {
  width: 24px;
  height: 1px;
  background: var(--color-border-secondary-default);
  flex-shrink: 0;
}

.elevation__legend-label {
  padding-left: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary-default);
  white-space: nowrap;
}
</style>
