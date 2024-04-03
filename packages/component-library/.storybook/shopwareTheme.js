import { create } from "@storybook/theming";
import { color, typography, background } from "@storybook/theming";

export const darkTheme = create({
  base: "dark",

  // Brand specifc stuff
  brandTitle: "Shopware",
  brandUrl: "https://docs.shopware.com",
  brandImage: "https://meteor-component-library.vercel.app/shopware_docs_horizontal_white.svg",
  brandTarget: "_self",

  // Storybook-specific color palette
  colorPrimary: "#BABABA", // coral
  colorSecondary: "#5DBBFF", // ocean

  // UI
  appBg: "#2f2f2f",
  appContentBg: "#29333d",
  appBorderColor: "rgba(255,255,255,.1)",
  appBorderRadius: 4,

  // Fonts
  fontBase: typography.fonts.base,
  fontCode: typography.fonts.mono,

  // Text colors
  textColor: color.lightest,
  textInverseColor: "#29333d",
  textMutedColor: "#8599ad",

  // Toolbar default and active colors
  barTextColor: "#999999",
  barSelectedColor: "#5DBBFF",
  barBg: "#29333d",

  // Form colors
  inputBg: "#3f3f3f",
  inputBorder: "rgba(0,0,0,.3)",
  inputTextColor: color.lightest,
  inputBorderRadius: 4,
});

export const lightTheme = create({
  base: "light",

  // Brand specifc stuff
  brandTitle: "Shopware",
  brandUrl: "https://docs.shopware.com",
  brandImage: "https://meteor-component-library.vercel.app/shopware_docs_horizontal_dark.svg",
  brandTarget: "_self",

  // Storybook-specific color palette
  colorPrimary: "#BABABA", // coral
  colorSecondary: "#5DBBFF", // ocean

  // UI
  appBg: "#f9fafb",
  appContentBg: color.lightest,
  appBorderColor: color.border,
  appBorderRadius: 4,

  // Fonts
  fontBase: typography.fonts.base,
  fontCode: typography.fonts.mono,

  // Text colors
  textColor: "#29333d",
  textInverseColor: color.lightest,
  textMutedColor: "#52667a",

  // Toolbar default and active colors
  barTextColor: "#8599ad",
  barSelectedColor: "#5DBBFF",
  barBg: color.lightest,

  // Form colors
  inputBg: color.lightest,
  inputBorder: color.border,
  inputTextColor: "#29333d",
  inputBorderRadius: 4,
});
