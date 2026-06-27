// Pure token-dictionary helpers shared by the TokenBrowser component and the
// raw/llms markdown export (server/utils/transformMeteorMdc). The component adds
// runtime CSS-variable resolution on top; the export uses the grouping and
// descriptions to emit markdown tables.
import lightTokens from "@tokens-dict/administration/light.tokens.json";
import primitives from "@tokens-dict/foundation/primitives.tokens.json";

// A token dictionary is a tree of groups whose leaves carry a $value (and an
// optional $description). The imported JSON is cast to this shape at the entry
// points below.
interface TokenLeaf {
  $value: string | number;
  $description?: string;
}
type TokenNode = TokenLeaf | { [key: string]: TokenNode };
type TokenTree = { [key: string]: TokenNode };

const isLeaf = (node: TokenNode): node is TokenLeaf =>
  typeof node === "object" && node !== null && "$value" in node;

// Flatten a token dictionary into { cssVar -> description } and, for tokens
// whose value references another token, { cssVar -> referenced cssVar }.
export function flattenTokenData(obj: TokenTree, prefix = "") {
  const descriptions: Record<string, string> = {};
  const values: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    const cssVar = "--" + key.replace(/\./g, "-");
    if (isLeaf(v)) {
      descriptions[cssVar] = v.$description || "";
      const raw = v.$value;
      if (typeof raw === "string" && raw.startsWith("{") && raw.endsWith("}")) {
        values[cssVar] = "--" + raw.slice(1, -1).replace(/\./g, "-");
      }
    } else {
      const nested = flattenTokenData(v, key);
      Object.assign(descriptions, nested.descriptions);
      Object.assign(values, nested.values);
    }
  }
  return { descriptions, values };
}

function collectTokenKeys(obj: TokenTree, prefix: string): string[] {
  const result: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = `${prefix}-${k}`;
    if (isLeaf(v)) result.push(key);
    else result.push(...collectTokenKeys(v, key));
  }
  return result;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export interface TokenGroup {
  name: string;
  tokens: string[];
}

// The JSON modules are typed by TS as their concrete inferred shape; assert the
// token-tree shape once here.
const lightTree = lightTokens as unknown as TokenTree;

// A top-level dictionary entry is always a group (never a leaf), so descending
// into it yields another TokenTree.
const asTree = (node: TokenNode): TokenTree => node as TokenTree;

function buildGroups(): TokenGroup[] {
  const groups: TokenGroup[] = [];
  for (const [topKey, topVal] of Object.entries(lightTree)) {
    const prefix = `--${topKey}`;
    if (topKey === "color") {
      for (const [subKey, subVal] of Object.entries(asTree(topVal))) {
        groups.push({
          name: capitalize(subKey).replace(/-/g, " "),
          tokens: collectTokenKeys(asTree(subVal), `${prefix}-${subKey}`),
        });
      }
    } else if (topKey === "font") {
      for (const [subKey, subVal] of Object.entries(asTree(topVal))) {
        const name =
          subKey === "line-height"
            ? "Line Height"
            : `Font ${capitalize(subKey)}`;
        groups.push({
          name,
          tokens: collectTokenKeys(asTree(subVal), `${prefix}-${subKey}`),
        });
      }
    } else {
      groups.push({
        name: topKey.split("-").map(capitalize).join(" "),
        tokens: collectTokenKeys(asTree(topVal), prefix),
      });
    }
  }
  const scale = (
    primitives as unknown as { scale?: { size?: Record<string, unknown> } }
  )?.scale?.size;
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

export const { descriptions: DESCRIPTIONS } = flattenTokenData(lightTree);

// Groups with deprecated tokens removed, ready for display or export.
export const tokenGroups: TokenGroup[] = buildGroups().map((group) => ({
  name: group.name,
  tokens: group.tokens.filter(
    (token) => !DESCRIPTIONS[token]?.startsWith("Deprecated:"),
  ),
}));
