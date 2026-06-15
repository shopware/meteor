<script setup lang="ts">
import {
  DESCRIPTIONS,
  previewType,
  tokenGroups,
} from "#shared/data/tokens";

const isTransparent = (value: string | undefined) =>
  !!value && (value.includes("rgba") || value.endsWith("00") || value.includes("0 0 0 0"));

interface Row {
  token: string;
  type: ReturnType<typeof previewType>;
  description: string;
  isRound: boolean;
}

const groups = tokenGroups.map((group) => ({
  name: group.name,
  rows: group.tokens.map(
    (token): Row => ({
      token,
      type: previewType(token),
      description: DESCRIPTIONS[token] || "",
      isRound: token.includes("round"),
    }),
  ),
}));

const allTokens = groups.flatMap((group) => group.rows.map((row) => row.token));
// Swatch/preview boxes render from var(--token) directly (SSR-visible); these
// resolved strings are progressive enhancement for the value badges.
const { light, dark } = useResolvedTokens(allTokens, { dark: true });

// Value badges for non-color tokens: light value, plus dark value if it
// differs. A computed (not a function called in the template) so it recomputes
// only when the resolved maps change, not on every render.
const badgesByToken = computed(() => {
  const map: Record<string, string[]> = {};
  for (const group of groups) {
    for (const { token, type } of group.rows) {
      if (type === "color") continue;
      let lightValue = light.value[token] || "";
      let darkValue = dark.value[token] || "";
      // @nuxt/fonts appends generated fallback families to --font-family-*; show
      // only the primary family (e.g. 'Inter').
      if (token.startsWith("--font-family-")) {
        const first = (value: string) => (value.split(",")[0] ?? value).trim();
        lightValue = first(lightValue);
        darkValue = first(darkValue);
      }
      const out: string[] = [];
      if (lightValue) out.push(lightValue);
      if (darkValue && darkValue !== lightValue) out.push(darkValue);
      map[token] = out;
    }
  }
  return map;
});

const { copy } = useCopyToClipboard();
</script>

<template>
  <div class="token-browser">
    <div v-for="group in groups" :key="group.name" class="tb-group">
      <div class="tb-group__header">{{ group.name }}</div>
      <button
        v-for="row in group.rows"
        :key="row.token"
        type="button"
        class="tb-row"
        :class="{ 'tb-row--color': row.type === 'color' }"
        :title="`Copy var(${row.token})`"
        @click="copy(`var(${row.token})`)"
      >
        <div class="tb-preview">
          <span
            v-if="row.type === 'color'"
            class="tb-swatch"
            :class="{ 'tb-swatch--alpha': isTransparent(light[row.token]) }"
            :style="{ backgroundColor: `var(${row.token})` }"
          />
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
          <span class="tb-token">{{ row.token }}</span>
          <span v-if="row.description" class="tb-desc">{{ row.description }}</span>
        </div>

        <div v-if="row.type !== 'color'" class="tb-values">
          <span
            v-for="value in badgesByToken[row.token]"
            :key="value"
            class="tb-badge"
          >
            {{ value }}
          </span>
        </div>
        <div v-else />
      </button>
    </div>
  </div>
</template>

<style scoped>
.token-browser {
  margin-top: 24px;
}

.tb-group {
  margin: 24px 0;
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
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0 16px;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid var(--color-border-secondary-default);
  width: 100%;
  text-align: left;
  background: none;
  border-left: none;
  border-right: none;
  border-top: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
}

.tb-row:hover {
  background-color: var(--color-interaction-secondary-hover);
}

.tb-row:hover .tb-token {
  text-decoration: underline;
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
  border: 1px solid var(--color-border-secondary-default);
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
  font-family: monospace;
  font-size: var(--font-size-2xs);
  font-weight: 500;
  color: var(--color-text-primary-default);
  display: block;
  word-break: break-all;
}

.tb-desc {
  display: block;
  margin-top: 2px;
  font-size: var(--font-size-2xs);
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
  font-size: var(--font-size-2xs);
  color: var(--color-text-secondary-default);
  background: var(--color-background-secondary-default);
  border: 1px solid var(--color-border-secondary-default);
  border-radius: 4px;
  padding: 1px 6px;
  white-space: nowrap;
}
</style>
