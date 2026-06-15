<script setup lang="ts">
import primitives from "@tokens-dict/foundation/primitives.tokens.json";

// Derived from primitives.tokens.json so the palette tracks the token source.
// Built at setup (not onMounted) so the swatch grid renders during SSR; swatch
// backgrounds come from var(--token) directly, and the resolved hex strings are
// progressive enhancement filled in after mount.
const palettes = Object.entries(
  (primitives as { color: Record<string, Record<string, unknown>> }).color,
).map(([name, steps]) => ({
  name: name.charAt(0).toUpperCase() + name.slice(1),
  swatches: Object.keys(steps).map((step) => ({
    token: `--color-${name}-${step}`,
    step,
  })),
}));

const allTokens = palettes.flatMap((palette) =>
  palette.swatches.map((swatch) => swatch.token),
);
const { light } = useResolvedTokens(allTokens);

const { copy } = useCopyToClipboard();

function luminance(r: number, g: number, b: number) {
  return r * 0.299 + g * 0.587 + b * 0.114;
}

function isLight(hex: string | undefined) {
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
          :class="{ 'swatch--light': isLight(light[swatch.token]) }"
          :style="{ backgroundColor: `var(${swatch.token})` }"
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
            :title="`Copy ${light[swatch.token] ?? ''}`"
            @click="copy(light[swatch.token] ?? '')"
          >
            {{ light[swatch.token] }}
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
