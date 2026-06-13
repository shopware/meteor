// Pure token-dictionary helpers shared by the TokenBrowser component and the
// raw/llms markdown export (server/utils/transformMeteorMdc). The component adds
// runtime CSS-variable resolution on top; the export uses the grouping and
// descriptions to emit markdown tables.
import lightTokens from "@tokens-dict/administration/light.tokens.json";
import primitives from "@tokens-dict/foundation/primitives.tokens.json";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Json = Record<string, any>;

// Flatten a token dictionary into { cssVar -> description } and, for tokens
// whose value references another token, { cssVar -> referenced cssVar }.
export function flattenTokenData(obj: Json, prefix = "") {
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

function collectTokenKeys(obj: Json, prefix: string): string[] {
  const result: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = `${prefix}-${k}`;
    if (v && typeof v === "object" && "$value" in v) result.push(key);
    else if (v && typeof v === "object")
      result.push(...collectTokenKeys(v, key));
  }
  return result;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export interface TokenGroup {
  name: string;
  tokens: string[];
}

function buildGroups(): TokenGroup[] {
  const groups: TokenGroup[] = [];
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
          subKey === "line-height"
            ? "Line Height"
            : `Font ${capitalize(subKey)}`;
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

export function previewType(token: string) {
  if (token.startsWith("--color-")) return "color";
  if (token.startsWith("--border-radius-")) return "radius";
  if (token.startsWith("--scale-size-")) return "scale-size";
  if (token.startsWith("--font-size-")) return "font-size";
  if (token.startsWith("--font-weight-")) return "font-weight";
  if (token.startsWith("--font-family-")) return "font-family";
  if (token.startsWith("--font-line-height-")) return "line-height";
  return "text";
}

export const { descriptions: DESCRIPTIONS } = flattenTokenData(
  lightTokens as Json,
);

// Groups with deprecated tokens removed, ready for display or export.
export const tokenGroups: TokenGroup[] = buildGroups().map((group) => ({
  name: group.name,
  tokens: group.tokens.filter(
    (token) => !DESCRIPTIONS[token]?.startsWith("Deprecated:"),
  ),
}));
