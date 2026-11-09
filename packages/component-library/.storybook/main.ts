import type { StorybookConfig } from "@storybook/vue3-vite";
import { mergeConfig } from "vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    {
      name: "@storybook/addon-essentials",
      options: {
        backgrounds: false,
        outline: false,
      },
    },
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  // Storybook files, and the package files from public/ such as font.css
  staticDirs: ["./public", "../public"],
  docs: {},
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "/node_modules": path.resolve(__dirname, "../node_modules"),
        },
      },
    });
  },
};
export default config;
