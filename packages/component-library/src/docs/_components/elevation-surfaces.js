import React from "react";

const CONTAINER_SIZE = 260;
const CARD_SIZE = 160;

// centerY = CONTAINER_SIZE - (bottomPct * CONTAINER_SIZE) - CARD_SIZE / 2
const SURFACE_TOKENS = [
  { token: "--color-elevation-surface-sunken", label: "Sunken", bottom: "18%", centerY: 133 },
  { token: "--color-elevation-surface-default", label: "Default", bottom: "30%", centerY: 102 },
  { token: "--color-elevation-surface-raised", label: "Raised", bottom: "42%", centerY: 71 },
];

function ThemePanel({ themeLabel }) {
  const labelColor = "var(--color-static-black)";
  const lineColor = "#e0e0e0";
  const captionColor = "var(--color-static-black)";

  return React.createElement(
    "div",
    {
      "data-theme": themeLabel,
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 16px",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          position: "relative",
          width: 340,
          height: CONTAINER_SIZE,
        },
      },
      // 3D scene
      React.createElement(
        "div",
        {
          style: {
            position: "absolute",
            left: 0,
            top: 0,
            width: CONTAINER_SIZE,
            height: CONTAINER_SIZE,
            perspective: "800px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        },
        SURFACE_TOKENS.map((t) =>
          React.createElement("div", {
            key: t.token,
            style: {
              position: "absolute",
              width: CARD_SIZE,
              height: CARD_SIZE,
              borderRadius: 12,
              background: `var(${t.token})`,
              border: "1px solid var(--color-border-secondary-default)",
              bottom: t.bottom,
              transform: "rotateX(45deg) rotateZ(-45deg)",
              transformStyle: "preserve-3d",
            },
          }),
        ),
      ),
      // Caption
      React.createElement(
        "span",
        {
          style: {
            position: "absolute",
            bottom: 0,
            left: 0,
            width: CONTAINER_SIZE,
            textAlign: "center",
            fontSize: 12,
            fontFamily: "var(--font-family-body, sans-serif)",
            color: captionColor,
          },
        },
        themeLabel === "dark" ? "Dark mode" : "Light mode",
      ),
      // Legend lines + labels
      SURFACE_TOKENS.map((t) =>
        React.createElement(
          "div",
          {
            key: t.token + "-legend",
            style: {
              position: "absolute",
              top: t.centerY,
              left: 256,
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 0,
            },
          },
          // dot
          React.createElement("div", {
            style: {
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: lineColor,
              flexShrink: 0,
            },
          }),
          // line
          React.createElement("div", {
            style: {
              width: 24,
              height: 1,
              background: lineColor,
              flexShrink: 0,
            },
          }),
          // label
          React.createElement(
            "span",
            {
              style: {
                paddingLeft: 6,
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "var(--font-family-body, sans-serif)",
                color: labelColor,
                whiteSpace: "nowrap",
              },
            },
            t.label,
          ),
        ),
      ),
    ),
  );
}

export default function ElevationSurfaces() {
  return React.createElement(
    "div",
    {
      style: {
        display: "flex",
        gap: 16,
        margin: "24px 0",
      },
    },
    React.createElement(ThemePanel, { themeLabel: "light" }),
    React.createElement(ThemePanel, { themeLabel: "dark" }),
  );
}
