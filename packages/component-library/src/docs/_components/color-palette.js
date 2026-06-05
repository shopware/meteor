import React, { useCallback, useEffect, useState } from "react";
import primitives from "../../../../tokens/dictionaries/foundation/primitives.tokens.json";

// Derived from primitives.tokens.json — updates automatically when the token file changes.
const PALETTE_DEFINITIONS = Object.entries(primitives.color).map(([name, steps]) => ({
  name: name.charAt(0).toUpperCase() + name.slice(1),
  prefix: `--color-${name}`,
  steps: Object.keys(steps).map(Number),
}));

function resolveTokens() {
  const style = getComputedStyle(document.documentElement);
  return PALETTE_DEFINITIONS.map(({ name, prefix, steps }) => ({
    name,
    swatches: steps.map((step) => {
      const token = `${prefix}-${step}`;
      const hex = style.getPropertyValue(token).trim();
      return { token, hex };
    }),
  }));
}

function luminance(r, g, b) {
  return r * 0.299 + g * 0.587 + b * 0.114;
}

function isLight(color) {
  if (!color) return true;
  const hex = color.trim();
  if (hex.startsWith("#") && hex.length >= 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return luminance(r, g, b) > 160;
  }
  const rgb = hex.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgb) return luminance(Number(rgb[1]), Number(rgb[2]), Number(rgb[3])) > 160;
  return true;
}

function getStep(token) {
  const match = token.match(/(\d+)$/);
  return match ? match[1] : token;
}

function notify(message) {
  document.dispatchEvent(new CustomEvent("meteor-docs:snackbar", { detail: { message } }));
}

function Swatch({ token, hex, onCopy }) {
  const light = isLight(hex);
  const textColor = light ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.9)";
  const mutedColor = light ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.55)";
  const step = getStep(token);

  return React.createElement(
    "div",
    {
      style: {
        backgroundColor: hex,
        padding: "9px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      },
    },
    React.createElement(
      "button",
      {
        onClick: () => onCopy(`var(${token})`),
        title: `Copy var(${token})`,
        onMouseEnter: (e) => {
          e.currentTarget.style.textDecoration = "underline";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.textDecoration = "none";
        },
        style: {
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontFamily: "var(--font-family-body, monospace)",
          fontSize: 12,
          fontWeight: 500,
          color: textColor,
          letterSpacing: "0.01em",
          textDecoration: "none",
        },
      },
      step,
    ),
    React.createElement(
      "button",
      {
        onClick: () => onCopy(hex),
        title: `Copy ${hex}`,
        onMouseEnter: (e) => {
          e.currentTarget.style.textDecoration = "underline";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.textDecoration = "none";
        },
        style: {
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontFamily: "var(--font-family-body, monospace)",
          fontSize: 11,
          color: mutedColor,
          textDecoration: "none",
        },
      },
      hex,
    ),
  );
}

function Palette({ name, swatches, onCopy }) {
  return React.createElement(
    "div",
    { style: { minWidth: 0 } },
    React.createElement(
      "div",
      {
        style: {
          fontFamily: "var(--font-family-body, sans-serif)",
          fontSize: 13,
          fontWeight: 600,
          color: "var(--color-text-primary-default)",
          marginBottom: 8,
        },
      },
      name,
    ),
    React.createElement(
      "div",
      {
        style: {
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid var(--color-border-secondary-default)",
        },
      },
      swatches.map((s) =>
        React.createElement(Swatch, { key: s.token, token: s.token, hex: s.hex, onCopy }),
      ),
    ),
  );
}

export default function ColorPalette() {
  const [palettes, setPalettes] = useState([]);

  useEffect(() => {
    setPalettes(resolveTokens());
  }, []);

  const handleCopy = useCallback((value) => {
    navigator.clipboard
      .writeText(value)
      .then(() => notify(`Copied ${value}`))
      .catch(() => {});
  }, []);

  return React.createElement(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 24,
        margin: "24px 0",
      },
    },
    palettes.map((p) =>
      React.createElement(Palette, {
        key: p.name,
        name: p.name,
        swatches: p.swatches,
        onCopy: handleCopy,
      }),
    ),
  );
}
