<template>
  <div class="not-prose mt-6">
    <div v-for="group in groups" :key="group.name" class="mb-10 last:mb-0">
      <div class="overflow-hidden rounded-lg border border-muted">
        <div
          class="border-b border-muted bg-muted px-4 py-3 text-base font-semibold text-default"
        >
          {{ group.name }}
        </div>
        <div
          v-for="token in visibleTokens(group)"
          :key="token"
          class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-muted px-4 py-2 last:border-b-0 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center"
        >
          <div class="min-w-16 shrink-0">
            <template v-if="previewType(token) === 'color'">
              <div class="flex gap-1.5">
                <div class="flex flex-col items-center gap-1">
                  <div
                    class="size-7 rounded border border-black/10"
                    :style="swatchStyle(token, values.light[token])"
                  />
                  <span class="text-[9px] text-muted">light</span>
                </div>
                <div class="flex flex-col items-center gap-1">
                  <div
                    data-theme="dark"
                    class="size-7 rounded border border-black/10"
                    :style="swatchStyle(token, values.dark[token])"
                  />
                  <span class="text-[9px] text-muted">dark</span>
                </div>
              </div>
            </template>
            <div
              v-else-if="previewType(token) === 'radius'"
              class="size-8 border-2 border-[var(--color-border-brand-default)] bg-[var(--color-background-brand-default)]"
              :style="{
                borderRadius: token.includes('round') ? '50%' : `var(${token})`,
              }"
            />
            <div
              v-else-if="previewType(token) === 'scale-size'"
              class="flex h-8 w-16 items-center"
            >
              <div
                class="h-1.5 max-w-16 rounded-[3px] bg-[var(--color-interaction-primary-default)]"
                :style="{
                  width: `var(${token})`,
                  minWidth: values.light[token] === '0rem' ? '2px' : undefined,
                }"
              />
            </div>
            <div
              v-else-if="previewType(token) === 'font-size'"
              class="flex size-8 items-center justify-center overflow-hidden text-default"
            >
              <span
                :style="{
                  fontSize: `var(${token})`,
                  lineHeight: 1,
                  fontWeight: 500,
                }"
                >Aa</span
              >
            </div>
            <div
              v-else-if="previewType(token) === 'font-weight'"
              class="flex size-8 items-center justify-center overflow-hidden text-default"
            >
              <span :style="{ fontSize: '14px', fontWeight: `var(${token})` }"
                >Aa</span
              >
            </div>
            <div
              v-else-if="previewType(token) === 'font-family'"
              class="flex size-8 items-center justify-center overflow-hidden text-default"
            >
              <span :style="{ fontSize: '13px', fontFamily: `var(${token})` }"
                >Aa</span
              >
            </div>
            <div v-else-if="previewType(token) === 'line-height'" class="w-8">
              <div
                class="h-0.5 w-8 rounded-[1px] bg-[var(--color-interaction-primary-default)]"
                :style="{ marginBottom: `var(${token})` }"
              />
              <div
                class="h-0.5 w-8 rounded-[1px] bg-[var(--color-interaction-primary-default)]"
              />
            </div>
            <div v-else class="size-8" />
          </div>

          <div class="min-w-0">
            <button
              type="button"
              class="block cursor-pointer border-0 bg-transparent p-0 text-left font-mono text-sm font-medium text-default hover:underline"
              :title="`Copy var(${token})`"
              @click="copy(token)"
            >
              {{ token }}
            </button>
            <span
              v-if="descriptions[token]"
              class="mt-px block text-xs text-muted"
            >
              {{ descriptions[token] }}
            </span>
          </div>

          <div
            v-if="previewType(token) !== 'color'"
            class="flex flex-row flex-wrap gap-1.5 sm:flex-col sm:items-end sm:gap-[3px]"
          >
            <span
              v-if="displayLight(token)"
              class="whitespace-nowrap rounded border border-muted bg-muted px-1.5 py-px text-[11px] text-muted"
            >
              {{ displayLight(token) }}
            </span>
            <span
              v-if="displayDark(token)"
              class="whitespace-nowrap rounded border border-muted bg-muted px-1.5 py-px text-[11px] text-muted"
            >
              {{ displayDark(token) }}
            </span>
          </div>
          <div v-else class="hidden sm:block" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { TokenGroup } from "../../composables/useTokenDictionary";

const { descriptions, lightAliases, darkAliases, groups } =
  useTokenDictionary();
const toast = useToast();

const values = ref<{
  light: Record<string, string>;
  dark: Record<string, string>;
}>({
  light: {},
  dark: {},
});

onMounted(() => {
  const lightStyle = getComputedStyle(document.documentElement);

  const darkEl = document.createElement("div");
  darkEl.setAttribute("data-theme", "dark");
  darkEl.style.cssText =
    "position:absolute;visibility:hidden;pointer-events:none";
  document.body.appendChild(darkEl);
  const darkStyle = getComputedStyle(darkEl);

  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};

  groups.forEach(({ tokens }) => {
    tokens.forEach((token) => {
      light[token] = lightStyle.getPropertyValue(token).trim();
      dark[token] = darkStyle.getPropertyValue(token).trim();
    });
  });

  document.body.removeChild(darkEl);
  values.value = { light, dark };
});

function visibleTokens(group: TokenGroup) {
  return group.tokens.filter(
    (t) => !descriptions[t]?.startsWith("Deprecated:"),
  );
}

function previewType(token: string) {
  if (token.startsWith("--color-")) return "color";
  if (token.startsWith("--border-radius-")) return "radius";
  if (token.startsWith("--scale-size-")) return "scale-size";
  if (token.startsWith("--font-size-")) return "font-size";
  if (token.startsWith("--font-weight-")) return "font-weight";
  if (token.startsWith("--font-family-")) return "font-family";
  if (token.startsWith("--font-line-height-")) return "line-height";
  return "text";
}

function swatchStyle(token: string, value: string | undefined) {
  const isTransparent =
    value &&
    (value.includes("rgba") ||
      value.endsWith("00") ||
      value.includes("0 0 0 0"));
  return {
    backgroundColor: `var(${token})`,
    backgroundImage: isTransparent
      ? "repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 0 0 / 8px 8px"
      : undefined,
  };
}

function displayLight(token: string) {
  return previewType(token) === "color"
    ? lightAliases[token] || values.value.light[token]
    : values.value.light[token];
}

function displayDark(token: string) {
  if (previewType(token) === "color") {
    return darkAliases[token] || values.value.dark[token];
  }
  const light = values.value.light[token];
  const dark = values.value.dark[token];
  return light !== dark && dark ? dark : null;
}

function copy(token: string) {
  navigator.clipboard
    .writeText(`var(${token})`)
    .then(() => toast.add({ title: `Copied var(${token})`, duration: 2000 }))
    .catch(() => {});
}
</script>
