import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// @ts-expect-error - not typed
import svg from "vite-plugin-svgstring";
import dts from "unplugin-dts/vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";

// Every file in src/exports is one import path of the package: src/exports/MtButton.ts is "/MtButton".
const exportFiles = fs.readdirSync(path.resolve(__dirname, "src/exports"));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Drops template comments in development too, as the production build does, so a comment can't
    // turn a single-root template into a fragment in Storybook and the tests. Consumer templates keep
    // their comments in development, so test how components handle them with runtime template strings.
    vue({ template: { compilerOptions: { comments: false } } }),
    svg(),
    dts({
      processor: "vue",
      // ESM type files with explicit extensions on relative imports, which node16 and nodenext require
      outDirs: { dir: "dist", moduleFormat: "esm" },
      entryRoot: "src",
      cleanVueFileName: true,
      tsconfigPath: path.resolve(__dirname, "tsconfig.vitest.json"),
      compilerOptions: {
        composite: false,
      },
      include: ["src/**/*"],
      exclude: [
        "node_modules",
        "**/*.stories.ts",
        "**/*.spec.ts",
        "**/*.spec.js",
        "**/*story-helper.ts",
        "**/*test-helper.ts",
        // Only used by stories
        "**/_mocks/**",
        "**/example-radio-option.vue",
      ],
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
    sourcemap: false,
    // CSS must go through esbuild so the native CSS nesting in our styles is
    // flattened for browsers without nesting support; Vite only applies
    // cssTarget inside the minify step. JS stays unminified on purpose —
    // consumers' bundlers minify it, and readable output helps debugging.
    cssMinify: true,
    cssTarget: ["chrome87", "firefox78", "safari14", "edge88"],
    minify: false,
    lib: {
      entry: [
        path.resolve(__dirname, "src/index.ts"),
        ...exportFiles.map((file) => path.resolve(__dirname, "src/exports", file)),
      ],
      formats: ["es"],
      fileName: (_format, name) => (name === "index" ? "index.js" : `exports/${name}.js`),
    },
    cssCodeSplit: true,
    rollupOptions: {
      // Packages stay imports, so apps install the dependencies once and share them with the library
      external: (id) =>
        !id.startsWith(".") && !id.startsWith("@/") && !id.startsWith("\0") && !path.isAbsolute(id),
      output: {
        // Rollup otherwise adds an `import "<chunk or dependency>"` to each entry for everything the
        // entries it imports depend on, so apps would load the dependencies of unused components.
        hoistTransitiveImports: false,
      },
    },
  },
});
