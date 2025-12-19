// This file has been automatically migrated to valid ESM format by Storybook.
import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  docs: {},
};

export default config;
