import path from "path";
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// @ts-expect-error - not typed
import svg from "vite-plugin-svgstring";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({}),
    svg(),
    dts({
      outDir: ["dist/esm", "dist/common"],
      cleanVueFileName: true,
      copyDtsFiles: true,
      compilerOptions: {
        moduleResolution: 99,
      },
    }),
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
      entry: "src/index.ts",
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `${{ es: "esm", cjs: "common" }[format]}/${entryName}.js`,
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: ["vue"],
      input: {
        index: path.resolve(__dirname, "src/index.ts"),
        fonts: path.resolve(__dirname, "src/fonts.ts"),
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
