import path from "path";
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// @ts-expect-error - not typed
import svg from "vite-plugin-svgstring";
import dts from "vite-plugin-dts";
import Inspect from 'vite-plugin-inspect'
import fs from 'fs'

// Get all dependencies from package.json
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
const dependencies = Object.keys(pkg.dependencies || {});
const peerDependencies = Object.keys(pkg.peerDependencies || {});
const allExternalPackages = [...dependencies, ...peerDependencies];

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
    }),
    Inspect({
      build: true,
      outputDir: '.vite-inspect'
    })
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
    sourcemap: true,
    cssMinify: false,
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        fonts: path.resolve(__dirname, "src/fonts.ts"),
      },
      formats: ["es"],
      fileName: (format, entryName) => `${{ es: "esm", cjs: "common" }[format]}/${entryName}.js`,
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: (id: string) => {
        // 4. Check if the ID starts with any known package name OR is a Vue internal path
        const isExternalPackage = allExternalPackages.some(pkgName => id.startsWith(pkgName));
        const isVueInternal = id.startsWith('vue') || id.startsWith('@vue/');

        return isExternalPackage || isVueInternal;
      },
      input: {
        index: path.resolve(__dirname, "src/index.ts"),
        fonts: path.resolve(__dirname, "src/fonts.ts"),
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: path.resolve(__dirname, "src"),
        globals: {
          vue: "Vue",
        },
      }
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
