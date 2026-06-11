<template>
  <div class="token-browser">
    <div v-for="group in groups" :key="group.name" class="token-browser__group">
      <div class="token-browser__group-inner">
        <div class="token-browser__group-name">{{ group.name }}</div>
        <div
          v-for="token in visibleTokens(group)"
          :key="token"
          class="token-browser__row"
        >
          <!-- Preview -->
          <div class="token-browser__preview">
            <template v-if="previewType(token) === 'color'">
              <div class="token-browser__swatch-pair">
                <div class="token-browser__swatch-col">
                  <div
                    class="token-browser__swatch"
                    :style="swatchStyle(token, values.light[token])"
                  />
                  <span class="token-browser__swatch-label">light</span>
                </div>
                <div class="token-browser__swatch-col">
                  <div
                    data-theme="dark"
                    class="token-browser__swatch"
                    :style="swatchStyle(token, values.dark[token])"
                  />
                  <span class="token-browser__swatch-label">dark</span>
                </div>
              </div>
            </template>
            <div
              v-else-if="previewType(token) === 'radius'"
              class="token-browser__radius"
              :style="{
                borderRadius: token.includes('round') ? '50%' : `var(${token})`,
              }"
            />
            <div
              v-else-if="previewType(token) === 'scale-size'"
              class="token-browser__scale"
            >
              <div
                class="token-browser__scale-bar"
                :style="{
                  width: `var(${token})`,
                  minWidth: values.light[token] === '0rem' ? '2px' : undefined,
                }"
              />
            </div>
            <div
              v-else-if="previewType(token) === 'font-size'"
              class="token-browser__font-box"
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
              class="token-browser__font-box"
            >
              <span :style="{ fontSize: '14px', fontWeight: `var(${token})` }"
                >Aa</span
              >
            </div>
            <div
              v-else-if="previewType(token) === 'font-family'"
              class="token-browser__font-box"
            >
              <span :style="{ fontSize: '13px', fontFamily: `var(${token})` }"
                >Aa</span
              >
            </div>
            <div
              v-else-if="previewType(token) === 'line-height'"
              class="token-browser__leading"
            >
              <div
                class="token-browser__leading-bar"
                :style="{ marginBottom: `var(${token})` }"
              />
              <div class="token-browser__leading-bar" />
            </div>
            <div v-else class="token-browser__placeholder" />
          </div>

          <!-- Name + description -->
          <div class="token-browser__info">
            <button
              type="button"
              class="token-browser__token-name"
              :title="`Copy var(${token})`"
              @click="copy(token)"
            >
              {{ token }}
            </button>
            <span v-if="descriptions[token]" class="token-browser__description">
              {{ descriptions[token] }}
            </span>
          </div>

          <!-- Values -->
          <div
            v-if="previewType(token) !== 'color'"
            class="token-browser__values"
          >
            <span v-if="displayLight(token)" class="token-browser__value-badge">
              {{ displayLight(token) }}
            </span>
            <span v-if="displayDark(token)" class="token-browser__value-badge">
              {{ displayDark(token) }}
            </span>
          </div>
          <div v-else />
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

<style scoped>
.token-browser {
  margin-top: 24px;
}

.token-browser__group {
  margin-bottom: 40px;
}

.token-browser__group-inner {
  border: 1px solid var(--color-border-secondary-default);
  border-radius: 8px;
  overflow: hidden;
}

.token-browser__group-name {
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary-default);
  padding: 0.75rem 1rem;
  background-color: var(--color-background-secondary-default);
  border-bottom: 1px solid var(--color-border-secondary-default);
}

.token-browser__row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0 16px;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-border-secondary-default);
}

.token-browser__row:last-child {
  border-bottom: none;
}

.token-browser__preview {
  flex-shrink: 0;
  min-width: 64px;
}

.token-browser__swatch-pair {
  display: flex;
  gap: 6px;
}

.token-browser__swatch-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.token-browser__swatch {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.token-browser__swatch-label {
  font-size: 9px;
  color: var(--color-text-secondary-default);
  letter-spacing: 0.02em;
}

.token-browser__radius {
  width: 32px;
  height: 32px;
  background-color: var(--color-background-brand-default);
  border: 2px solid var(--color-border-brand-default);
}

.token-browser__scale {
  width: 64px;
  height: 32px;
  display: flex;
  align-items: center;
}

.token-browser__scale-bar {
  height: 6px;
  max-width: 64px;
  background-color: var(--color-interaction-primary-default);
  border-radius: 3px;
}

.token-browser__font-box {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: var(--color-text-primary-default);
}

.token-browser__leading {
  width: 32px;
}

.token-browser__leading-bar {
  height: 2px;
  width: 32px;
  background-color: var(--color-interaction-primary-default);
  border-radius: 1px;
}

.token-browser__placeholder {
  width: 32px;
  height: 32px;
}

.token-browser__info {
  min-width: 0;
}

.token-browser__token-name {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary-default);
  display: block;
  text-align: left;
  margin-bottom: 4px;
}

.token-browser__token-name:hover {
  text-decoration: underline;
}

.token-browser__description {
  font-size: 12px;
  color: var(--color-text-secondary-default);
  display: block;
  margin-top: 1px;
}

.token-browser__values {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: flex-end;
}

.token-browser__value-badge {
  font-size: 11px;
  color: var(--color-text-secondary-default);
  background: var(--color-background-secondary-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: 4px;
  padding: 1px 6px;
  white-space: nowrap;
}
</style>
