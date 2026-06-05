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
  margin: "0.75rem 0",
};

const statusContainerStyle = {
  marginTop: "1.25rem",
  marginBottom: "1.25rem",
};

const statusHeaderStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.75rem",
  flexWrap: "wrap",
};

const statusInfoStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
};

const labelStyle = {
  fontFamily: "inherit",
  fontSize: 15,
  lineHeight: "inherit",
  fontWeight: 700,
  color: "var(--color-text-primary-default)",
};

const titleTagStyle = {
  color: "var(--color-text-secondary-default)",
  fontWeight: 400,
};

const badgeStyle = (variant) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem",
  height: "1.25rem",
  padding: "0 0.5rem",
  borderRadius: "624.9375rem",
  border: `1px solid ${variant.borderColor}`,
  backgroundColor: variant.backgroundColor,
  color: "var(--color-text-primary-default)",
  fontFamily: "var(--font-family-body)",
  fontSize: 13,
  lineHeight: "1.125rem",
  fontWeight: 500,
});

const sourceLinkStyle = {
  borderLeft: "1px solid var(--color-border-secondary-default)",
  color: "var(--color-text-brand-default)",
  paddingLeft: "1rem",
  textDecoration: "underline",
  fontSize: 15,
};

const indicatorStyle = (variant) => ({
  width: "0.5rem",
  height: "0.5rem",
  borderRadius: "0.75rem",
  backgroundColor: variant.indicatorColor,
  flexShrink: 0,
});

const codeContainerStyle = (hasDescription) => ({
  marginTop: hasDescription ? "0.75rem" : "0.5rem",
});

const descriptionStyle = {
  marginTop: "0.75rem",
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

const NPM_PACKAGE_URL = "https://www.npmjs.com/package/";

export default function StorybookPageHeader({
  title,
  tagName,
  status,
  code,
  language = "ts",
  packageImports,
  packageName = DEFAULT_PACKAGE_NAME,
  sourcePath,
  sourceUrl: sourceUrlProp,
  npmPackage,
  children,
}) {
  const variant = status === "none" ? null : STATUS_VARIANTS[status] ?? STATUS_VARIANTS.available;
  const sourceUrl =
    sourceUrlProp ?? (sourcePath ? `${COMPONENT_LIBRARY_GITHUB_TREE_URL}/${sourcePath}` : null);
  const npmUrl = npmPackage ? `${NPM_PACKAGE_URL}${npmPackage}` : null;
  const displayedCode = code ?? createImportCode(packageImports, packageName);
  const displayedLanguage = code ? language : "ts";
  const markdownCodeBlock = displayedCode
    ? `\`\`\`${displayedLanguage}\n${displayedCode}\n\`\`\``
    : null;
  const hasDescription = Boolean(children);
  const showStatusRow = variant || sourceUrl || npmUrl;

  const links = [
    sourceUrl ? { key: "github", href: sourceUrl, label: "GitHub" } : null,
    npmUrl ? { key: "npm", href: npmUrl, label: "npm" } : null,
  ].filter(Boolean);

  return React.createElement("div", { style: containerStyle }, [
    React.createElement(
      "h1",
      { key: "title" },
      title,
      tagName
        ? React.createElement(
            "span",
            { className: "sb-unstyled", style: { ...titleTagStyle, marginLeft: "0.25em" } },
            `(${tagName})`,
          )
        : null,
    ),
    showStatusRow
      ? React.createElement(
          "div",
          { style: statusContainerStyle, key: "status" },
          React.createElement(
            "div",
            { style: statusHeaderStyle },
            variant
              ? React.createElement(
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
                )
              : null,
            ...links.map((link, index) => {
              const isFirstWithoutBadge = !variant && index === 0;
              return React.createElement(
                "a",
                {
                  className: "sb-unstyled",
                  href: link.href,
                  key: link.key,
                  rel: "noopener noreferrer",
                  style: isFirstWithoutBadge
                    ? { ...sourceLinkStyle, borderLeft: "none", paddingLeft: 0 }
                    : sourceLinkStyle,
                  target: "_blank",
                },
                link.label,
              );
            }),
          ),
        )
      : null,
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
