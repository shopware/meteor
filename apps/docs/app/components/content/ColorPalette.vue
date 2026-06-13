<script setup lang="ts">
import primitives from "@tokens-dict/foundation/primitives.tokens.json";

// Derived from primitives.tokens.json so the palette tracks the token source.
const paletteDefinitions = Object.entries(
  (primitives as { color: Record<string, Record<string, unknown>> }).color,
).map(([name, steps]) => ({
  name: name.charAt(0).toUpperCase() + name.slice(1),
  prefix: `--color-${name}`,
  steps: Object.keys(steps).map(Number),
}));

interface Swatch {
  token: string;
  step: string;
  hex: string;
}

const palettes = ref<{ name: string; swatches: Swatch[] }[]>([]);
const toast = useToast();

function luminance(r: number, g: number, b: number) {
  return r * 0.299 + g * 0.587 + b * 0.114;
}

function isLight(hex: string) {
  if (!hex) return true;
  const value = hex.trim();
  if (value.startsWith("#") && value.length >= 7) {
    const r = parseInt(value.slice(1, 3), 16);
    const g = parseInt(value.slice(3, 5), 16);
    const b = parseInt(value.slice(5, 7), 16);
    return luminance(r, g, b) > 160;
  }
  return true;
}

onMounted(() => {
  const style = getComputedStyle(document.documentElement);
  palettes.value = paletteDefinitions.map(({ name, prefix, steps }) => ({
    name,
    swatches: steps.map((step) => {
      const token = `${prefix}-${step}`;
      return { token, step: String(step), hex: style.getPropertyValue(token).trim() };
    }),
  }));
});

function copy(value: string) {
  navigator.clipboard
    ?.writeText(value)
    .then(() =>
      toast.add({ title: `Copied ${value}`, icon: "i-lucide-check", color: "success" }),
    )
    .catch(() => {});
}
</script>

<template>
  <div class="color-palette">
    <div v-for="palette in palettes" :key="palette.name" class="palette">
      <div class="palette__name">{{ palette.name }}</div>
      <div class="palette__swatches">
        <div
          v-for="swatch in palette.swatches"
          :key="swatch.token"
          class="swatch"
          :class="{ 'swatch--light': isLight(swatch.hex) }"
          :style="{ backgroundColor: swatch.hex }"
        >
          <button
            type="button"
            class="swatch__btn swatch__step"
            :title="`Copy var(${swatch.token})`"
            @click="copy(`var(${swatch.token})`)"
          >
            {{ swatch.step }}
          </button>
          <button
            type="button"
            class="swatch__btn swatch__hex"
            :title="`Copy ${swatch.hex}`"
            @click="copy(swatch.hex)"
          >
            {{ swatch.hex }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-palette {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin: 24px 0;
}

.palette__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary-default);
  margin-bottom: 8px;
}

.palette__swatches {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border-secondary-default);
}

.swatch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 9px 14px;
  color: rgba(255, 255, 255, 0.9);
}

.swatch--light {
  color: rgba(0, 0, 0, 0.75);
}

.swatch__btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: monospace;
  color: inherit;
}

.swatch__btn:hover {
  text-decoration: underline;
}

.swatch__step {
  font-size: 12px;
  font-weight: 500;
}

.swatch__hex {
  font-size: 11px;
  opacity: 0.85;
}
</style>
