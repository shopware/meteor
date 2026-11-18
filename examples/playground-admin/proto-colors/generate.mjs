// Prototype: writes src/assets/proto-colors.css, which maps the semantic tokens of Meteor onto
// the new primitive palettes, and prints the contrast of the main combinations.
// Run with `node proto-colors/generate.mjs` in examples/playground-admin.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  aliasTokens,
  coloredTokens,
  contrastPairs,
  contrastTokens,
  literalTokens,
  neutralTokens,
  newTokens,
  paletteNames,
  zincToNeutral,
} from "./mapping.mjs";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));
const readJson = (path) => JSON.parse(readFileSync(here(path), "utf8"));

const STEPS = [
  50,
  ...Array.from({ length: 19 }, (_, index) => (index + 1) * 100),
];
const WHITE = "#ffffff";
const BLACK = "#000000";

const palettes = readJson("./palettes.json");
const themes = {
  light: readJson(
    "../../../packages/tokens/dictionaries/administration/light.tokens.json",
  ),
  dark: readJson(
    "../../../packages/tokens/dictionaries/administration/dark.tokens.json",
  ),
};

function flatten(node, path = [], out = {}) {
  if (node && typeof node === "object" && "$value" in node) {
    out[path.join("-")] = node.$value;
  } else if (node && typeof node === "object") {
    for (const [key, child] of Object.entries(node))
      flatten(child, [...path, key], out);
  }
  return out;
}

const primitive = (palette, step) => `--color-${palette}-${step}`;
const hexOf = (palette, step) => palettes[palette][STEPS.indexOf(step)];

/** The new value of a token in a theme: a primitive, another semantic token or a literal. */
function mapToken(name, value, theme) {
  const colored = coloredTokens[name];
  if (colored) {
    const [palette, light, dark] = colored;
    return { primitive: [palette, theme === "light" ? light : dark] };
  }

  const aliased = aliasTokens[name];
  if (aliased) return { alias: aliased };

  const literal = literalTokens[name];
  if (literal) return { literal: theme === "light" ? literal[0] : literal[1] };

  const neutral = neutralTokens[name];
  if (neutral) return neutralEntry(theme === "light" ? neutral[0] : neutral[1]);

  const reference = /^\{color\.([a-z]+)\.(\d+)\}$/.exec(value);
  if (reference) {
    const [, palette, step] = reference;
    if (palette !== "zinc")
      throw new Error(`No mapping for ${name} (${value}) in ${theme}`);
    const neutral = zincToNeutral[step];
    return neutral === "white"
      ? { white: true }
      : { primitive: ["neutral", neutral] };
  }

  const alias = /^\{color\.(.+)\}$/.exec(value);
  if (alias) return { alias: alias[1].replaceAll(".", "-") };

  return { literal: value };
}

const mapped = {};
for (const [theme, dictionary] of Object.entries(themes)) {
  const tokens = flatten(dictionary.color);
  mapped[theme] = Object.fromEntries(
    Object.entries(tokens).map(([name, value]) => [
      name,
      mapToken(name, value, theme),
    ]),
  );
  // Proposed tokens that don't exist in the dictionaries yet.
  for (const [name, [light, dark]] of Object.entries(newTokens)) {
    mapped[theme][name] = neutralEntry(theme === "light" ? light : dark);
  }
}

/** A step such as 1850 sits halfway between two palette steps and is mixed in OKLCH. */
function neutralEntry(step) {
  if (step === "white") return { white: true };
  if (STEPS.includes(step)) return { primitive: ["neutral", step] };
  const lower = Math.floor(step / 100) * 100;
  return { mix: ["neutral", lower, lower + 100] };
}

function toOklab(hex) {
  const [r, g, b] = [1, 3, 5]
    .map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return (
    "#" +
    rgb
      .map((c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055))
      .map((c) =>
        Math.round(Math.min(1, Math.max(0, c)) * 255)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

/** Halfway between two steps, for the contrast report. */
const mixHex = (palette, a, b) => {
  const [x, y] = [toOklab(hexOf(palette, a)), toOklab(hexOf(palette, b))];
  return fromOklab(x.map((value, index) => (value + y[index]) / 2));
};

/** A declaration, wrapped the way Prettier formats a `var()` that doesn't fit in 80 columns. */
function declaration(name, value) {
  const line = `  --color-${name}: ${value};`;
  const single = /^var\((--[^)]+)\)$/.exec(value);
  if (line.length <= 80 || !single) return line;
  return `  --color-${name}: var(\n    ${single[1]}\n  );`;
}

const contrastMapped = Object.fromEntries(
  Object.keys(themes).map((theme) => [
    theme,
    Object.fromEntries(
      Object.entries(contrastTokens).map(([name, [light, dark]]) => [
        name,
        neutralEntry(theme === "light" ? light : dark),
      ]),
    ),
  ]),
);

function cssValue(entry) {
  if (entry.primitive) return `var(${primitive(...entry.primitive)})`;
  if (entry.mix) {
    const [palette, a, b] = entry.mix;
    // Wrapped the way Prettier formats it.
    return `color-mix(\n    in oklch,\n    var(${primitive(palette, a)}),\n    var(${primitive(palette, b)})\n  )`;
  }
  if (entry.white) return "var(--color-white)";
  if (entry.alias) return `var(--color-${entry.alias})`;
  // Wrapped the way Prettier formats a long color-mix().
  const mix = /^color-mix\((.*)\)$/.exec(entry.literal);
  if (mix) {
    const args = mix[1].split(/,\s*/);
    return `color-mix(\n${args.map((arg) => `    ${arg}`).join(",\n")}\n  )`;
  }
  return entry.literal;
}

function resolveHex(theme, name, seen = new Set(), variant = mapped) {
  const entry = variant[theme][name];
  if (!entry || seen.has(name)) return undefined;
  if (entry.primitive) return hexOf(...entry.primitive);
  if (entry.mix) return mixHex(...entry.mix);
  if (entry.white) return WHITE;
  if (entry.alias)
    return resolveHex(theme, entry.alias, new Set([...seen, name]), variant);
  return entry.literal;
}

const lines = [
  "/* Generated by proto-colors/generate.mjs. A prototype of the new color palettes, only for this",
  "   playground. Edit proto-colors/mapping.mjs and run the generator again instead of this file.",
  "   Applies while the root element has `data-proto-colors`. */",
  "",
  ":root[data-proto-colors] {",
  `  --color-white: ${WHITE};`,
  `  --color-black: ${BLACK};`,
];
for (const [palette, colors] of Object.entries(palettes)) {
  colors.forEach((hex, index) =>
    lines.push(`  ${primitive(palette, STEPS[index])}: ${hex.toLowerCase()};`),
  );
}
lines.push("");
for (const [name, entry] of Object.entries(mapped.light))
  lines.push(declaration(name, cssValue(entry)));
lines.push(
  "}",
  "",
  ':root[data-proto-colors][data-theme="dark"],',
  '[data-proto-colors] [data-theme="dark"] {',
);
for (const [name, entry] of Object.entries(mapped.dark))
  lines.push(declaration(name, cssValue(entry)));
lines.push(
  "}",
  "",
  "/* Contrast mode, on top of the new mapping. */",
  ':root[data-proto-colors="contrast"] {',
);
for (const [name, entry] of Object.entries(contrastMapped.light))
  lines.push(declaration(name, cssValue(entry)));
lines.push(
  "}",
  "",
  ':root[data-proto-colors="contrast"][data-theme="dark"],',
  '[data-proto-colors="contrast"] [data-theme="dark"] {',
);
for (const [name, entry] of Object.entries(contrastMapped.dark))
  lines.push(declaration(name, cssValue(entry)));
lines.push("}", "");

writeFileSync(here("../src/assets/proto-colors.css"), lines.join("\n"));

function luminance(hex) {
  const channels = [1, 3, 5].map(
    (index) => parseInt(hex.slice(index, index + 2), 16) / 255,
  );
  const [r, g, b] = channels.map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const contrastVariant = Object.fromEntries(
  Object.keys(themes).map((theme) => [
    theme,
    { ...mapped[theme], ...contrastMapped[theme] },
  ]),
);

for (const [label, variant] of [
  ["new", mapped],
  ["contrast", contrastVariant],
])
  for (const theme of Object.keys(themes)) {
    console.log(`\n${label}, ${theme}`);
    for (const [foreground, background, minimum] of contrastPairs) {
      const fg = resolveHex(theme, foreground, new Set(), variant);
      const bg = resolveHex(theme, background, new Set(), variant);
      const ratio = contrast(fg.slice(0, 7), bg.slice(0, 7));
      const mark = ratio >= minimum ? "ok  " : "FAIL";
      console.log(
        `  ${mark} ${ratio.toFixed(2).padStart(5)}  ${foreground} on ${background}`,
      );
    }
  }

console.log(`\nPalettes in use: ${Object.values(paletteNames).join(", ")}`);
