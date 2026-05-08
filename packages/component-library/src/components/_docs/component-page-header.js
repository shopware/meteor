import { Markdown } from "@storybook/blocks";
import React from "react";

const STATUS_VARIANTS = {
  available: {
    label: "Available",
    backgroundColor: "var(--color-background-positive-default)",
    borderColor: "var(--color-border-positive-default)",
    indicatorColor: "var(--color-icon-positive-default)",
  },
  experimental: {
    label: "Experimental",
    backgroundColor: "var(--color-background-attention-default)",
    borderColor: "var(--color-border-attention-default)",
    indicatorColor: "var(--color-icon-attention-default)",
  },
  deprecated: {
    label: "Deprecated",
    backgroundColor: "var(--color-background-critical-default)",
    borderColor: "var(--color-border-critical-default)",
    indicatorColor: "var(--color-icon-critical-default)",
  },
};

const containerStyle = {
  margin: "var(--scale-size-12) 0",
};

const statusContainerStyle = {
  marginTop: "var(--scale-size-12)",
};

const statusHeaderStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--scale-size-12)",
  flexWrap: "wrap",
};

const statusInfoStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--scale-size-6)",
};

const labelStyle = {
  fontFamily: "inherit",
  fontSize: "inherit",
  lineHeight: "inherit",
  fontWeight: "inherit",
  color: "var(--color-text-primary-default)",
};

const titleTagStyle = {
  color: "var(--color-text-secondary-default)",
  fontWeight: "var(--font-weight-regular)",
};

const badgeStyle = (variant) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--scale-size-4)",
  height: "var(--scale-size-20)",
  padding: "0 var(--scale-size-8)",
  borderRadius: "var(--border-radius-round)",
  border: `1px solid ${variant.borderColor}`,
  backgroundColor: variant.backgroundColor,
  color: "var(--color-text-primary-default)",
  fontFamily: "var(--font-family-body)",
  fontSize: "var(--font-size-2xs)",
  lineHeight: "var(--font-line-height-2xs)",
  fontWeight: "var(--font-weight-medium)",
});

const sourceLinkStyle = {
  borderLeft: "1px solid var(--color-border-secondary-default)",
  color: "var(--color-text-brand-default)",
  paddingLeft: "var(--scale-size-16)",
  textDecoration: "underline",
};

const indicatorStyle = (variant) => ({
  width: "var(--scale-size-8)",
  height: "var(--scale-size-8)",
  borderRadius: "var(--border-radius-l)",
  backgroundColor: variant.indicatorColor,
  flexShrink: 0,
});

const codeContainerStyle = (hasDescription) => ({
  marginTop: hasDescription ? "var(--scale-size-12)" : "var(--scale-size-8)",
});

const descriptionStyle = {
  marginTop: "var(--scale-size-12)",
};

const DEFAULT_PACKAGE_NAME = "@shopware-ag/meteor-component-library";
const COMPONENT_LIBRARY_GITHUB_TREE_URL = "https://github.com/shopware/meteor/tree/main";

function createImportCode(packageImports, packageName) {
  if (!packageImports) {
    return null;
  }

  const imports = Array.isArray(packageImports) ? packageImports : [packageImports];

  if (imports.length === 1) {
    return `import { ${imports[0]} } from "${packageName}";`;
  }

  return `import {\n  ${imports.join(",\n  ")},\n} from "${packageName}";`;
}

export default function ComponentPageHeader({
  title,
  tagName,
  status = "available",
  code,
  language = "ts",
  packageImports,
  packageName = DEFAULT_PACKAGE_NAME,
  sourcePath,
  children,
}) {
  const variant = STATUS_VARIANTS[status] ?? STATUS_VARIANTS.available;
  const sourceUrl = sourcePath ? `${COMPONENT_LIBRARY_GITHUB_TREE_URL}/${sourcePath}` : null;
  const displayedCode = code ?? createImportCode(packageImports, packageName);
  const displayedLanguage = code ? language : "ts";
  const markdownCodeBlock = displayedCode
    ? `\`\`\`${displayedLanguage}\n${displayedCode}\n\`\`\``
    : null;
  const hasDescription = Boolean(children);

  return React.createElement("div", { style: containerStyle }, [
    React.createElement(
      "h1",
      { key: "title" },
      title,
      " ",
      React.createElement(
        "span",
        { className: "sb-unstyled", style: titleTagStyle },
        `(${tagName})`,
      ),
    ),
    React.createElement(
      "div",
      { style: statusContainerStyle, key: "status" },
      React.createElement(
        "div",
        { style: statusHeaderStyle },
        React.createElement(
          "div",
          { style: statusInfoStyle },
          React.createElement("span", { style: labelStyle }, "Status:"),
          React.createElement(
            "span",
            { style: badgeStyle(variant) },
            React.createElement("span", {
              "aria-hidden": "true",
              style: indicatorStyle(variant),
            }),
            variant.label,
          ),
        ),
        sourceUrl
          ? React.createElement(
              "a",
              {
                className: "sb-unstyled",
                href: sourceUrl,
                rel: "noopener noreferrer",
                style: sourceLinkStyle,
                target: "_blank",
              },
              "GitHub",
            )
          : null,
      ),
    ),
    hasDescription
      ? React.createElement("div", { key: "description", style: descriptionStyle }, children)
      : null,
    markdownCodeBlock
      ? React.createElement(
          "div",
          { key: "code", style: codeContainerStyle(hasDescription) },
          React.createElement(Markdown, null, markdownCodeBlock),
        )
      : null,
  ]);
}
