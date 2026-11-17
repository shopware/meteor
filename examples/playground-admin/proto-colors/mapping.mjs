// Prototype: maps the semantic tokens of Meteor onto the new primitive palettes.
// Principle of the new palettes: 1000 is the main color in the light theme and 800 in the dark
// theme, 50-200 are light backgrounds and 1600-1900 dark backgrounds.

/** The old zinc steps and the neutral step closest to them in lightness, used in both themes. */
export const zincToNeutral = {
  0: "white",
  50: 50,
  75: 200,
  100: 300,
  200: 400,
  300: 500,
  400: 600,
  500: 800,
  600: 1000,
  700: 1300,
  800: 1400,
  850: 1500,
  900: 1600,
  950: 1700,
  975: 1800,
  1000: 1900,
};

/**
 * Neutral tokens that don't follow `zincToNeutral`, as [light step, dark step].
 * Three elevation steps in both themes: sunken, default and raised. The light theme gets lighter
 * from sunken to raised, the dark theme too, from the darkest step up.
 * Borders, hovers and text follow the UI preview of the palette generator.
 */
export const neutralTokens = {
  // 1850 sits halfway between 1800 and 1900, mixed in OKLCH.
  "elevation-surface-sunken": [100, 1850],
  "elevation-surface-default": [50, 1800],
  "elevation-surface-raised": ["white", 1700],

  // One step darker than the default surface in the light theme, so it stays visible on it, and
  // 1500 in the dark theme, so it stands out on inputs and select lists (1600), for example for
  // the tags of a multi-select and the active result. Secondary text (800) on it is 4.38:1.
  "background-secondary-default": [100, 1500],

  "background-tertiary-default": [200, 1500],

  // One step lighter than the secondary border in the dark theme, for its higher emphasis.
  "border-primary-default": [300, 1400],
  // Open: in the light theme, neutral 200 is too light and 300 too dark. The palette needs a step
  // in between for this border. The prototype uses 200 for now.
  "border-secondary-default": [200, 1600],

  // Hover and pressed stand out on every surface they appear on: in the light theme on the app
  // background (sunken, 100), menus and cards; in the dark theme they get lighter than raised
  // (1700) and the resting secondary background (1600), for example on cards and select lists.
  "interaction-secondary-hover": [200, 1500],
  "interaction-secondary-pressed": [400, 1400],
  // Muted next to the resting state, so a disabled button doesn't look hovered or pressed. In the
  // dark theme 1500, like disabled fields (background-tertiary), so it stands out on cards (1700).
  "interaction-secondary-disabled": [100, 1500],

  "text-primary-default": [1700, 300],
  "icon-primary-default": [1700, 300],
  "text-secondary-default": [1000, 800],
  "icon-secondary-default": [1000, 800],
};

/** Tokens with a literal value, such as a color with transparency, as [light, dark]. */
export const literalTokens = {
  // Neutral 1900 with transparency: 40 % in the light theme, 90 % in the dark theme.
  "elevation-shadow-default": [
    "color-mix(in oklch, var(--color-neutral-1900) 10%, transparent)",
    "color-mix(in oklch, var(--color-neutral-1900) 10%, transparent)",
  ],
  "elevation-backdrop-default": [
    "color-mix(in oklch, var(--color-neutral-1900) 40%, transparent)",
    "color-mix(in oklch, var(--color-neutral-1900) 90%, transparent)",
  ],
};

/** The old palettes and the new palettes that replace them. */
export const paletteNames = {
  zinc: "neutral",
  brand: "brand",
  red: "red",
  orange: "orange",
  green: "green",
  purple: "purple",
};

/**
 * The colored tokens, as [palette, light step, dark step]. Following the UI preview of the palette
 * generator, hover and pressed get darker in both themes, and the borders of attention, positive and
 * accent are subtle (300 and 1400). Brand and critical borders stay strong, because they also mark
 * focus, selection and errors; banners and badges get subtle ones in proto-overrides.css.
 * Status backgrounds are 100 and 1600, where the status text keeps 4.5:1 in every palette.
 * Filled controls such as buttons and checkboxes keep 1000 in the dark theme too, where white on
 * 1000 has enough contrast.
 * Brand 1000 on brand 200 is 4.17:1, a known exception of the main brand color.
 */
export const coloredTokens = {
  "interaction-primary-default": ["brand", 1000, 1000],
  "interaction-primary-hover": ["brand", 1100, 1100],
  "interaction-primary-pressed": ["brand", 1200, 1200],
  "interaction-primary-disabled": ["brand", 600, 1400],

  "interaction-critical-default": ["red", 1000, 1000],
  "interaction-critical-hover": ["red", 1100, 1100],
  "interaction-critical-pressed": ["red", 1200, 1200],
  "interaction-critical-disabled": ["red", 500, 1400],

  "background-brand-default": ["brand", 200, 1600],
  "background-critical-default": ["red", 100, 1600],
  "background-attention-default": ["orange", 100, 1600],
  "background-positive-default": ["green", 100, 1600],
  "background-accent-default": ["purple", 100, 1600],

  "icon-brand-default": ["brand", 1000, 1000],
  "icon-brand-hover": ["brand", 1100, 1100],
  "icon-brand-pressed": ["brand", 1200, 1200],
  "icon-brand-disabled": ["brand", 600, 1300],
  "icon-critical-default": ["red", 1000, 800],
  "icon-critical-hover": ["red", 1100, 900],
  "icon-critical-disabled": ["red", 600, 1400],
  "icon-attention-default": ["orange", 1000, 800],
  "icon-attention-disabled": ["orange", 600, 1400],
  "icon-positive-default": ["green", 1000, 800],
  "icon-positive-disabled": ["green", 600, 1400],
  "icon-accent-default": ["purple", 1000, 800],
  "icon-accent-disabled": ["purple", 600, 1400],

  "border-brand-default": ["brand", 1000, 800],
  "border-brand-disabled": ["brand", 600, 1300],
  "border-critical-default": ["red", 1000, 800],
  "border-critical-dark": ["red", 1200, 1200],
  "border-critical-disabled": ["red", 600, 1300],
  "border-attention-default": ["orange", 300, 1400],
  "border-positive-default": ["green", 300, 1400],
  "border-accent-default": ["purple", 300, 1400],

  "text-brand-default": ["brand", 1000, 800],
  "text-brand-hover": ["brand", 1100, 900],
  "text-brand-pressed": ["brand", 1200, 1000],
  "text-brand-disabled": ["brand", 600, 1300],
  "text-brand-inverse": ["brand", 700, 1000],
  "text-critical-default": ["red", 1000, 800],
  "text-critical-hover": ["red", 1100, 900],
  "text-critical-pressed": ["red", 1200, 1000],
  "text-critical-disabled": ["red", 600, 1300],
  "text-attention-default": ["orange", 1000, 800],
  "text-positive-default": ["green", 1000, 800],
  "text-accent-default": ["purple", 1000, 800],
};

/** Pairs whose contrast the generator reports, as [text or UI token, background token, minimum]. */
export const contrastPairs = [
  ["text-primary-default", "elevation-surface-default", 4.5],
  ["text-primary-default", "elevation-surface-sunken", 4.5],
  ["text-primary-default", "background-tertiary-default", 4.5],
  ["text-secondary-default", "elevation-surface-default", 4.5],
  ["text-secondary-default", "background-secondary-default", 4.5],
  ["text-primary-inverse", "elevation-floating-default", 4.5],
  ["text-brand-default", "elevation-surface-default", 4.5],
  ["text-brand-hover", "elevation-surface-default", 4.5],
  ["text-brand-default", "background-brand-default", 4.5],
  ["text-brand-inverse", "elevation-floating-default", 4.5],
  ["text-critical-default", "elevation-surface-default", 4.5],
  ["text-critical-default", "background-critical-default", 4.5],
  ["text-attention-default", "background-attention-default", 4.5],
  ["text-positive-default", "background-positive-default", 4.5],
  ["text-accent-default", "background-accent-default", 4.5],
  ["text-static-default", "interaction-primary-default", 4.5],
  ["text-static-default", "interaction-primary-hover", 4.5],
  ["text-static-default", "interaction-critical-default", 4.5],
  ["text-primary-default", "interaction-secondary-default", 4.5],
  ["icon-primary-default", "elevation-surface-default", 3],
  ["icon-secondary-default", "elevation-surface-default", 3],
  ["icon-brand-default", "elevation-surface-default", 3],
  ["icon-critical-default", "background-critical-default", 3],
  ["icon-attention-default", "background-attention-default", 3],
  ["icon-positive-default", "background-positive-default", 3],
  ["icon-accent-default", "background-accent-default", 3],
  ["border-brand-default", "elevation-surface-default", 3],
  ["border-primary-default", "elevation-surface-default", 3],
];
