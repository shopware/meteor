<template>
  <div class="color-palette">
    <div
      v-for="palette in palettes"
      :key="palette.name"
      class="color-palette__group"
    >
      <div class="color-palette__name">{{ palette.name }}</div>
      <div class="color-palette__swatches">
        <div
          v-for="swatch in palette.swatches"
          :key="swatch.token"
          class="color-palette__swatch"
          :style="{ backgroundColor: swatch.hex }"
        >
          <button
            type="button"
            class="color-palette__copy"
            :style="{ color: textColor(swatch.hex) }"
            :title="`Copy var(${swatch.token})`"
            @click="copy(`var(${swatch.token})`)"
          >
            {{ stepOf(swatch.token) }}
          </button>
          <button
            type="button"
            class="color-palette__copy color-palette__copy--muted"
            :style="{ color: mutedColor(swatch.hex) }"
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

<script setup lang="ts">
import { onMounted, ref } from "vue";

interface Swatch {
  token: string;
  hex: string;
}

interface Palette {
  name: string;
  swatches: Swatch[];
}

const { primitives } = useTokenDictionary();
const toast = useToast();

// Derived from primitives.tokens.json. Updates automatically when the token file changes.
const paletteDefinitions = Object.entries(
  (primitives as { color: Record<string, Record<string, unknown>> }).color,
).map(([name, steps]) => ({
  name: name.charAt(0).toUpperCase() + name.slice(1),
  prefix: `--color-${name}`,
  steps: Object.keys(steps),
}));

const palettes = ref<Palette[]>([]);

onMounted(() => {
  const style = getComputedStyle(document.documentElement);
  palettes.value = paletteDefinitions.map(({ name, prefix, steps }) => ({
    name,
    swatches: steps.map((step) => {
      const token = `${prefix}-${step}`;
      return { token, hex: style.getPropertyValue(token).trim() };
    }),
  }));
});

function luminance(r: number, g: number, b: number) {
  return r * 0.299 + g * 0.587 + b * 0.114;
}

function isLight(color: string) {
  if (!color) return true;
  const hex = color.trim();
  if (hex.startsWith("#") && hex.length >= 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return luminance(r, g, b) > 160;
  }
  const rgb = hex.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgb)
    return luminance(Number(rgb[1]), Number(rgb[2]), Number(rgb[3])) > 160;
  return true;
}

function textColor(hex: string) {
  return isLight(hex) ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.9)";
}

function mutedColor(hex: string) {
  return isLight(hex) ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)";
}

function stepOf(token: string) {
  const match = token.match(/(\d+)$/);
  return match ? match[1] : token;
}

function copy(value: string) {
  navigator.clipboard
    .writeText(value)
    .then(() => toast.add({ title: `Copied ${value}`, duration: 2000 }))
    .catch(() => {});
}
</script>

<style scoped>
.color-palette {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin: 24px 0;
}

.color-palette__group {
  min-width: 0;
}

.color-palette__name {
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary-default);
  margin-bottom: 8px;
}

.color-palette__swatches {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border-secondary-default);
}

.color-palette__swatch {
  padding: 9px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.color-palette__copy {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: var(--font-family-body, monospace);
  font-size: 12px;
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.01em;
  text-decoration: none;
}

.color-palette__copy--muted {
  font-size: 11px;
  font-weight: var(--font-weight-regular);
}

.color-palette__copy:hover {
  text-decoration: underline;
}
</style>
