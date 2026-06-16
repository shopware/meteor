import { create } from "@storybook/theming";

export const shopwareTheme = create({
  base: "light",

  brandTitle: "Shopware",
  brandUrl: "https://github.com/shopware/meteor",
  brandImage: "https://meteor-component-library.vercel.app/shopware_docs_horizontal_dark.svg",
  brandTarget: "_blank",

  colorPrimary: "#0870ff",
  colorSecondary: "#0870ff",

  // UI
  appBg: "#ffffff",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: "#e2e3e9",
  appBorderRadius: 6,

  // Fonts
  fontBase: '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
  fontCode: 'ui-monospace, "SFMono-Regular", "Cascadia Mono", "Segoe UI Mono", Menlo, monospace',

  // Text colors
  textColor: "#1e1e24",
  textInverseColor: "#ffffff",
  textMutedColor: "#696a6e",

  // Toolbar
  barTextColor: "#696a6e",
  barSelectedColor: "#0870ff",
  barBg: "#ffffff",

  // Form
  inputBg: "#ffffff",
  inputBorder: "#e2e3e9",
  inputTextColor: "#1e1e24",
  inputBorderRadius: 6,
});
