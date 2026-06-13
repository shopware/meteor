<script setup lang="ts">
import lightTokens from "@tokens-dict/administration/light.tokens.json";
import darkTokens from "@tokens-dict/administration/dark.tokens.json";
import primitives from "@tokens-dict/foundation/primitives.tokens.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = Record<string, any>;

// Flatten a token dictionary into { cssVar -> description } and, for tokens
// whose value references another token, { cssVar -> referenced cssVar }.
function flattenTokenData(obj: Json, prefix = "") {
  const descriptions: Record<string, string> = {};
  const values: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    const cssVar = "--" + key.replace(/\./g, "-");
    if (v && typeof v === "object" && "$value" in v) {
      descriptions[cssVar] = v.$description || "";
      const raw = v.$value;
      if (typeof raw === "string" && raw.startsWith("{") && raw.endsWith("}")) {
        values[cssVar] = "--" + raw.slice(1, -1).replace(/\./g, "-");
      }
    } else if (v && typeof v === "object") {
      const nested = flattenTokenData(v, key);
      Object.assign(descriptions, nested.descriptions);
      Object.assign(values, nested.values);
    }
  }
  return { descriptions, values };
}

const { descriptions: DESCRIPTIONS, values: REF_LIGHT } = flattenTokenData(
  lightTokens as Json,
);
const { values: REF_DARK } = flattenTokenData(darkTokens as Json);

function collectTokenKeys(obj: Json, prefix: string): string[] {
  const result: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = `${prefix}-${k}`;
    if (v && typeof v === "object" && "$value" in v) result.push(key);
    else if (v && typeof v === "object") result.push(...collectTokenKeys(v, key));
  }
  return result;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function buildGroups() {
  const groups: { name: string; tokens: string[] }[] = [];
  for (const [topKey, topVal] of Object.entries(lightTokens as Json)) {
    const prefix = `--${topKey}`;
    if (topKey === "color") {
      for (const [subKey, subVal] of Object.entries(topVal as Json)) {
        groups.push({
          name: capitalize(subKey).replace(/-/g, " "),
          tokens: collectTokenKeys(subVal as Json, `${prefix}-${subKey}`),
        });
      }
    } else if (topKey === "font") {
      for (const [subKey, subVal] of Object.entries(topVal as Json)) {
        const name =
          subKey === "line-height" ? "Line Height" : `Font ${capitalize(subKey)}`;
        groups.push({
          name,
          tokens: collectTokenKeys(subVal as Json, `${prefix}-${subKey}`),
        });
      }
    } else {
      groups.push({
        name: topKey.split("-").map(capitalize).join(" "),
        tokens: collectTokenKeys(topVal as Json, prefix),
      });
    }
  }
  const scale = (primitives as Json)?.scale?.size;
  if (scale) {
    groups.push({
      name: "Scale",
      tokens: Object.keys(scale).map((k) => `--scale-size-${k}`),
    });
  }
  return groups;
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

const isTransparent = (value: string | undefined) =>
  !!value && (value.includes("rgba") || value.endsWith("00") || value.includes("0 0 0 0"));

interface Row {
  token: string;
  type: ReturnType<typeof previewType>;
  description: string;
  isRound: boolean;
}

const groups = buildGroups().map((group) => ({
  name: group.name,
  rows: group.tokens
    .filter((t) => !DESCRIPTIONS[t]?.startsWith("Deprecated:"))
    .map(
      (token): Row => ({
        token,
        type: previewType(token),
        description: DESCRIPTIONS[token] || "",
        isRound: token.includes("round"),
      }),
    ),
}));

const resolvedLight = ref<Record<string, string>>({});
const resolvedDark = ref<Record<string, string>>({});

onMounted(() => {
  const lightStyle = getComputedStyle(document.documentElement);
  const darkEl = document.createElement("div");
  darkEl.setAttribute("data-theme", "dark");
  darkEl.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
  document.body.appendChild(darkEl);
  const darkStyle = getComputedStyle(darkEl);

  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};
  for (const group of groups) {
    for (const { token } of group.rows) {
      light[token] = lightStyle.getPropertyValue(token).trim();
      dark[token] = darkStyle.getPropertyValue(token).trim();
    }
  }
  document.body.removeChild(darkEl);
  resolvedLight.value = light;
  resolvedDark.value = dark;
});

// Value badges for non-color tokens: light value, plus dark value if it differs.
function badges(token: string) {
  const light = resolvedLight.value[token] || "";
  const dark = resolvedDark.value[token] || "";
  const out: string[] = [];
  if (light) out.push(light);
  if (dark && dark !== light) out.push(dark);
  return out;
}

function copy(token: string) {
  navigator.clipboard?.writeText(`var(${token})`).catch(() => {});
}
</script>

<template>
  <div class="token-browser">
    <div v-for="group in groups" :key="group.name" class="tb-group">
      <div class="tb-group__header">{{ group.name }}</div>
      <div
        v-for="row in group.rows"
        :key="row.token"
        class="tb-row"
        :class="{ 'tb-row--color': row.type === 'color' }"
      >
        <div class="tb-preview">
          <template v-if="row.type === 'color'">
            <span
              class="tb-swatch"
              :class="{ 'tb-swatch--alpha': isTransparent(resolvedLight[row.token]) }"
              :style="{ backgroundColor: `var(${row.token})` }"
            />
            <span
              data-theme="dark"
              class="tb-swatch"
              :class="{ 'tb-swatch--alpha': isTransparent(resolvedDark[row.token]) }"
              :style="{ backgroundColor: `var(${row.token})` }"
            />
          </template>
          <span
            v-else-if="row.type === 'radius'"
            class="tb-radius"
            :style="{ borderRadius: row.isRound ? '50%' : `var(${row.token})` }"
          />
          <span v-else-if="row.type === 'scale-size'" class="tb-scale">
            <span class="tb-scale__bar" :style="{ width: `var(${row.token})` }" />
          </span>
          <span
            v-else-if="row.type === 'font-size'"
            class="tb-aa"
            :style="{ fontSize: `var(${row.token})` }"
            >Aa</span
          >
          <span
            v-else-if="row.type === 'font-weight'"
            class="tb-aa"
            :style="{ fontWeight: `var(${row.token})` }"
            >Aa</span
          >
          <span
            v-else-if="row.type === 'font-family'"
            class="tb-aa"
            :style="{ fontFamily: `var(${row.token})` }"
            >Aa</span
          >
          <span v-else-if="row.type === 'line-height'" class="tb-lh">
            <span class="tb-lh__bar" :style="{ marginBottom: `var(${row.token})` }" />
            <span class="tb-lh__bar" />
          </span>
          <span v-else class="tb-empty" />
        </div>

        <div class="tb-meta">
          <button
            type="button"
            class="tb-token"
            :title="`Copy var(${row.token})`"
            @click="copy(row.token)"
          >
            {{ row.token }}
          </button>
          <span v-if="row.description" class="tb-desc">{{ row.description }}</span>
        </div>

        <div v-if="row.type !== 'color'" class="tb-values">
          <span v-for="value in badges(row.token)" :key="value" class="tb-badge">
            {{ value }}
          </span>
        </div>
        <div v-else />
      </div>
    </div>
  </div>
</template>

<style scoped>
.token-browser {
  margin-top: 24px;
}

.tb-group {
  margin-bottom: 40px;
  border: 1px solid var(--color-border-secondary-default);
  border-radius: 8px;
  overflow: hidden;
}

.tb-group__header {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary-default);
  padding: 0.75rem 1rem;
  background-color: var(--color-elevation-surface-sunken);
  border-bottom: 1px solid var(--color-border-secondary-default);
}

.tb-row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0 16px;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-border-secondary-default);
}

.tb-row:last-child {
  border-bottom: none;
}

.tb-preview {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  align-items: center;
}

.tb-swatch {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.tb-swatch--alpha {
  background-image: repeating-conic-gradient(#ccc 0% 25%, white 0% 50%);
  background-size: 8px 8px;
}

.tb-radius {
  width: 32px;
  height: 32px;
  background-color: var(--color-background-brand-default);
  border: 2px solid var(--color-border-brand-default);
  flex-shrink: 0;
}

.tb-scale {
  width: 64px;
  height: 32px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.tb-scale__bar {
  height: 6px;
  max-width: 64px;
  min-width: 2px;
  background-color: var(--color-interaction-primary-default);
  border-radius: 3px;
}

.tb-aa {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  color: var(--color-text-primary-default);
}

.tb-lh {
  width: 32px;
  flex-shrink: 0;
}

.tb-lh__bar {
  display: block;
  height: 2px;
  width: 32px;
  background-color: var(--color-interaction-primary-default);
  border-radius: 1px;
}

.tb-empty {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.tb-meta {
  min-width: 0;
}

.tb-token {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: monospace;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary-default);
  text-align: left;
  display: block;
}

.tb-token:hover {
  text-decoration: underline;
}

.tb-desc {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  color: var(--color-text-secondary-default);
}

.tb-values {
  display: flex;
  flex-direction: column;
  gap: 3px;
  align-items: flex-end;
}

.tb-badge {
  font-family: monospace;
  font-size: 11px;
  color: var(--color-text-secondary-default);
  background: var(--color-background-secondary-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: 4px;
  padding: 1px 6px;
  white-space: nowrap;
}
</style>
