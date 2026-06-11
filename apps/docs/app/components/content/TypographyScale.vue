<template>
  <div>
    <div class="my-6 overflow-hidden rounded-lg border border-muted">
      <div
        class="border-b border-muted bg-muted px-4 py-3 text-base font-semibold text-default"
      >
        Size scale
      </div>
      <div
        v-for="size in sizes"
        :key="size.token"
        class="grid grid-cols-1 items-baseline gap-2 border-b border-muted bg-[var(--color-elevation-surface-default)] px-4 py-3 last:border-b-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
      >
        <div
          class="flex flex-col gap-0.5 text-xs leading-[var(--font-line-height-xs)] text-muted"
        >
          <span class="text-sm font-semibold text-default">
            {{ size.label }}
          </span>
          <span>{{ resolved[size.token] ?? "" }}</span>
        </div>
        <span
          class="font-normal text-default"
          :style="{
            fontSize: `var(${size.token})`,
            lineHeight: `var(${size.lineHeight})`,
          }"
        >
          The quick brown fox jumps over the lazy dog
        </span>
      </div>
    </div>

    <div class="my-4 overflow-hidden rounded-lg border border-muted">
      <div
        class="border-b border-muted bg-muted px-4 py-3 text-base font-semibold text-default"
      >
        Weights
      </div>
      <div
        v-for="weight in weights"
        :key="weight.token"
        class="grid grid-cols-1 items-baseline gap-2 border-b border-muted bg-[var(--color-elevation-surface-default)] px-4 py-3 last:border-b-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4"
      >
        <div
          class="flex flex-col gap-0.5 text-xs leading-[var(--font-line-height-xs)] text-muted"
        >
          <span class="text-sm font-semibold text-default">
            {{ weight.label }}
          </span>
          <span>{{ resolved[weight.token] ?? "" }}</span>
        </div>
        <span
          class="text-base leading-[var(--font-line-height-m)] text-default"
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
