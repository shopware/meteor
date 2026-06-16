import React from "react";

function Label({ children }) {
  return React.createElement(
    "span",
    {
      style: {
        display: "block",
        fontSize: 11,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--color-text-secondary-default)",
        fontFamily: "var(--font-family-body, sans-serif)",
        marginBottom: 10,
      },
    },
    children,
  );
}

function StateCard({ label, children }) {
  return React.createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      },
    },
    children,
    React.createElement(
      "span",
      {
        style: {
          fontSize: 12,
          color: "var(--color-text-secondary-default)",
          fontFamily: "var(--font-family-body, sans-serif)",
        },
      },
      label,
    ),
  );
}

const BUTTON_BASE = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 32,
  padding: "0 15px",
  borderRadius: "var(--border-radius-button)",
  fontSize: "var(--font-size-2xs)",
  fontWeight: "var(--font-weight-semibold)",
  fontFamily: "var(--font-family-body)",
  cursor: "pointer",
  border: "1px solid transparent",
  transition: "background 120ms ease, border-color 120ms ease",
  textDecoration: "none",
  userSelect: "none",
};

const buttonVariants = {
  resting: {
    background: "var(--color-interaction-primary-default)",
    borderColor: "var(--color-interaction-primary-default)",
    color: "#fff",
    outline: "none",
  },
  hover: {
    background: "var(--color-interaction-primary-hover)",
    borderColor: "var(--color-interaction-primary-hover)",
    color: "#fff",
    outline: "none",
  },
  focus: {
    background: "var(--color-interaction-primary-default)",
    borderColor: "var(--color-interaction-primary-default)",
    color: "#fff",
    outline: "2px solid var(--color-border-brand-default)",
    outlineOffset: "2px",
  },
  pressed: {
    background: "var(--color-interaction-primary-pressed)",
    borderColor: "var(--color-interaction-primary-pressed)",
    color: "#fff",
    outline: "none",
  },
  disabled: {
    background: "var(--color-interaction-primary-disabled)",
    borderColor: "var(--color-interaction-primary-disabled)",
    color: "rgba(255,255,255,0.55)",
    outline: "none",
    cursor: "not-allowed",
  },
};

const STATES = ["resting", "hover", "focus", "pressed", "disabled"];

export default function InteractionStates() {
  return React.createElement(
    "div",
    {
      style: {
        background: "var(--color-elevation-surface-raised)",
        borderRadius: 8,
        border: "1px solid var(--color-border-secondary-default)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        margin: "24px 0",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          alignItems: "flex-start",
        },
      },
      STATES.map((state) =>
        React.createElement(
          StateCard,
          { key: state, label: state.charAt(0).toUpperCase() + state.slice(1) },
          React.createElement(
            "button",
            {
              tabIndex: -1,
              disabled: state === "disabled",
              style: { ...BUTTON_BASE, ...buttonVariants[state] },
            },
            "Add product",
          ),
        ),
      ),
    ),
  );
}
