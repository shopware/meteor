import React, { useCallback, useEffect, useState } from "react";
import lightTokens from "../../../../tokens/dictionaries/administration/light.tokens.json";
import darkTokens from "../../../../tokens/dictionaries/administration/dark.tokens.json";
import primitives from "../../../../tokens/dictionaries/foundation/primitives.tokens.json";

function flattenTokenData(obj, prefix = "") {
  const descriptions = {};
  const values = {};
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

const { descriptions: TOKEN_DESCRIPTIONS, values: TOKEN_VALUES_LIGHT } =
  flattenTokenData(lightTokens);
const { values: TOKEN_VALUES_DARK } = flattenTokenData(darkTokens);

// Collect CSS var names for all leaf tokens under a given object.
function collectTokenKeys(obj, prefix) {
  const result = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = `${prefix}-${k}`;
    if (v && typeof v === "object" && "$value" in v) {
      result.push(key);
    } else if (v && typeof v === "object") {
      result.push(...collectTokenKeys(v, key));
    }
  }
  return result;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Derived from the token JSON files — updates automatically when tokens change.
function buildTokenGroups() {
  const groups = [];

  for (const [topKey, topVal] of Object.entries(lightTokens)) {
    const prefix = `--${topKey}`;

    if (topKey === "color") {
      for (const [subKey, subVal] of Object.entries(topVal)) {
        groups.push({
          name: capitalize(subKey).replace(/-/g, " "),
          tokens: collectTokenKeys(subVal, `${prefix}-${subKey}`),
        });
      }
    } else if (topKey === "font") {
      for (const [subKey, subVal] of Object.entries(topVal)) {
        const name = subKey === "line-height" ? "Line Height" : `Font ${capitalize(subKey)}`;
        groups.push({
          name,
          tokens: collectTokenKeys(subVal, `${prefix}-${subKey}`),
        });
      }
    } else {
      groups.push({
        name: topKey.split("-").map(capitalize).join(" "),
        tokens: collectTokenKeys(topVal, prefix),
      });
    }
  }

  // Scale tokens live in primitives, not in the semantic token files.
  if (primitives?.scale?.size) {
    groups.push({
      name: "Scale",
      tokens: Object.keys(primitives.scale.size).map((k) => `--scale-size-${k}`),
    });
  }

  return groups;
}

const TOKEN_GROUPS = buildTokenGroups();

function previewType(token) {
  if (token.startsWith("--color-")) return "color";
  if (token.startsWith("--border-radius-")) return "radius";
  if (token.startsWith("--scale-size-")) return "scale-size";
  if (token.startsWith("--font-size-")) return "font-size";
  if (token.startsWith("--font-weight-")) return "font-weight";
  if (token.startsWith("--font-family-")) return "font-family";
  if (token.startsWith("--font-line-height-")) return "line-height";
  return "text";
}

function ColorSwatch({ token, value, label }) {
  const isTransparent =
    value && (value.includes("rgba") || value.endsWith("00") || value.includes("0 0 0 0"));
  return React.createElement(
    "div",
    { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 3 } },
    React.createElement("div", {
      "data-theme": label === "dark" ? "dark" : undefined,
      style: {
        width: 28,
        height: 28,
        borderRadius: 4,
        backgroundColor: `var(${token})`,
        border: "1px solid rgba(0, 0, 0, 0.1)",
        backgroundImage: isTransparent
          ? "repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 0 0 / 8px 8px"
          : undefined,
      },
    }),
    React.createElement(
      "span",
      {
        style: {
          fontSize: 9,
          color: "var(--color-text-secondary-default)",
          fontFamily: "var(--font-family-body, sans-serif)",
          letterSpacing: "0.02em",
        },
      },
      label,
    ),
  );
}

function Preview({ token, lightValue, darkValue, primitiveLightToken, primitiveDarkToken }) {
  const type = previewType(token);
  const size = 32;

  if (type === "color") {
    return React.createElement(
      "div",
      {
        style: { display: "flex", gap: 6, flexShrink: 0 },
      },
      React.createElement(ColorSwatch, {
        token,
        value: lightValue,
        label: "light",
        primitiveToken: primitiveLightToken,
      }),
      React.createElement(ColorSwatch, {
        token,
        value: darkValue,
        label: "dark",
        primitiveToken: primitiveDarkToken,
      }),
    );
  }

  if (type === "radius") {
    const isRound = token.includes("round");
    return React.createElement("div", {
      style: {
        width: size,
        height: size,
        borderRadius: isRound ? "50%" : `var(${token})`,
        backgroundColor: "var(--color-background-brand-default)",
        border: "2px solid var(--color-border-brand-default)",
        flexShrink: 0,
      },
    });
  }

  if (type === "scale-size") {
    return React.createElement(
      "div",
      {
        style: {
          width: 64,
          height: size,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        },
      },
      React.createElement("div", {
        style: {
          height: 6,
          width: `var(${token})`,
          maxWidth: 64,
          minWidth: lightValue === "0rem" ? 2 : undefined,
          backgroundColor: "var(--color-interaction-primary-default)",
          borderRadius: 3,
        },
      }),
    );
  }

  if (type === "font-size") {
    return React.createElement(
      "div",
      {
        style: {
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
        },
      },
      React.createElement(
        "span",
        {
          style: {
            fontSize: `var(${token})`,
            lineHeight: 1,
            fontWeight: 500,
            color: "var(--color-text-primary-default)",
          },
        },
        "Aa",
      ),
    );
  }

  if (type === "font-weight") {
    return React.createElement(
      "div",
      {
        style: {
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        },
      },
      React.createElement(
        "span",
        {
          style: {
            fontSize: 14,
            fontWeight: `var(${token})`,
            color: "var(--color-text-primary-default)",
          },
        },
        "Aa",
      ),
    );
  }

  if (type === "font-family") {
    return React.createElement(
      "div",
      {
        style: {
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        },
      },
      React.createElement(
        "span",
        {
          style: {
            fontSize: 13,
            fontFamily: `var(${token})`,
            color: "var(--color-text-primary-default)",
          },
        },
        "Aa",
      ),
    );
  }

  if (type === "line-height") {
    const barStyle = {
      height: 2,
      width: size,
      backgroundColor: "var(--color-interaction-primary-default)",
      borderRadius: 1,
    };
    return React.createElement(
      "div",
      { style: { width: size, flexShrink: 0 } },
      React.createElement("div", { style: { ...barStyle, marginBottom: `var(${token})` } }),
      React.createElement("div", { style: barStyle }),
    );
  }

  return React.createElement("div", { style: { width: size, height: size, flexShrink: 0 } });
}

function ValueBadge({ value }) {
  return React.createElement(
    "span",
    {
      style: {
        fontFamily: "var(--font-family-body, monospace)",
        fontSize: 11,
        color: "var(--color-text-secondary-default)",
        background: "var(--color-background-secondary-default)",
        border: "1px solid var(--color-border-secondary-default)",
        borderRadius: 4,
        padding: "1px 6px",
        whiteSpace: "nowrap",
      },
    },
    value,
  );
}

function TokenRow({
  token,
  description,
  lightValue,
  darkValue,
  primitiveLightToken,
  primitiveDarkToken,
  onCopy,
  isLast,
}) {
  const isColor = previewType(token) === "color";
  const displayLight = isColor ? primitiveLightToken || lightValue : lightValue;
  const displayDark = isColor
    ? primitiveDarkToken || darkValue
    : lightValue !== darkValue && darkValue
      ? darkValue
      : null;

  return React.createElement(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: "0 16px",
        alignItems: "center",
        padding: "8px 16px",
        borderBottom: isLast ? "none" : "1px solid var(--color-border-secondary-default)",
      },
    },
    React.createElement(Preview, {
      token,
      lightValue,
      darkValue,
      primitiveLightToken,
      primitiveDarkToken,
    }),
    React.createElement(
      "div",
      { style: { minWidth: 0 } },
      React.createElement(
        "button",
        {
          onClick: () => onCopy(token),
          onMouseEnter: (e) => {
            e.currentTarget.style.textDecoration = "underline";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.textDecoration = "none";
          },
          title: `Copy var(${token})`,
          style: {
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            fontFamily: "var(--font-family-body, monospace)",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--color-text-primary-default)",
            textDecoration: "none",
            display: "block",
            textAlign: "left",
            marginBottom: 4,
          },
        },
        token,
      ),
      description
        ? React.createElement(
            "span",
            {
              style: {
                fontSize: 12,
                color: "var(--color-text-secondary-default)",
                display: "block",
                marginTop: 1,
              },
            },
            description,
          )
        : null,
    ),
    !isColor
      ? React.createElement(
          "div",
          {
            style: { display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-end" },
          },
          displayLight ? React.createElement(ValueBadge, { value: displayLight }) : null,
          displayDark ? React.createElement(ValueBadge, { value: displayDark }) : null,
        )
      : React.createElement("div", { style: { width: 0 } }),
  );
}

function TokenGroup({ name, tokens, lightValues, darkValues, onCopy }) {
  return React.createElement(
    "div",
    {
      style: { marginBottom: 40 },
    },
    React.createElement(
      "div",
      {
        style: {
          border: "1px solid #e2e3e9",
          borderRadius: 8,
          overflow: "hidden",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            fontFamily: "var(--font-family-body, sans-serif)",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--color-text-primary-default)",
            padding: "0.75rem 1rem",
            backgroundColor: "#fafbfe",
            borderBottom: "1px solid #e2e3e9",
            margin: 0,
          },
        },
        name,
      ),
      (() => {
        const visible = tokens.filter((t) => !TOKEN_DESCRIPTIONS[t]?.startsWith("Deprecated:"));
        return visible.map((t, i) =>
          React.createElement(TokenRow, {
            key: t,
            token: t,
            description: TOKEN_DESCRIPTIONS[t] || "",
            lightValue: lightValues[t] || "",
            darkValue: darkValues[t] || "",
            primitiveLightToken: TOKEN_VALUES_LIGHT[t] || "",
            primitiveDarkToken: TOKEN_VALUES_DARK[t] || "",
            onCopy,
            isLast: i === visible.length - 1,
          }),
        );
      })(),
    ),
  );
}

function resolveValues() {
  const lightStyle = getComputedStyle(document.documentElement);

  const darkEl = document.createElement("div");
  darkEl.setAttribute("data-theme", "dark");
  darkEl.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
  document.body.appendChild(darkEl);
  const darkStyle = getComputedStyle(darkEl);

  const light = {};
  const dark = {};

  TOKEN_GROUPS.forEach(({ tokens }) => {
    tokens.forEach((token) => {
      light[token] = lightStyle.getPropertyValue(token).trim();
      dark[token] = darkStyle.getPropertyValue(token).trim();
    });
  });

  document.body.removeChild(darkEl);
  return { light, dark };
}

function notify(message) {
  document.dispatchEvent(new CustomEvent("meteor-docs:snackbar", { detail: { message } }));
}

export default function TokenBrowser() {
  const [values, setValues] = useState({ light: {}, dark: {} });

  useEffect(() => {
    setValues(resolveValues());
  }, []);

  const handleCopy = useCallback((token) => {
    navigator.clipboard
      .writeText(`var(${token})`)
      .then(() => notify(`Copied var(${token})`))
      .catch(() => {});
  }, []);

  return React.createElement(
    "div",
    { style: { marginTop: 24 } },
    TOKEN_GROUPS.map((group) =>
      React.createElement(TokenGroup, {
        key: group.name,
        name: group.name,
        tokens: group.tokens,
        lightValues: values.light,
        darkValues: values.dark,
        onCopy: handleCopy,
      }),
    ),
  );
}
