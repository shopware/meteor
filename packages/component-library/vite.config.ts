import path from "path";
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// @ts-expect-error - not typed
import svg from "vite-plugin-svgstring";
import dts from "vite-plugin-dts";
import { getAllComponents, libInjectCss, toPascalCase } from "./build/helper";

// Get all components and their paths
const allComponents = getAllComponents();

export const external = ["vue", "apexcharts", "vue-i18n"];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({}),
    svg(),
    dts({
      outDir: ["dist/esm", "dist/common"],
      cleanVueFileName: true,
      copyDtsFiles: true,
      tsconfigPath: path.resolve(__dirname, "tsconfig.vitest.json"),
      compilerOptions: {
        composite: false,
      },
      include: [
        "env.d.ts",
        "src/**/*",
        "src/**/*.vue",
        "src/**/*.ts",
        "src/**/*.js",
        "src/**/*.json",
      ],
      exclude: ["node_modules", "**/*.stories.ts", "**/*.spec.ts", "**/*.spec.js"],
      beforeWriteFile: (filePath, content) => {
        // Check if this is a component .d.ts file that needs to be flattened
        // filePath is an absolute path, so we need to handle it accordingly
        if (!filePath.endsWith(".d.ts")) return;

        // Check if it's in esm or common directory
        const esmMatch = filePath.match(/\/dist\/esm\/(.+)\.d\.ts$/);
        const commonMatch = filePath.match(/\/dist\/common\/(.+)\.d\.ts$/);

        if (!esmMatch && !commonMatch) return;

        const match = esmMatch || commonMatch;
        const format = esmMatch ? "esm" : "common";
        const relativePath = match?.[1]; // e.g., "components/form/mt-button/mt-button"

        // Extract the component file name (e.g., "mt-button" from "components/form/mt-button/mt-button")
        const fileName = relativePath ? path.basename(relativePath) : "";
        const pascalCaseName = toPascalCase(fileName);

        // Check if this component is in our allComponents entries
        if (allComponents[pascalCaseName]) {
          // Transform to flat structure: /absolute/path/dist/esm/MtButton.d.ts
          const distIndex = filePath.indexOf("/dist/");
          const basePath = filePath.substring(0, distIndex);
          const newFilePath = `${basePath}/dist/${format}/${pascalCaseName}.d.ts`;
          return { filePath: newFilePath };
        }
      },
    }),
    libInjectCss(),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        // this is required for the SCSS modules
        find: /^~(.*)$/,
        replacement: "$1",
      },
    ],
  },
  build: {
    sourcemap: 'hidden',
    cssMinify: false,
    minify: false,
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        fonts: path.resolve(__dirname, "src/fonts.ts"),
        ...allComponents,
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `${{ es: "esm", cjs: "common" }[format]}/${entryName}.js`,
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: external,
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "sass:math";
          @import "${path.resolve(__dirname, "src/components/assets/scss/variables.scss")}";
          @import "${path.resolve(__dirname, "src/components/assets/scss/mixins.scss")}";
        `,
      },
    },
  },
});
