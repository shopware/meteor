import type { StorybookConfig } from "@storybook/vue3-vite";
import { mergeConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-dark-mode",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  docs: {},
  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          // Ensure /node_modules/ paths resolve correctly in both dev and build
          "/node_modules": path.resolve(__dirname, "../node_modules"),
        },
      },
    });
  },
};
export default config;
