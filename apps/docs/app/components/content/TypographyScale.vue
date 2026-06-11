<template>
  <div>
    <div class="typography-scale__section">
      <div class="typography-scale__header">Size scale</div>
      <div
        v-for="size in sizes"
        :key="size.token"
        class="typography-scale__row"
      >
        <div class="typography-scale__meta">
          <span class="typography-scale__label">{{ size.label }}</span>
          <span>{{ resolved[size.token] ?? "" }}</span>
        </div>
        <span
          class="typography-scale__sample"
          :style="{
            fontSize: `var(${size.token})`,
            lineHeight: `var(${size.lineHeight})`,
          }"
        >
          The quick brown fox jumps over the lazy dog
        </span>
      </div>
    </div>

    <div class="typography-scale__section typography-scale__section--weights">
      <div class="typography-scale__header">Weights</div>
      <div
        v-for="weight in weights"
        :key="weight.token"
        class="typography-scale__row"
      >
        <div class="typography-scale__meta">
          <span class="typography-scale__label">{{ weight.label }}</span>
          <span>{{ resolved[weight.token] ?? "" }}</span>
        </div>
        <span
          class="typography-scale__sample--weight"
          :style="{ fontWeight: `var(${weight.token})` }"
        >
          The quick brown fox jumps over the lazy dog
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const { groups } = useTokenDictionary();

const fontSizeTokens =
  groups.find((group) => group.name === "Font Size")?.tokens ?? [];
const fontWeightTokens =
  groups.find((group) => group.name === "Font Weight")?.tokens ?? [];

const sizes = fontSizeTokens.map((token) => {
  const label = token.replace("--font-size-", "");
  return {
    label,
    token,
    lineHeight: `--font-line-height-${label}`,
  };
});

const weights = fontWeightTokens.map((token) => {
  const label = token.replace("--font-weight-", "");
  return {
    token,
    label: label.charAt(0).toUpperCase() + label.slice(1),
  };
});

const resolved = ref<Record<string, string>>({});

onMounted(() => {
  const style = getComputedStyle(document.documentElement);
  const values: Record<string, string> = {};
  for (const { token } of sizes) {
    values[token] = style.getPropertyValue(token).trim();
  }
  for (const { token } of weights) {
    values[token] = style.getPropertyValue(token).trim();
  }
  resolved.value = values;
});
</script>

<style scoped>
.typography-scale__section {
  margin: var(--scale-size-24) 0;
  border: 1px solid var(--color-border-secondary-default);
  border-radius: 8px;
  overflow: hidden;
}

.typography-scale__section--weights {
  margin-top: var(--scale-size-16);
}

.typography-scale__header {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary-default);
  padding: 0.75rem 1rem;
  background-color: var(--color-background-secondary-default);
  border-bottom: 1px solid var(--color-border-secondary-default);
}

.typography-scale__row {
  display: grid;
  grid-template-columns: 10rem 1fr;
  align-items: baseline;
  gap: var(--scale-size-16);
  padding: var(--scale-size-12) var(--scale-size-16);
  border-bottom: 1px solid var(--color-border-secondary-default);
  background-color: var(--color-elevation-surface-default);
}

.typography-scale__row:last-child {
  border-bottom: none;
}

.typography-scale__meta {
  font-size: var(--font-size-xs);
  line-height: var(--font-line-height-xs);
  color: var(--color-text-secondary-default);
  display: flex;
  flex-direction: column;
  gap: var(--scale-size-2);
}

.typography-scale__label {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-s);
  color: var(--color-text-primary-default);
}

.typography-scale__sample,
.typography-scale__sample--weight {
  font-weight: var(--font-weight-regular);
  color: var(--color-text-primary-default);
}

.typography-scale__sample--weight {
  font-size: var(--font-size-m);
  line-height: var(--font-line-height-m);
}
</style>
