import lightTokenCss from "@shopware-ag/meteor-tokens/administration/light.css?raw";
import darkTokenCss from "@shopware-ag/meteor-tokens/administration/dark.css?raw";
import primitives from "@shopware-ag/meteor-tokens/foundation/primitives.json";

function parseCssTokens(css: string) {
  const values: Record<string, string> = {};
  const varPattern = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let match: RegExpExecArray | null;

  while ((match = varPattern.exec(css))) {
    const token = match[1];
    const value = match[2];
    if (token && value) {
      values[token] = value.trim();
    }
  }

  return values;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatGroupName(str: string) {
  return str.split("-").map(capitalize).join(" ");
}

export interface TokenGroup {
  name: string;
  tokens: string[];
}

const lightValues = parseCssTokens(lightTokenCss);
const darkValues = parseCssTokens(darkTokenCss);
const tokenNames = Object.keys(lightValues);

// Derived from the package's exported CSS custom properties.
function buildTokenGroups(tokens: string[]): TokenGroup[] {
  const groups: TokenGroup[] = [];
  const pushGroup = (name: string, groupTokens: string[]) => {
    if (groupTokens.length > 0) {
      groups.push({ name, tokens: groupTokens });
    }
  };

  const colorGroups = new Set(
    tokens
      .filter((token) => token.startsWith("--color-"))
      .flatMap((token) => {
        const group = token.replace("--color-", "").split("-")[0];
        return group ? [group] : [];
      }),
  );

  for (const colorGroup of colorGroups) {
    pushGroup(
      formatGroupName(colorGroup),
      tokens.filter((token) => token.startsWith(`--color-${colorGroup}-`)),
    );
  }

  pushGroup(
    "Font Family",
    tokens.filter((token) => token.startsWith("--font-family-")),
  );
  pushGroup(
    "Font Size",
    tokens.filter((token) => token.startsWith("--font-size-")),
  );
  pushGroup(
    "Font Weight",
    tokens.filter((token) => token.startsWith("--font-weight-")),
  );
  pushGroup(
    "Line Height",
    tokens.filter((token) => token.startsWith("--font-line-height-")),
  );
  pushGroup(
    "Border Radius",
    tokens.filter((token) => token.startsWith("--border-radius-")),
  );

  // Scale tokens live in primitives, not in the semantic token files.
  const scaleSizes = (primitives as Record<string, Record<string, unknown>>)
    ?.scale?.size;
  if (scaleSizes) {
    groups.push({
      name: "Scale",
      tokens: Object.keys(scaleSizes).map((k) => `--scale-size-${k}`),
    });
  }

  return groups;
}

export function useTokenDictionary() {
  const descriptions: Record<string, string> = {};

  return {
    descriptions,
    lightAliases: lightValues,
    darkAliases: darkValues,
    groups: buildTokenGroups(tokenNames),
    primitives: primitives as Record<string, unknown>,
  };
}
