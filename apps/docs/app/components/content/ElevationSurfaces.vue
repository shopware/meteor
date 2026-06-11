<template>
  <div class="elevation-surfaces">
    <div
      v-for="theme in ['light', 'dark']"
      :key="theme"
      :data-theme="theme"
      class="elevation-surfaces__panel"
    >
      <div class="elevation-surfaces__stage">
        <div class="elevation-surfaces__scene">
          <div
            v-for="surface in surfaces"
            :key="surface.token"
            class="elevation-surfaces__card"
            :style="{
              background: `var(${surface.token})`,
              bottom: surface.bottom,
            }"
          />
        </div>
        <span class="elevation-surfaces__caption">
          {{ theme === "dark" ? "Dark mode" : "Light mode" }}
        </span>
        <div
          v-for="surface in surfaces"
          :key="surface.token + '-legend'"
          class="elevation-surfaces__legend"
          :style="{ top: surface.centerY + 'px' }"
        >
          <div class="elevation-surfaces__legend-dot" />
          <div class="elevation-surfaces__legend-line" />
          <span class="elevation-surfaces__legend-label">{{
            surface.label
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// centerY = CONTAINER_SIZE - (bottomPct * CONTAINER_SIZE) - CARD_SIZE / 2
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
</script>

<style scoped>
.elevation-surfaces {
  display: flex;
  gap: 16px;
  margin: 24px 0;
}

.elevation-surfaces__panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
}

.elevation-surfaces__stage {
  position: relative;
  width: 340px;
  height: 260px;
}

.elevation-surfaces__scene {
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

.elevation-surfaces__card {
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 12px;
  border: 1px solid var(--color-border-secondary-default);
  transform: rotateX(45deg) rotateZ(-45deg);
  transform-style: preserve-3d;
}

.elevation-surfaces__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 260px;
  text-align: center;
  font-size: 12px;
  color: var(--color-static-black);
}

.elevation-surfaces__legend {
  position: absolute;
  left: 256px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

.elevation-surfaces__legend-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #e0e0e0;
  flex-shrink: 0;
}

.elevation-surfaces__legend-line {
  width: 24px;
  height: 1px;
  background: #e0e0e0;
  flex-shrink: 0;
}

.elevation-surfaces__legend-label {
  padding-left: 6px;
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  color: var(--color-static-black);
  white-space: nowrap;
}
</style>
