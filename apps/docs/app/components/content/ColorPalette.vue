<template>
  <div class="not-prose my-6 grid gap-6 sm:grid-cols-2">
    <div v-for="palette in palettes" :key="palette.name" class="min-w-0">
      <div class="mb-2 text-[13px] font-semibold text-default">
        {{ palette.name }}
      </div>
      <div class="overflow-hidden rounded-lg border border-muted">
        <div
          v-for="swatch in palette.swatches"
          :key="swatch.token"
          class="flex items-center justify-between gap-2 px-3.5 py-2.5"
          :style="{ backgroundColor: swatch.hex }"
        >
          <button
            type="button"
            class="cursor-pointer border-0 bg-transparent p-0 font-mono text-xs font-medium hover:underline"
            :style="{ color: textColor(swatch.hex) }"
            :title="`Copy var(${swatch.token})`"
            @click="copy(`var(${swatch.token})`)"
          >
            {{ stepOf(swatch.token) }}
          </button>
          <button
            type="button"
            class="cursor-pointer border-0 bg-transparent p-0 font-mono text-[11px] hover:underline"
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
