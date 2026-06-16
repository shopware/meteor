import remarkGfmModule from "remark-gfm";
import type { StorybookConfig } from "@storybook/vue3-vite";
import { mergeConfig } from "vite";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const remarkGfm = (remarkGfmModule as any).default ?? remarkGfmModule;

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    {
      // eslint-disable-next-line storybook/no-uninstalled-addons
      name: "@storybook/addon-docs",
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    {
      name: "@storybook/addon-essentials",
      options: {
        backgrounds: false,
        outline: false,
        docs: false,
      },
    },
    "@storybook/addon-interactions",
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
          "/node_modules": path.resolve(__dirname, "../node_modules"),
        },
      },
    });
  },
};
export default config;
