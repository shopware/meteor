import React, { useEffect, useState } from "react";
import lightTokens from "../../../../tokens/dictionaries/administration/light.tokens.json";

// Derived from the token JSON — updates automatically when the token file changes.
const SIZES = Object.keys(lightTokens.font.size).map((label) => ({
  label,
  token: `--font-size-${label}`,
  lineHeight: `--font-line-height-${label}`,
}));

const WEIGHTS = Object.keys(lightTokens.font.weight).map((label) => ({
  token: `--font-weight-${label}`,
  label: label.charAt(0).toUpperCase() + label.slice(1),
}));

function resolveToken(token) {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

const wrapperStyle = {
  margin: "var(--scale-size-24) 0",
  border: "1px solid var(--color-border-secondary-default)",
  borderRadius: 8,
  overflow: "hidden",
};

const rowStyle = (last) => ({
  display: "grid",
  gridTemplateColumns: "10rem 1fr",
  alignItems: "baseline",
  gap: "var(--scale-size-16)",
  padding: "var(--scale-size-12) var(--scale-size-16)",
  borderBottom: last ? "none" : "1px solid var(--color-border-secondary-default)",
  backgroundColor: "var(--color-elevation-surface-default)",
});

const metaStyle = {
  fontFamily: "var(--font-family-body)",
  fontSize: "var(--font-size-xs)",
  lineHeight: "var(--font-line-height-xs)",
  color: "var(--color-text-secondary-default)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--scale-size-2)",
};

const tokenStyle = {
  fontFamily: "monospace",
  fontSize: "var(--font-size-2xs)",
  color: "var(--color-text-primary-default)",
};

const headingStyle = {
  fontFamily: "var(--font-family-body)",
  fontSize: 16,
  fontWeight: 600,
  color: "var(--color-text-primary-default)",
  padding: "0.75rem 1rem",
  backgroundColor: "#fafbfe",
  borderBottom: "1px solid #e2e3e9",
  margin: 0,
};

function SectionHeader({ children }) {
  return React.createElement("div", { style: headingStyle }, children);
}

function SizeRow({ label, token, lineHeight, resolvedPx, last }) {
  return React.createElement("div", { style: rowStyle(last) }, [
    React.createElement("div", { key: "meta", style: metaStyle }, [
      React.createElement(
        "span",
        {
          key: "label",
          style: {
            ...tokenStyle,
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            fontSize: "var(--font-size-s)",
            color: "var(--color-text-primary-default)",
          },
        },
        label,
      ),
      React.createElement("span", { key: "px" }, resolvedPx),
    ]),
    React.createElement(
      "span",
      {
        key: "sample",
        style: {
          fontFamily: "var(--font-family-body)",
          fontSize: `var(${token})`,
          lineHeight: `var(${lineHeight})`,
          fontWeight: "var(--font-weight-regular)",
          color: "var(--color-text-primary-default)",
        },
      },
      "The quick brown fox jumps over the lazy dog",
    ),
  ]);
}

function WeightRow({ token, label, resolvedValue, last }) {
  return React.createElement("div", { style: rowStyle(last) }, [
    React.createElement("div", { key: "meta", style: metaStyle }, [
      React.createElement(
        "span",
        {
          key: "label",
          style: {
            ...tokenStyle,
            fontFamily: "var(--font-family-body)",
            fontWeight: "var(--font-weight-semibold)",
            fontSize: "var(--font-size-s)",
            color: "var(--color-text-primary-default)",
          },
        },
        label,
      ),
      React.createElement("span", { key: "value" }, resolvedValue),
    ]),
    React.createElement(
      "span",
      {
        key: "sample",
        style: {
          fontFamily: "var(--font-family-body)",
          fontSize: "var(--font-size-m)",
          lineHeight: "var(--font-line-height-m)",
          fontWeight: `var(${token})`,
          color: "var(--color-text-primary-default)",
        },
      },
      "The quick brown fox jumps over the lazy dog",
    ),
  ]);
}

export default function TypographyScale() {
  const [resolved, setResolved] = useState({});

  useEffect(() => {
    const values = {};
    for (const { token } of SIZES) {
      values[token] = resolveToken(token);
    }
    for (const { token } of WEIGHTS) {
      values[token] = resolveToken(token);
    }
    setResolved(values);
  }, []);

  return React.createElement("div", null, [
    React.createElement("div", { key: "sizes", style: wrapperStyle }, [
      React.createElement(SectionHeader, { key: "header" }, "Size scale"),
      ...SIZES.map((s, i) =>
        React.createElement(SizeRow, {
          key: s.token,
          ...s,
          resolvedPx: resolved[s.token] ?? "",
          last: i === SIZES.length - 1,
        }),
      ),
    ]),
    React.createElement(
      "div",
      { key: "weights", style: { ...wrapperStyle, marginTop: "var(--scale-size-16)" } },
      [
        React.createElement(SectionHeader, { key: "header" }, "Weights"),
        ...WEIGHTS.map((w, i) =>
          React.createElement(WeightRow, {
            key: w.token,
            ...w,
            resolvedValue: resolved[w.token] ?? "",
            last: i === WEIGHTS.length - 1,
          }),
        ),
      ],
    ),
  ]);
}
