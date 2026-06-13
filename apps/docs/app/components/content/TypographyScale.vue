<script setup lang="ts">
import lightTokens from "@tokens-dict/administration/light.tokens.json";

const font = (
  lightTokens as {
    font: { size: Record<string, unknown>; weight: Record<string, unknown> };
  }
).font;

const sizes = Object.keys(font.size).map((label) => ({
  label,
  token: `--font-size-${label}`,
  lineHeight: `--font-line-height-${label}`,
}));

const weights = Object.keys(font.weight).map((label) => ({
  label: label.charAt(0).toUpperCase() + label.slice(1),
  token: `--font-weight-${label}`,
}));

const resolved = ref<Record<string, string>>({});

onMounted(() => {
  const style = getComputedStyle(document.documentElement);
  const values: Record<string, string> = {};
  for (const { token } of sizes) values[token] = style.getPropertyValue(token).trim();
  for (const { token } of weights)
    values[token] = style.getPropertyValue(token).trim();
  resolved.value = values;
});

const sample = "The quick brown fox jumps over the lazy dog";
</script>

<template>
  <div class="typo">
    <div class="typo__group">
      <div class="typo__header">Size scale</div>
      <div v-for="size in sizes" :key="size.token" class="typo__row">
        <div class="typo__meta">
          <span class="typo__label">{{ size.label }}</span>
          <span>{{ resolved[size.token] }}</span>
        </div>
        <span
          class="typo__sample"
          :style="{
            fontSize: `var(${size.token})`,
            lineHeight: `var(${size.lineHeight})`,
          }"
        >
          {{ sample }}
        </span>
      </div>
    </div>

    <div class="typo__group">
      <div class="typo__header">Weights</div>
      <div v-for="weight in weights" :key="weight.token" class="typo__row">
        <div class="typo__meta">
          <span class="typo__label">{{ weight.label }}</span>
          <span>{{ resolved[weight.token] }}</span>
        </div>
        <span class="typo__sample" :style="{ fontWeight: `var(${weight.token})` }">
          {{ sample }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.typo__group {
  margin: 24px 0;
  border: 1px solid var(--color-border-secondary-default);
  border-radius: 8px;
  overflow: hidden;
}

.typo__header {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary-default);
  padding: 0.75rem 1rem;
  background-color: var(--color-elevation-surface-sunken);
  border-bottom: 1px solid var(--color-border-secondary-default);
}

.typo__row {
  display: grid;
  grid-template-columns: 10rem 1fr;
  align-items: baseline;
  gap: 16px;
  padding: 10px 16px;
  background-color: var(--color-elevation-surface-default);
  border-bottom: 1px solid var(--color-border-secondary-default);
}

.typo__row:last-child {
  border-bottom: none;
}

.typo__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary-default);
}

.typo__label {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-s);
  color: var(--color-text-primary-default);
}

.typo__sample {
  color: var(--color-text-primary-default);
}
</style>
