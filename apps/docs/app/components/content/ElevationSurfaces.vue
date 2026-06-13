<script setup lang="ts">
const surfaces = [
  { key: "sunken", label: "Sunken", bottom: "18%", centerY: 133 },
  { key: "default", label: "Default", bottom: "30%", centerY: 102 },
  { key: "raised", label: "Raised", bottom: "42%", centerY: 71 },
] as const;

// Each surface/chrome token is resolved to the primitive behind it (per theme)
// and applied through the meteor Tailwind color classes. Using fixed primitive
// values keeps both panels correct regardless of the site's light/dark mode,
// without relying on a data-theme attribute.
const themes = {
  light: {
    caption: "Light mode",
    panel: "bg-zinc-0 text-zinc-900",
    border: "border-zinc-100",
    line: "bg-zinc-100",
    surface: { sunken: "bg-zinc-50", default: "bg-zinc-0", raised: "bg-zinc-0" },
  },
  dark: {
    caption: "Dark mode",
    panel: "bg-zinc-975 text-zinc-50",
    border: "border-zinc-850",
    line: "bg-zinc-850",
    surface: {
      sunken: "bg-zinc-1000",
      default: "bg-zinc-975",
      raised: "bg-zinc-950",
    },
  },
} as const;

const panels = ["light", "dark"] as const;
</script>

<template>
  <div class="elevation overflow-hidden rounded-lg border border-muted">
    <div
      v-for="theme in panels"
      :key="theme"
      class="elevation__panel"
      :class="themes[theme].panel"
    >
      <div class="elevation__stage">
        <div class="elevation__scene">
          <div
            v-for="surface in surfaces"
            :key="surface.key"
            class="elevation__card"
            :class="[themes[theme].surface[surface.key], themes[theme].border]"
            :style="{ bottom: surface.bottom }"
          />
        </div>

        <span class="elevation__caption">{{ themes[theme].caption }}</span>

        <div
          v-for="surface in surfaces"
          :key="`${surface.key}-legend`"
          class="elevation__legend"
          :style="{ top: `${surface.centerY}px` }"
        >
          <span class="elevation__dot" :class="themes[theme].line" />
          <span class="elevation__line" :class="themes[theme].line" />
          <span class="elevation__legend-label">{{ surface.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.elevation {
  display: flex;
  margin: 24px 0;
}

.elevation__panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
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
  border-width: 1px;
  border-style: solid;
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
  flex-shrink: 0;
}

.elevation__line {
  width: 24px;
  height: 1px;
  flex-shrink: 0;
}

.elevation__legend-label {
  padding-left: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
</style>
