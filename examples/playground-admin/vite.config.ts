import { fileURLToPath } from "node:url";
import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// @ts-expect-error - the plugin ships no usable type declarations
import svg from "vite-plugin-svgstring";

const librarySource = fileURLToPath(
  new URL("../../packages/component-library/src", import.meta.url),
);

/** `MtSegmentedControl` → `<src>/components/mt-segmented-control/mt-segmented-control.vue` */
function componentSourcePath(name: string) {
  const kebab = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  return path.join(librarySource, "components", kebab, `${kebab}.vue`);
}

export default defineConfig({
  plugins: [vue(), svg()],
  server: {
    port: 3002,
    strictPort: true,
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  define: {
    global: "globalThis",
  },
  resolve: {
    dedupe: ["vue", "vue-i18n"],
    alias: [
      {
        find: /^@shopware-ag\/meteor-component-library$/,
        replacement: path.join(librarySource, "index.ts"),
      },
      {
        find: /^@shopware-ag\/meteor-component-library\/styles\.css$/,
        replacement: path.join(librarySource, "assets/css/all.css"),
      },
      {
        find: /^@shopware-ag\/meteor-component-library\/font\.css$/,
        replacement: path.join(
          librarySource,
          "assets/css/fonts/inter.font.css",
        ),
      },
      {
        find: /^@shopware-ag\/meteor-component-library\/(Mt\w+)$/,
        replacement: "$1",
        customResolver: (name) => componentSourcePath(name),
      },
      { find: "@", replacement: librarySource },
      { find: /^~(.*)$/, replacement: "$1" },
    ],
  },
});
